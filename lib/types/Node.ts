import { ForceSimulation } from "../main";
import { Template } from "./Template";

export type D3Node = {
	id: string;
	x?: number;
	y?: number;
	vx?: number;
	vy?: number;
	fx?: number | null;
	fy?: number | null;
};

export type Shape = {
	type: string;
	scale: number;
	url?: string;
	template?: Template;
	bodyPoints?: { x: number; y: number }[];
	bodyResolution?: number;
	failed?: boolean;
};

export type Spawn = {
	source: string | Node;
	angle: number;
	distance: number;
};

export enum AnchorType {
	Soft = "soft",
	Hard = "hard",
}

export type Anchor = {
	type: AnchorType | "soft" | "hard";
	x: number;
	y: number;
};

export enum SatelliteType {
	Soft = "soft",
	Hard = "hard",
}

export type Satellite = {
	x?: number;
	y?: number;
	type?: SatelliteType | "soft" | "hard";
	source: string | Node;
	angle: number;
	distance: number;
};

export type RenderConfig = {
	theme: "light" | "dark";
	scale: number;
};

export type Node<T = any> = D3Node & {
	shape: Shape;
	renderConfig?: RenderConfig;
	simulation?: ForceSimulation;
	gravity?: number;
	spawn?: Spawn;
	anchor?: Anchor;
	satellite?: Satellite;
	errorMessage?: string;
	payload?: T;
};
