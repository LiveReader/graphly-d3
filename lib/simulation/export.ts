import ForceSimulation from "./forceSimulation";

interface ExportLink {
	source: string;
	target: string;
	type?: string;
	directed?: boolean;
	label?: string;
	strength?: number | string;
	padding?: number;
}

interface ExportNode {
	id: string;
	x?: number;
	y?: number;
	shape: {
		type: string;
		scale: number;
		url?: string;
	};
	gravity?: number;
	anchor?: {
		type: string;
		x: number;
		y: number;
	};
	satellite?: {
		source: string;
		angle: number;
		distance: number;
	};
	payload?: any;
}

export interface ExportGraph {
	nodes: ExportNode[];
	links: ExportLink[];
}

export function exportGraph(this: ForceSimulation): ExportGraph {
	const nodes: ExportNode[] = [];
	const links: ExportLink[] = [];
	this.graph.nodes.forEach((node) => {
		const exportNode: ExportNode = {
			id: node.id,
			x: node.x,
			y: node.y,
			shape: {
				type: node.shape.type,
				scale: node.shape.scale,
				url: node.shape.url,
			},
			gravity: node.gravity,
			anchor: {
				type: node.anchor?.type || "",
				x: node.anchor?.x || 0,
				y: node.anchor?.y || 0,
			},
			satellite: {
				source:
					typeof node.satellite?.source === "string"
						? node.satellite.source
						: node.satellite?.source?.id || "",
				angle: node.satellite?.angle || 0,
				distance: node.satellite?.distance || 0,
			},
			payload: node.payload,
		};
		nodes.push(exportNode);
	});
	this.graph.links.forEach((link) => {
		const exportLink: ExportLink = {
			source: typeof link.source === "string" ? link.source : link.source.id,
			target: typeof link.target === "string" ? link.target : link.target.id,
			type: link.type,
			directed: link.directed,
			label: link.label,
			strength: link.strength,
			padding: link.padding,
		};
		links.push(exportLink);
	});
	return {
		nodes,
		links,
	};
}
