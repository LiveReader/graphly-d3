import ForceSimulation from "./forceSimulation";
import NodeLoader from "../shape/NodeLoader";
import { Template } from "../types/Template";
import { dragNode } from "./drag";
import { Event } from "./eventStore";

import { Graph } from "../types/Graph";
import { Node } from "../types/Node";
import { Link, LinkType } from "../types/Link";

export function indexLinks(graph: Graph) {
	graph.nodes.forEach((node: Node) => {
		const links: Link[] = [];
		graph.links.forEach((link: Link) => {
			if (link.source == node.id || (link.source as Node).id == node.id) {
				links.push(link);
			}
		});
		const groupedLinks: { [key: string]: Link[] } = {};
		links.forEach((link: Link) => {
			if (typeof link.target == "object") {
				const targetID = typeof link.target === "string" ? link.target : link.target.id;
				if (!groupedLinks[targetID]) {
					groupedLinks[targetID] = [];
				}
				groupedLinks[targetID].push(link);
			} else {
				if (!groupedLinks[link.target]) {
					groupedLinks[link.target] = [];
				}
				groupedLinks[link.target].push(link);
			}
		});
		Object.keys(groupedLinks).forEach((targetId: string) => {
			groupedLinks[targetId].forEach((link: Link, index: number) => {
				link.i = index;
			});
			groupedLinks[targetId].sort((a: Link, b: Link) => (a.index ?? 0) - (b.index ?? 0));
		});
	});
}

export async function renderNodes(this: ForceSimulation, graph: Graph) {
	await getNodeTemplates.bind(this)(graph);
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
		.call(dragNode.bind(this)() as any)
		.on("click", (e: any, d: Node) => {
			this.eventStore.emit(Event.NodeClick, e, d);
			e.stopPropagation();
		})
		.on("dblclick", (e: any, d: Node) => {
			this.eventStore.emit(Event.NodeDoubleClick, e, d);
			e.stopPropagation();
		})
		.on("contextmenu", (e: any, d: Node) => {
			this.eventStore.emit(Event.NodeContextMenu, e, d);
			e.stopPropagation();
		})
		.attr("opacity", 0)
		.transition()
		.duration(this.animationDuration)
		.attr("opacity", 1);

	// remove deleted nodes
	nodeShapes.exit().transition().duration(this.animationDuration).attr("opacity", 0).remove();

	// update existing nodes
	nodeShapes
		.each((d: any) => {
			const node = nodeShapes.filter((n: any) => n.id === d.id);
			node.select(NodeLoader);
		})
		.attr("opacity", 1);
}

export function renderLinks(this: ForceSimulation, graph: Graph) {
	const linkShapes = this.selectionGroups.links
		.selectAll("[data-object='link']")
		.data(graph.links, (d: any) => linkID(d as Link));

	const linkShape = linkShapes
		.enter()
		.append("g")
		.attr("data-object", "link")
		.classed("gly-link", true)
		.on("click", (e: any, d: Link) => {
			this.eventStore.emit(Event.LinkClick, e, d);
			e.stopPropagation();
		})
		.on("dblclick", (e: any, d: Link) => {
			this.eventStore.emit(Event.LinkDoubleClick, e, d);
			e.stopPropagation();
		})
		.on("contextmenu", (e: any, d: Link) => {
			this.eventStore.emit(Event.LinkContextMenu, e, d);
			e.stopPropagation();
		});

	linkShape
		.append("path")
		.attr("data-object", "link-line")
		.classed("gly-link-line", true)
		.classed("solid", (d: Link) => (!d.type ? true : d.type === LinkType.Solid))
		.classed("dashed", (d: Link) => d.type === LinkType.Dashed)
		.classed("dotted", (d: Link) => d.type === LinkType.Dotted)
		.classed("hidden", (d: Link) => d.type === LinkType.Hidden);
	linkShape
		.append("path")
		.attr("data-object", "link-arrow-head")
		.classed("gly-link-arrow", true)
		.classed("gly-link-arrow-head", true)
		.classed("hidden", (d: Link) => d.type === LinkType.Hidden);
	linkShape
		.append("path")
		.attr("data-object", "link-arrow-tail")
		.classed("gly-link-arrow", true)
		.classed("gly-link-arrow-tail", true)
		.classed("hidden", (d: Link) => d.type === LinkType.Hidden);
	linkShape
		.append("text")
		.attr("data-object", "link-label")
		.classed("gly-link-label", true)
		.text((d: Link) => (d.type !== LinkType.Hidden ? d.label ?? "" : ""))
		.attr("text-anchor", "middle")
		.attr("dominant-baseline", "central")
		.attr("dy", "0.35em");
	linkShape.attr("opacity", 0).transition().duration(this.animationDuration).attr("opacity", 1);

	linkShapes.exit().transition().duration(this.animationDuration).attr("opacity", 0).remove();
	linkShapes.attr("opacity", 1).transition().duration(this.animationDuration);
}

async function getNodeTemplates(this: ForceSimulation, graph: Graph) {
	for (let i in graph.nodes) {
		const node = graph.nodes[i];
		await this.templateStore.get(node).then((template: Template) => {
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

function linkID(link: Link): string {
	return (
		(typeof link.source === "string" ? link.source : link.source.id) +
		(typeof link.target === "string" ? link.target : link.target.id) +
		link.type +
		link.directed +
		link.label +
		link.strength
	);
}
