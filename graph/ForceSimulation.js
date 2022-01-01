class ForceSimulation {
	constructor(svg) {
		this.svg = svg;
		this.graph = { nodes: [], links: [] };
		this.worldTransform = { k: 1, x: 0, y: 0 };
		this.zoomRoutines = [];

		this.nodeFactory = new NodeFactory(this, 300);

		this.createWorld();
		this.createSimulation();
		this.setZoom();
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
			.force("gravity", d3.forceManyBody().strength(-20000))
			.force("center", d3.forceCenter(window.innerWidth / 2, window.innerHeight / 2))
			.force(
				"collide",
				d3.forceCollide().radius((d) => 150 * d.shape.scale)
			)
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
				.scaleExtent([0.1, 3])
				.on("zoom", ({ transform }) => {
					this.world.attr("transform", transform);
					if (this.worldTransform.k !== transform.k) {
						this.zoomRoutines.forEach((method) => method(transform.k));
					}
					this.worldTransform = transform;
				})
		);
	}

	onZoom(callback = (k) => {}) {
		this.zoomRoutines.push(callback);
	}

	ticked() {
		this.nodeGroup.selectAll("g.node").attr("transform", (d) => `translate(${d.x},${d.y})`);
		this.linkGroup.selectAll("path.link").attr("d", (d) => positionLink(d));

		function positionLink(d) {
			var midpoint_x = (d.source.x + d.target.x) / 2;
			var midpoint_y = (d.source.y + d.target.y) / 2;

			var dx = d.target.x - d.source.x;
			var dy = d.target.y - d.source.y;

			var normalise = Math.sqrt(dx * dx + dy * dy);
			var offset = 80;

			let hash = 0;
			let str = d.source.id + d.target.id;
			str.split("").forEach((char) => {
				hash += char.charCodeAt(0);
			});
			if (hash % 2 === 0) {
				offset = -offset;
			}

			var offSetX = midpoint_x + offset * (dy / normalise);
			var offSetY = midpoint_y - offset * (dx / normalise);

			return `M${d.source.x},${d.source.y}S${offSetX},${offSetY} ${d.target.x},${d.target.y}`;
		}
	}

	render(graph) {
		this.setData(graph);
		// this.zoomRoutines = [];
		// this.nodeGroup.selectAll("g.node").remove();
		// this.linkGroup.selectAll("path.link").remove();

		const nodes = this.nodeGroup.selectAll("g.node").data(eval(this.graph.nodes));
		nodes
			.enter()
			.append(TestShape)
			.call(this.dragNode())
			.attr("opacity", 0)
			.transition()
			.duration(300)
			.attr("opacity", 1);
		nodes.exit().transition().duration(300).attr("opacity", 0).remove();
		nodes
			.transition()
			.duration(300)
			.select((d) => {
				let node = nodes.filter((n) => n.id === d.id);
				node.select(TestShape);
			});

		const edges = this.linkGroup.selectAll("path").data(this.graph.links);
		edges
			.enter()
			.append("path")
			.classed("link", true)
			.attr("opacity", 0)
			.transition()
			.duration(300)
			.attr("opacity", 1);
		edges.exit().transition().duration(300).attr("opacity", 0).remove();
		edges.transition().duration(300);

		this.zoomRoutines.forEach((method) => method(this.worldTransform.k));
	}

	dragNode() {
		let nodeIndex = 0;

		const drag = d3
			.drag()
			.on("start", dragstarted.bind(this))
			.on("drag", dragged.bind(this))
			.on("end", dragended.bind(this));
		function dragstarted(e, d) {
			this.simulation.alphaTarget(0.05).restart();
			d.fx = e.x;
			d.fy = e.y;

			// move node to the front
			const currentNode = this.nodeGroup.select(`#${d.id}`).node();
			nodeIndex = Array.from(currentNode.parentNode.childNodes).indexOf(currentNode);
			currentNode.parentNode.appendChild(currentNode);
		}
		function dragged(e, d) {
			d.fx = e.x;
			d.fy = e.y;
		}
		function dragended(e, d) {
			this.simulation.alphaTarget(0);
			d.fx = null;
			d.fy = null;

			// move node back to its original index
			const currentNode = this.nodeGroup.select(`#${d.id}`).node();
			if (!currentNode) return;
			currentNode.parentNode.insertBefore(currentNode, currentNode.parentNode.childNodes[nodeIndex]);
		}
		return drag;
	}
}
