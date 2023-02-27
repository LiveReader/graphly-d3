import { Node } from "./Node";

export interface D3Link {
	source: string | Node;
	target: string | Node;
	index?: number;
	i?: number;
}

export enum LinkType {
	Solid = "solid",
	Dashed = "dashed",
	Dotted = "dotted",
	Hidden = "hidden",
}

export enum ArrowDirection {
	Head = "head",
	Tail = "tail",
	Both = "both",
}

export enum LinkStrength {
	Strong = "strong",
	Weak = "weak",
	Loose = "loose",
}

export interface Link extends D3Link {
	id?: string;
	type?: LinkType | "solid" | "dashed" | "dotted" | "hidden";
	directed?: boolean | ArrowDirection | "head" | "tail" | "both";
	label?: string;
	strength?: number | LinkStrength | "strong" | "weak" | "loose";
	padding?: number;
	width?: number;
	curvature?: number;
	color?: string;
	payload?: any;
}
