import * as d3 from "d3";
import Edge from "./edge/Edge.js";
import Node from "./shape/NodeLoader.js";
import TemplateAPI from "./shape/TemplateAPI.js";

import "./styles/graph.scss";

export default class ForceSimulation {
	onNewEdgeEvent = () => {};
	onBackgroundClick = () => {};
	onNodeClick = () => {};
	onNodeContextClick = () => {};

	constructor(svg) {
		this.svg = svg;
		this.graph = { nodes: [], links: [] };
		this.worldTransform = { k: 1, x: 0, y: 0 };
		this.worldBoundaries = {
			height: null,
			width: null,
		};
		this.onZoomRegistrations = [];
		this.onZoomRoutines = {};

		this.createWorld();
		this.createSimulation();
		this.setDrag();
		this.setZoom();
		svg.on("dblclick.zoom", null).on("click", (e) => {
			if (e.srcElement == this.svg.node()) {
				const worldPos = {
					x: e.x / this.worldTransform.k - this.worldTransform.x / this.worldTransform.k,
					y: e.y / this.worldTransform.k - this.worldTransform.y / this.worldTransform.k,
				};
				this.onBackgroundClick(e, worldPos);
			}
		});

		window.addEventListener("resize", () => {
			this.nodeGroup
				.selectAll("foreignObject.nodeWrapper")
				.attr("height", this.svg.attr("height"))
				.attr("width", this.svg.attr("width"));
			this.nodeGroup
				.selectAll("svg.nodeContainer")
				.attr("height", this.svg.attr("height"))
				.attr("width", this.svg.attr("width"));
			this.nodeGroup
				.selectAll("foreignObject.enabledWrapper")
				.attr("height", this.svg.attr("height"))
				.attr("width", this.svg.attr("width"));
			this.nodeGroup
				.selectAll("svg.enabledContainer")
				.attr("height", this.svg.attr("height"))
				.attr("width", this.svg.attr("width"));
			this.nodeGroup
				.selectAll("foreignObject.disabledWrapper")
				.attr("height", this.svg.attr("height"))
				.attr("width", this.svg.attr("width"));
			this.nodeGroup
				.selectAll("svg.disabledContainer")
				.attr("height", this.svg.attr("height"))
				.attr("width", this.svg.attr("width"));
		});

		function detectBrowser() {
			if (navigator.userAgent.includes("Chrome")) {
				return "chrome";
			}
			if (navigator.userAgent.includes("Firefox")) {
				return "firefox";
			}
			if (navigator.userAgent.includes("Safari")) {
				return "safari";
			}
		}
		document.body.className = detectBrowser();
	}

	setWorldBoundaries(height, width) {
		this.worldBoundaries.height = height;
		this.worldBoundaries.width = width;
	}

	createWorld() {
		this.world = this.svg.append("g").attr("id", "world");
		this.linkGroup = this.world.append("g").attr("id", "links");
		this.nodeGroup = this.world.append("g").attr("id", "nodes");
		this.enabledContainer = this.nodeGroup
			.append("foreignObject")
			.classed("enabledWrapper", true)
			.attr("height", this.svg.attr("height"))
			.attr("width", this.svg.attr("width"))
			.style("pointer-events", "none")
			.append("svg")
			.classed("enabledContainer", true)
			.attr("height", this.svg.attr("height"))
			.attr("width", this.svg.attr("width"))
			.style("pointer-events", "none");
		this.disabledContainer = this.nodeGroup
			.append("foreignObject")
			.classed("disabledWrapper", true)
			.attr("height", this.svg.attr("height"))
			.attr("width", this.svg.attr("width"))
			.style("pointer-events", "none")
			.append("svg")
			.classed("disabledContainer", true)
			.classed("disabled", true)
			.attr("height", this.svg.attr("height"))
			.attr("width", this.svg.attr("width"))
			.style("pointer-events", "none");
	}

	createSimulation() {
		this.simulation = d3
			.forceSimulation()
			.force(
				"link",
				d3.forceLink().id((d) => d.id)
			)
			.force(
				"gravity",
				d3.forceManyBody().strength(() => {
					return -35000;
				})
			)
			.force(
				"collide",
				d3.forceCollide().radius((d) => {
					const template = d.shape.template;
					return ((template.shapeSize ?? 150) / 2) * (d.shape.scale ?? 1);
				})
			)
			.on("tick", this.ticked.bind(this));
	}

	async setData(graph) {
		this.sortGraph(graph);
		await this.getNodeTemplates(graph);
		graph.nodes.forEach((node) => {
			node.forceSimulation = this;
			node.x = node.x ? node.x : this.svg.attr("width") / 2;
			node.y = node.y ? node.y : this.svg.attr("height") / 2;
		});
		this.graph = graph;
	}

	setTemplateOrigin(origin) {
		TemplateAPI.origin = origin;
	}

	async getNodeTemplates(graph) {
		for (let i = 0; i < graph.nodes.length; i++) {
			const node = graph.nodes[i];
			await TemplateAPI.get(node.shape.type).then((template) => {
				node.shape.template = template;
			});
		}
	}

	sortGraph(graph) {
		// go through each node and get all links having that node as source
		graph.nodes.forEach((node) => {
			const links = [];
			graph.links.forEach((link) => {
				if (link.source == node.id || link.source.id == node.id) {
					links.push(link);
				}
			});
			// sort the links in groups if they have the same target
			const groupedLinks = {};
			links.forEach((link) => {
				if (typeof link.target == "object") {
					if (!groupedLinks[link.target.id]) {
						groupedLinks[link.target.id] = [];
					}
					groupedLinks[link.target.id].push(link);
				} else {
					if (!groupedLinks[link.target]) {
						groupedLinks[link.target] = [];
					}
					groupedLinks[link.target].push(link);
				}
			});
			// run through each group
			Object.keys(groupedLinks).forEach((targetId) => {
				// assign incrementing index to each link
				groupedLinks[targetId].forEach((link, index) => {
					link.i = index;
				});
				// sort the links by index
				groupedLinks[targetId].sort((a, b) => a.index - b.index);
			});
		});
	}

	setDrag() {
		let newEdge = null;
		let dragOffset = { x: 0, y: 0 };

		function dragstarted(e, d) {
			const worldTransform = d.forceSimulation.worldTransform;
			// new edge
			if (e.sourceEvent.altKey) {
				dragOffset = {
					x: e.sourceEvent.offsetX / worldTransform.k - worldTransform.x / worldTransform.k - d.x,
					y: e.sourceEvent.offsetY / worldTransform.k - worldTransform.y / worldTransform.k - d.y,
				};

				newEdge = d.forceSimulation.linkGroup
					.append("g")
					.classed("prelink", true)
					.append("line")
					.classed("edge", true)
					.classed("solid", true)
					.attr("x1", d.x)
					.attr("y1", d.y)
					.attr("x2", e.x)
					.attr("y2", e.y);
				return;
			}
			// drag node
			d.forceSimulation.simulation.alphaTarget(0.05).restart();
			d.fx = e.x;
			d.fy = e.y;
		}
		function dragged(e, d) {
			// new edge
			if (newEdge) {
				const mousePos = {
					x: e.x + dragOffset.x,
					y: e.y + dragOffset.y,
				};
				newEdge.attr("x2", mousePos.x).attr("y2", mousePos.y);
				return;
			}
			// drag node
			d.fx = e.x;
			d.fy = e.y;
		}
		function dragended(e, d) {
			function removeNewEdge() {
				newEdge.node().parentNode.remove();
				newEdge = null;
				return;
			}
			// new edge
			if (newEdge) {
				let node = e.sourceEvent.target;
				if (node == d.forceSimulation.svg.node()) return removeNewEdge();
				while (node.classList.contains("node") == false) {
					if (node == null) return removeNewEdge();
					node = node.parentNode;
					if (!node.classList) return removeNewEdge();
				}
				const graphNode = d.forceSimulation.graph.nodes.find((n) => n.id == node.id);
				removeNewEdge();
				if (!graphNode) return;
				if (graphNode.id == d.id) return;
				d.forceSimulation.onNewEdgeEvent(d, graphNode);
				return;
			}
			// drag node
			d.forceSimulation.simulation.alphaTarget(0);
			d.fx = null;
			d.fy = null;
		}
		this.dragNode = d3.drag().on("start", dragstarted).on("drag", dragged).on("end", dragended);
	}

	setZoom() {
		this.zoom = d3
			.zoom()
			.extent([
				[0, 0],
				[window.innerWidth, window.innerHeight],
			])
			.scaleExtent([0.1, 3])
			.on("zoom", ({ transform }) => {
				this.nodeGroup.selectAll("g.nodeWorld").attr("transform", transform);
				this.linkGroup.attr("transform", transform);
				if (this.worldTransform.k != transform.k) {
					const movedRange = [this.worldTransform.k, transform.k].sort();
					Object.keys(this.onZoomRoutines).forEach((threshold) => {
						if (movedRange[0] < threshold && movedRange[1] > threshold) {
							this.onZoomRoutines[threshold].forEach((routine) => {
								routine(transform.k);
							});
						}
					});
				}
				this.worldTransform = transform;
			});
		this.svg.call(this.zoom);
	}

	registerOnZoom(id, threshold, callback = () => {}) {
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
		this.nodeGroup.selectAll("g.node").attr("transform", (d) => {
			if (!this.worldBoundaries.width || !this.worldBoundaries.height) return `translate(${d.x},${d.y})`;
			const min_y = 0;
			const max_y = this.worldBoundaries.height;
			const min_x = 0;
			const max_x = this.worldBoundaries.width;
			if (d.x < min_x) d.x = min_x;
			if (d.x > max_x) d.x = max_x;
			if (d.y < min_y) d.y = min_y;
			if (d.y > max_y) d.y = max_y;
			return `translate(${d.x},${d.y})`;
		});
		this.linkGroup.selectAll("g.link").call((d) => {
			const edge = d.select(".edge");
			edge.attr("d", Edge.line);
			const arrow = d.select(".arrow");
			arrow.attr("d", Edge.arrow);
			const label = d.select(".label");
			label.attr("transform", Edge.labelPosition);
		});
	}

	async render(graph) {
		await this.setData(graph);

		function renderWrapper(parent, selector, data) {
			const nodeWrappers = parent.selectAll(selector).data(data, (d) => d.id);
			const nodeWorlds = nodeWrappers
				.enter()
				.append("foreignObject")
				.classed("nodeWrapper", true)
				.attr("height", this.svg.attr("height"))
				.attr("width", this.svg.attr("width"))
				.style("pointer-events", "none")
				.append("svg")
				.classed("nodeContainer", true)
				.attr("height", this.svg.attr("height"))
				.attr("width", this.svg.attr("width"))
				.style("pointer-events", "none")
				.classed("shadow", true)
				.classed("selected", (d) => d.selected)
				.append("g")
				.classed("nodeWorld", true);

			nodeWorlds
				.append(Node.bind(this))
				.style("pointer-events", "fill")
				.call(this.dragNode)
				.on("click", (e, d) => {
					if (e.defaultPrevented) return; // dragged
					this.onNodeClick(e, d);
				})
				.on("contextmenu", (e, d) => {
					e.preventDefault();
					this.onNodeContextClick(e, d);
				})
				.attr("opacity", 0)
				.transition()
				.duration(300)
				.attr("opacity", 1);

			nodeWrappers.exit().transition().duration(300).attr("opacity", 0).remove();

			const nodes = nodeWrappers.selectAll("g.node");
			nodes.select((d) => {
				let node = nodes.filter((n) => n.id === d.id);
				node.select(Node);
			});
			const nodeContainers = nodeWrappers.selectAll("svg.nodeContainer");
			nodeContainers.classed("shadow", true).classed("selected", (d) => d.selected);
		}

		// enabled nodes
		const enabledNodes = this.graph.nodes.filter((d) => !d.disabled);
		renderWrapper.bind(this)(this.enabledContainer, "foreignObject.nodeWrapper", enabledNodes);

		// disabled nodes
		const disabledNodes = this.graph.nodes.filter((d) => d.disabled);
		renderWrapper.bind(this)(this.disabledContainer, "foreignObject.nodeWrapper", disabledNodes);

		const links = this.linkGroup.selectAll(".link").data(this.graph.links);
		const link = links.enter().append("g").classed("link", true);
		link.append("path")
			.classed("edge", true)
			.classed("solid", (d) => (!d.type ? true : d.type === "solid"))
			.classed("dotted", (d) => d.type === "dotted")
			.classed("dashed", (d) => d.type === "dashed");
		link.append("path").classed("arrow", true);
		link.append("text")
			.text((d) => d.label)
			.attr("text-anchor", "middle")
			.attr("dy", "0.35em")
			.classed("label", true);
		link.attr("opacity", 0).transition().duration(300).attr("opacity", 1);
		links.exit().transition().duration(300).attr("opacity", 0).remove();
		links.transition().duration(300);

		this.simulation.nodes(this.graph.nodes);
		this.simulation.force("link").links(this.graph.links);
		this.simulation.alphaTarget(0).restart();

		this.nodeGroup
			.selectAll("g.nodeWorld")
			.attr(
				"transform",
				`translate(${this.worldTransform.x}, ${this.worldTransform.y}) scale(${this.worldTransform.k})`
			);
		this.onZoomRegistrations.forEach((routine) => routine.callback(this.worldTransform.k));
	}

	onNewEdge(callback = () => {}) {
		this.onNewEdgeEvent = callback;
	}
	onBackground(callback = () => {}) {
		this.onBackgroundClick = callback;
	}
	onClick(callback = () => {}) {
		this.onNodeClick = callback;
	}
	onContextClick(callback = () => {}) {
		this.onNodeContextClick = callback;
	}
}
