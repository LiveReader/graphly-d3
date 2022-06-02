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
