import * as d3 from "d3";
import ForceSimulation from "./forceSimulation";

import { Node } from "../types/Node";

export interface DraggableNode extends Node {
	isDraged?: boolean;
}

export function dragNode(this: ForceSimulation): d3.DragBehavior<Element, unknown, unknown> {
	return d3
		.drag()
		.on("start", (e, d) => dragStart.bind(this)(e, d as DraggableNode))
		.on("drag", (e, d) => dragMove.bind(this)(e, d as DraggableNode))
		.on("end", (e, d) => dragEnd.bind(this)(e, d as DraggableNode));
}

function dragStart(this: ForceSimulation, e: d3.D3DragEvent<Element, unknown, unknown>, d: DraggableNode) {
	if (!this.draggableNodes) return;
	this.simulation.alphaTarget(0.05).restart();
	d.isDraged = true;
	d.fx = e.x;
	d.fy = e.y;
}

function dragMove(this: ForceSimulation, e: d3.D3DragEvent<Element, unknown, unknown>, d: DraggableNode) {
	if (!this.draggableNodes) return;
	d.fx = e.x;
	d.fy = e.y;
}

function dragEnd(this: ForceSimulation, e: d3.D3DragEvent<Element, unknown, unknown>, d: DraggableNode) {
	if (!this.draggableNodes) return;
	this.simulation.alphaTarget(0);
	d.isDraged = false;
	d.fx = null;
	d.fy = null;
}
