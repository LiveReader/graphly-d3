import ForceSimulation from "./forceSimulation";

import { Graph } from "../types/Graph";
import { Node, AnchorType } from "../types/Node";

export function ticked(this: ForceSimulation) {
	for (let i in this.graph.nodes) {
		processSatellite(this.graph, this.graph.nodes[i]);
		processAnchor(this.graph.nodes[i]);
	}

	this.selectionGroups.nodes
		.selectAll("[data-object='node']")
		.attr("transform", (d: any) => `translate(${d.x ?? 0},${d.y ?? 0})`);
	this.selectionGroups.links.selectAll("[data-object='link']").call((d: any) => {
		const line = d.select("[data-object='link-line']");
		line.attr("d", "");
		const headArrow = d.select("[data-object='link-arrow-head']");
		headArrow.attr("d", "");
		const tailArrow = d.select("[data-object='link-arrow-tail']");
		tailArrow.attr("d", "");
		const label = d.select("[data-object='link-label']");
		label.attr("transform", "");
	});
}

function processSatellite(graph: Graph, d: Node) {
	if (!d.satellite) return;
	if (typeof d.satellite.source === "string") {
		const source = graph.nodes.find((n) => n.id === d.satellite!.source);
		if (!source) return;
		d.satellite.source = source;
	}
	const distance = d.satellite.distance ?? 400;
	const angle = d.satellite.angle ?? 0;
	const pos: { x: number; y: number } = {
		x: d.satellite?.source?.x ?? 0 + distance * Math.cos((angle * Math.PI) / 180 - Math.PI / 2),
		y: d.satellite?.source?.y ?? 0 + distance * Math.sin((angle * Math.PI) / 180 - Math.PI / 2),
	};
	d.satellite.x = pos.x;
	d.satellite.y = pos.y;
}

function processAnchor(d: Node) {
	if (d.satellite) return;
	if (!d.anchor) return;
	d.fx = null;
	d.fy = null;
	if (d.anchor.type === AnchorType.Hard) {
		d.fx = d.anchor.x;
		d.fy = d.anchor.y;
	}
}


