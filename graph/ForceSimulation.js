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
			.force("gravity", d3.forceManyBody().strength(-50000))
			.force("center", d3.forceCenter(window.innerWidth / 2, window.innerHeight / 2))
			.force("collide", d3.forceCollide().radius(100))
			.on("tick", this.ticked.bind(this));
	}

	setData(graph) {
		this.graph = graph;
		this.simulation.nodes(graph.nodes);
		this.simulation.force("link").links(graph.links);
		this.simulation.alphaTarget(0).restart();
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
		this.nodeGroup.selectAll("g.node").attr("transform", (d) => `translate(${d.x},${d.y})`);
		this.linkGroup
			.selectAll("line.link")
			.attr("x1", (d) => d.source.x)
			.attr("y1", (d) => d.source.y)
			.attr("x2", (d) => d.target.x)
			.attr("y2", (d) => d.target.y);
	}

	render() {
		this.nodeGroup.selectAll("g.node").remove();
		this.linkGroup.selectAll("line.link").remove();

		this.nodeGroup
			.selectAll("g.node")
			.data(graph.nodes)
			.enter()
			.append("g")
			.classed("node", true)
			.attr("id", (d) => d.id)
			.call((d) => {
				// Build all person hexagon nodes
				new PersonHexagonFactory(this, d, 300).render();
			})
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
			this.simulation.alphaTarget(0.05).restart();
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

	displayCrossHair() {
		if (this.corsshairGroup) {
			return;
		}
		// centered crosshair in the middle of the screen
		this.corsshairGroup = this.world.append("g").attr("id", "crosshair");

		this.corsshairGroup
			.append("line")
			.attr("x1", window.innerWidth / 2 + 400)
			.attr("x2", window.innerWidth / 2 - 400)
			.attr("y1", window.innerHeight / 2)
			.attr("y2", window.innerHeight / 2)
			.attr("stroke", "#6c6d8d")
			.attr("stroke-width", 1);

		this.corsshairGroup
			.append("line")
			.attr("x1", window.innerWidth / 2)
			.attr("x2", window.innerWidth / 2)
			.attr("y1", window.innerHeight / 2 + 400)
			.attr("y2", window.innerHeight / 2 - 400)
			.attr("stroke", "#6c6d8d")
			.attr("stroke-width", 1);
	}

	hideCrossHair() {
		if (!this.corsshairGroup) {
			return;
		}
		this.corsshairGroup.remove();
	}
}
