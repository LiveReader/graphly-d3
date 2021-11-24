class ForceSimulation {
	constructor(svg, graph) {
		this.svg = svg;
		this.graph = graph;

		this.createWorld();
		this.createSimulation();
		this.setZoom();
		this.setData(graph);
		this.render();
	}

	createWorld() {
		this.world = this.svg.append("g").attr("id", "world");
		this.linkGroup = this.world.append("g").attr("id", "links");
		this.nodeGroup = this.world.append("g").attr("id", "nodes");
	}

	createSimulation() {
		this.simulation = d3
			.forceSimulation()
			.force(
				"link",
				d3.forceLink().id((d) => d.id)
			)
			.force("gravity", d3.forceManyBody().strength(-10000))
			.force("center", d3.forceCenter(window.innerWidth / 2, window.innerHeight / 2))
			.force(
				"collide",
				d3.forceCollide().radius((d) => d.r)
			)
			.on("tick", this.ticked.bind(this));
	}

	setData(graph) {
		this.graph = graph;
		this.simulation.nodes(graph.nodes);
		this.simulation.force("link").links(graph.links);
		this.simulation.alphaTarget(0.1).restart();
	}

	setZoom() {
		this.svg.call(
			d3
				.zoom()
				.extent([
					[-100, -100],
					[window.innerWidth + 100, window.innerHeight + 100],
				])
				.scaleExtent([0.1, 5])
				.on("zoom", ({ transform }) => {
					this.world.attr("transform", transform);
				})
		);
	}

	ticked() {
		this.nodeGroup
			.selectAll("circle")
			.attr("cx", (d) => d.x)
			.attr("cy", (d) => d.y);
		this.linkGroup
			.selectAll("line")
			.attr("x1", (d) => d.source.x)
			.attr("y1", (d) => d.source.y)
			.attr("x2", (d) => d.target.x)
			.attr("y2", (d) => d.target.y);
	}

	render() {
		this.nodeGroup
			.selectAll("circle")
			.data(graph.nodes)
			.enter()
			.append("circle")
			.attr("r", (d) => d.r)
			.classed("node", true)
			.call(this.dragNode());

		this.linkGroup.selectAll("line").data(graph.links).enter().append("line").classed("link", true);
	}

	dragNode() {
		const drag = d3
			.drag()
			.on("start", dragstarted.bind(this))
			.on("drag", dragged.bind(this))
			.on("end", dragended.bind(this));
		function dragstarted(e, d) {
			this.simulation.alphaTarget(0.1).restart();
			d.fx = e.x;
			d.fy = e.y;
		}
		function dragged(e, d) {
			d.fx = e.x;
			d.fy = e.y;
		}
		function dragended(e, d) {
			this.simulation.alphaTarget(0);
			d.fx = null;
			d.fy = null;
		}
		return drag;
	}
}
