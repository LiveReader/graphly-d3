import TemplateStore from "../templateStore";
import NodeLoader from "../shape/NodeLoader";
import { Template } from "../types/Template";

import { Graph } from "../types/Graph";
import { Node } from "../types/Node";
import ForceSimulation from "./forceSimulation";

export async function renderNodes(this: ForceSimulation, graph: Graph) {
	await getNodeTemplates(graph);
	graph.nodes.forEach((node: Node) => {
		node.forceSimulation = this;
	});
	spawnNodes(graph.nodes);

	const nodeShapes = this.selectionGroups.nodes
		.selectAll("[data-object='node']")
		.data(graph.nodes, (d: any) => (d as Node).id);

	// create new nodes
	nodeShapes
		.enter()
		.append(NodeLoader.bind(this))
		.attr("data-object", "node")
		.style("pointer-events", "fill")
		.attr("opacity", 0)
		.transition()
		.duration(this.animationDuration)
		.attr("opacity", 1);

	// remove deleted nodes
	nodeShapes.exit().transition().duration(this.animationDuration).attr("opacity", 0).remove();

	// update existing nodes
	nodeShapes.each((d: any) => {
		const node = nodeShapes.filter((n: any) => n.id === d.id);
		node.select(NodeLoader);
	});
}

async function getNodeTemplates(graph: Graph) {
	for (let i in graph.nodes) {
		const node = graph.nodes[i];
		await TemplateStore.get(node).then((template: Template) => {
			node.shape.template = template;
		});
	}
}

function spawnNodes(nodes: Node[]) {
	for (let i in nodes) {
		const node = nodes[i];
		if (!node.x && !node.y) continue;
		if (!node.fx && !node.fy) continue;
		if (node.anchor?.x || node.anchor?.y) continue;
		if (node.satellite?.x || node.satellite?.y) continue;
		if (node.spawn) {
			const sourceID = typeof node.spawn.source === "string" ? node.spawn.source : node.spawn.source.id;
			const sourceNode = nodes.find((n: Node) => n.id === sourceID);
			const sourcePos = {
				x: sourceNode?.x ?? sourceNode?.fx ?? sourceNode?.anchor?.x ?? 0,
				y: sourceNode?.y ?? sourceNode?.fy ?? sourceNode?.anchor?.y ?? 0,
			};
			const distance = node.spawn.distance;
			const angle = node.spawn.angle;
			const pos = {
				x: sourcePos.x + distance * Math.cos((angle * Math.PI) / 180 - Math.PI / 2),
				y: sourcePos.y + distance * Math.sin((angle * Math.PI) / 180 - Math.PI / 2),
			};
			node.x = pos.x;
			node.y = pos.y;
		}
	}
}
