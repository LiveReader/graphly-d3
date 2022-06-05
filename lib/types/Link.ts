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

export enum LinkStrength {
	Strong = "strong",
	Weak = "weak",
	Loose = "loose",
}

export interface Link extends D3Link {
	type?: LinkType;
	directed?: boolean;
	label?: string;
	strength?: number | LinkStrength;
	padding?: number;
}
