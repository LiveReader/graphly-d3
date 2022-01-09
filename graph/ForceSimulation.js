class ForceSimulation {
	constructor(svg) {
		if (ForceSimulation.instance) {
			return ForceSimulation.instance;
		}
		ForceSimulation.instance = this;

		this.svg = svg;
		this.graph = { nodes: [], links: [] };
		this.worldTransform = { k: 1, x: 0, y: 0 };
		this.onZoomRegistrations = [];
		this.onZoomRoutines = {};

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
						Object.keys(this.onZoomRoutines).forEach((threshold) => {
							const movedRange = [this.worldTransform.k, transform.k].sort();
							if (movedRange[0] < threshold && movedRange[1] > threshold) {
								this.onZoomRoutines[threshold].forEach((routine) => {
									routine(transform.k);
								});
							}
						});
					}
					this.worldTransform = transform;
				})
		);
	}

	registerOnZoom(id, threshold, callback = (k) => {}) {
		this.deregisterOnZoom(id);
		this.onZoomRegistrations.push({
			id: id,
			threshold: threshold,
			callback: callback,
		});
		this.orderOnZoomRoutines();
	}

	deregisterOnZoom(id) {
		this.onZoomRegistrations = this.onZoomRegistrations.filter((routine) => routine.id !== id);
		this.orderOnZoomRoutines();
	}

	orderOnZoomRoutines() {
		this.onZoomRoutines = {};
		this.onZoomRegistrations.forEach((routine) => {
			if (!this.onZoomRoutines[routine.threshold]) {
				this.onZoomRoutines[routine.threshold] = [];
			}
			this.onZoomRoutines[routine.threshold].push(routine.callback);
		});
	}

	ticked() {
		this.nodeGroup.selectAll("g.node").attr("transform", (d) => `translate(${d.x},${d.y})`);
		this.linkGroup.selectAll("g.link").call((d) => {
			const edge = d.select(".edge");
			edge.attr("d", renderEdge)
		});

		function renderEdge(d) {
			// curved edge with anchor points at the node centers but just been drawn 200 pixels away from the node center
			const dx = d.target.x - d.source.x;
			const dy = d.target.y - d.source.y;
			const dr = Math.sqrt(dx * dx + dy * dy);
			const r = dr - 200;
			const sourceSpace = 150 * d.source.shape.scale + 1;
			const targetSpace = 150 * d.target.shape.scale + 1;
			const theta = Math.atan2(dy, dx);
			const x1 = d.source.x + sourceSpace * Math.cos(theta);
			const y1 = d.source.y + sourceSpace * Math.sin(theta);
			const x2 = d.target.x - targetSpace * Math.cos(theta);
			const y2 = d.target.y - targetSpace * Math.sin(theta);
			return `M ${x1} ${y1} A ${r} ${r} 0 0 ${d.directed ? 1 : 0} ${x2} ${y2}`;
		}
	}

	render(graph) {
		this.setData(graph);

		const nodes = this.nodeGroup.selectAll("g.node").data(this.graph.nodes);
		nodes
			.enter()
			.append(Node)
			.classed("shadow", true)
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
				node.select(Node);
			});

		const links = this.linkGroup.selectAll("path").data(this.graph.links);
		const link = links.enter().append("g").classed("link", true);
		link.append("path")
			.classed("edge", true)
			.classed("solid", (d) => (!d.type ? true : d.type === "solid"))
			.classed("dotted", (d) => d.type === "dotted")
			.classed("dashed", (d) => d.type === "dashed");
		link.append("path")
			.classed("arrow", true)
			.attr("opacity", (d) => (d.directed ? 1 : 0));
		link.append("text")
			.text((d) => d.label)
			.attr("text-anchor", "middle")
			.attr("dy", "0.35em")
			.classed("label", true);
		link.attr("opacity", 0).transition().duration(300).attr("opacity", 1);
		links.exit().transition().duration(300).attr("opacity", 0).remove();
		links.transition().duration(300);

		this.onZoomRegistrations.forEach((routine) => routine.callback(this.worldTransform.k));
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
