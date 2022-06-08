import * as d3 from "d3";
import ForceSimulation from "./forceSimulation";

import { Event } from "./eventStore";
import { Node } from "../types/Node";

export interface DraggableNode extends Node {
	isDraged?: boolean;
}

let newLinkDraging = false;
let newLink: d3.Selection<SVGGElement, any, any, any>;
let dragOffset: { x: number; y: number } = { x: 0, y: 0 };

export function dragNode(this: ForceSimulation): d3.DragBehavior<Element, any, any> {
	return d3
		.drag()
		.on("start", (e, d) => dragStart.bind(this)(e, d as DraggableNode))
		.on("drag", (e, d) => dragMove.bind(this)(e, d as DraggableNode))
		.on("end", (e, d) => dragEnd.bind(this)(e, d as DraggableNode));
}

function dragStart(this: ForceSimulation, e: d3.D3DragEvent<Element, any, any>, d: DraggableNode) {
	const emitResponse = this.eventStore.emit(Event.NodeDragStart, e, d as Node, { x: e.x, y: e.y });
	if (emitResponse == "newlink") return dragNewLinkStart.bind(this)(e, d);
	if (!this.draggableNodes) return;
	this.simulation.alphaTarget(0.05).restart();
	d.isDraged = true;
	d.fx = e.x;
	d.fy = e.y;
}

function dragMove(this: ForceSimulation, e: d3.D3DragEvent<Element, any, any>, d: DraggableNode) {
	if (newLinkDraging) return dragNewLinkMove.bind(this)(e, d);
	if (!this.draggableNodes) return;
	d.fx = e.x;
	d.fy = e.y;
	this.eventStore.emit(Event.NodeDragMove, e, d as Node, { x: e.x, y: e.y });
}

function dragEnd(this: ForceSimulation, e: d3.D3DragEvent<Element, any, any>, d: DraggableNode) {
	if (newLinkDraging) return dragNewLinkEnd.bind(this)(e, d);
	if (!this.draggableNodes) return dragNewLinkEnd.bind(this)(e, d);
	if (!this.draggableNodes) return;
	this.simulation.alphaTarget(0);
	d.isDraged = false;
	d.fx = null;
	d.fy = null;
	this.eventStore.emit(Event.NodeDragEnd, e, d as Node, { x: e.x, y: e.y });
}

function dragNewLinkStart(this: ForceSimulation, e: d3.D3DragEvent<Element, any, any>, d: DraggableNode) {
	dragOffset = {
		x: e.sourceEvent.offsetX / this.worldTransform.k - this.worldTransform.x / this.worldTransform.k - (d.x ?? 0),
		y: e.sourceEvent.offsetY / this.worldTransform.k - this.worldTransform.y / this.worldTransform.k - (d.y ?? 0),
	};
	newLinkDraging = true;
	newLink = this.selectionGroups.links.append("g").attr("data-object", "prelink").classed("gly-prelink", true);
	newLink
		.append("line")
		.attr("data-object", "prelink-link-line")
		.classed("gly-link-line", true)
		.attr("x1", d.x ?? 0)
		.attr("y1", d.y ?? 0)
		.attr("x2", e.x)
		.attr("y2", e.y);
	this.eventStore.emit(Event.LinkDragStart, e, d as Node, { x: e.x, y: e.y });
}

function dragNewLinkMove(this: ForceSimulation, e: d3.D3DragEvent<Element, any, any>, d: DraggableNode) {
	const mousePos: { x: number; y: number } = {
		x: e.x + dragOffset.x,
		y: e.y + dragOffset.y,
	};
	newLink.select("[data-object='prelink-link-line']").attr("x2", mousePos.x).attr("y2", mousePos.y);
	this.eventStore.emit(Event.LinkDragMove, e, d as Node, { x: e.x, y: e.y });
}

function dragNewLinkEnd(this: ForceSimulation, e: d3.D3DragEvent<Element, any, any>, d: DraggableNode) {
	newLink.remove();
	newLinkDraging = false;
	let target = e.sourceEvent.target;
	if (target == this.svgElement)
		return this.eventStore.emit(Event.LinkDragEnd, e, d as Node, null, { x: e.x, y: e.y });
	while (target.attributes["data-object"] == null) {
		if (target == null) return this.eventStore.emit(Event.LinkDragEnd, e, d as Node, null, { x: e.x, y: e.y });
		target = target.parentElement;
		if (!target) return this.eventStore.emit(Event.LinkDragEnd, e, d as Node, null, { x: e.x, y: e.y });
	}
	target = target.parentElement;
	if (!target) return this.eventStore.emit(Event.LinkDragEnd, e, d as Node, null, { x: e.x, y: e.y });
	const targetNode = this.graph.nodes.find((n: Node) => n.id == target.attributes["data-id"].value ?? "");
	if (!targetNode) return this.eventStore.emit(Event.LinkDragEnd, e, d as Node, null, { x: e.x, y: e.y });
	if (targetNode.id == d.id) return this.eventStore.emit(Event.LinkDragEnd, e, d as Node, null, { x: e.x, y: e.y });
	this.eventStore.emit(Event.LinkDragEnd, e, d as Node, targetNode, { x: e.x, y: e.y });
}
