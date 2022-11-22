import ForceSimulation from "../simulation/forceSimulation";
import { Template } from "./Template";

export interface D3Node {
	id: string;
	x?: number;
	y?: number;
	vx?: number;
	vy?: number;
	fx?: number | null;
	fy?: number | null;
}

export interface Shape {
	type: string;
	scale: number;
	url?: string;
	template?: Template;
	bodyPoints?: { x: number; y: number }[];
	bodyResolution?: number;
	failed?: boolean;
}

export interface Spawn {
	source: string | Node;
	angle: number;
	distance: number;
}

export enum AnchorType {
	Soft = "soft",
	Hard = "hard",
}

export interface Anchor {
	type: AnchorType;
	x: number;
	y: number;
}

export interface Satellite {
	x?: number;
	y?: number;
	source: string | Node;
	angle: number;
	distance: number;
}

export interface Node<T = any> extends D3Node {
	shape: Shape;
	forceSimulation?: ForceSimulation;
	gravity?: number;
	spawn?: Spawn;
	anchor?: Anchor;
	satellite?: Satellite;
	errorMessage?: string;
	payload?: T;
}
