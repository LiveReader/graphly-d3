/* eslint-disable no-dupe-class-members */
import * as d3 from "d3";
import Edge from "./edge/Edge.js";
import Node from "./shape/NodeLoader.js";
import TemplateAPI from "./shape/TemplateAPI.js";

import "./styles/graph.scss";

export class ForceSimulation {
	onNewEdgeEvent = () => {};
	onBackgroundClick = () => {};
	onNodeClick = () => {};
	onNodeContextClick = () => {};

	constructor(svg) {
		if (ForceSimulation.instance) {
			return ForceSimulation.instance;
		}
		ForceSimulation.instance = this;

		this.svg = svg;
		this.graph = { nodes: [], links: [] };
		this.worldTransform = { k: 1, x: svg.attr("width") / 2, y: svg.attr("height") / 2 };
		this.onZoomRegistrations = [];
		this.onZoomRoutines = {};

		this.createWorld();
		this.createSimulation();
		this.setDrag();
		this.setZoom();
		svg.call(
			this.zoom.transform,
			d3.zoomIdentity.translate(this.svg.attr("width") / 2, this.svg.attr("height") / 2).scale(1)
		)
			.on("dblclick.zoom", null)
			.on("click", (e) => {
				if (e.srcElement == this.svg.node()) {
					this.onBackgroundClick(e);
				}
			});
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
			.force(
				"gravity",
				d3.forceManyBody().strength(() => {
					return -35000;
				})
			)
			.force("center", d3.forceCenter(0, 0))
			.force(
				"collide",
				d3.forceCollide().radius((d) => {
					const template = TemplateAPI.get(d.shape.type);
					(template.shapeSize / 2 ?? 150) * (d.shape.scale ?? 1);
				})
			)
			.on("tick", this.ticked.bind(this));
	}

	setData(graph) {
		this.sortGraph(graph);
		this.graph = graph;
		this.simulation.nodes(this.graph.nodes);
		this.simulation.force("link").links(this.graph.links);
		this.simulation.alphaTarget(0).restart();
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
		let svg = this.svg;
		let graph = this.graph;
		let simulation = this.simulation;
		let linkGroup = this.linkGroup;
		let onNewEdge = (source, target) => this.onNewEdgeEvent(source, target);
		let newEdge = null;

		function prepare() {
			const forceSimulation = new ForceSimulation();
			svg = forceSimulation.svg;
			graph = forceSimulation.graph;
			simulation = forceSimulation.simulation;
			linkGroup = forceSimulation.linkGroup;
			onNewEdge = forceSimulation.onNewEdgeEvent;
		}

		function dragstarted(e, d) {
			prepare();
			// new edge
			if (e.sourceEvent.altKey) {
				newEdge = linkGroup
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
			simulation.alphaTarget(0.05).restart();
			d.fx = e.x;
			d.fy = e.y;
		}
		function dragged(e, d) {
			// new edge
			if (newEdge) {
				newEdge.attr("x2", e.x).attr("y2", e.y);
				return;
			}
			// drag node
			d.fx = e.x;
			d.fy = e.y;
		}
		function dragended(e, d) {
			// new edge
			if (newEdge) {
				let node = e.sourceEvent.target;
				if (node == svg.node()) {
					newEdge.node().parentNode.remove();
					newEdge = null;
					return;
				}
				while (node.classList.contains("node") == false) {
					if (node == null) {
						newEdge.node().parentNode.remove();
						newEdge = null;
						return;
					}
					node = node.parentNode;
				}
				const graphNode = graph.nodes.find((n) => n.id == node.id);
				newEdge.node().parentNode.remove();
				newEdge = null;
				if (!graphNode) return;
				if (graphNode.id == d.id) return;
				onNewEdge(d, graphNode);
				return;
			}
			// drag node
			simulation.alphaTarget(0);
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
				this.world.attr("transform", transform);
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
		this.nodeGroup.selectAll("g.node").attr("transform", (d) => `translate(${d.x},${d.y})`);
		this.linkGroup.selectAll("g.link").call((d) => {
			const edge = d.select(".edge");
			edge.attr("d", Edge.line);
			const arrow = d.select(".arrow");
			arrow.attr("d", Edge.arrow);
			const label = d.select(".label");
			label.attr("transform", Edge.labelPosition);
		});
	}

	render(graph) {
		this.setData(graph);

		const nodes = this.nodeGroup.selectAll("g.node").data(this.graph.nodes);
		nodes
			.enter()
			.append(Node)
			.classed("shadow", true)
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
		nodes.exit().transition().duration(300).attr("opacity", 0).remove();
		nodes.select((d) => {
			let node = nodes.filter((n) => n.id === d.id);
			node.select(Node);
		});
		nodes.classed("selected", (d) => d.selected);

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