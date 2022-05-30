import ForceSimulation from "../forceSimulation";

export interface D3Node {
	id: string;
	x?: number;
	y?: number;
	vx?: number;
	vy?: number;
	fx?: number;
	fy?: number;
}

export interface Shape {
	type: string;
	scale: number;
	template: any;
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
	// type?
	x?: number;
	y?: number;
	source: string | Node;
	angle: number;
	distance: number;
}

export interface Node extends D3Node {
	forceSimulation: ForceSimulation;
	shape: Shape;
	spawn?: Spawn;
	anchor?: Anchor;
	satellite?: Satellite;
	payload?: any;
}
