import * as d3 from "d3";

import { Node, AnchorType } from "../types/Node";
import { Link, LinkStrength } from "../types/Link";

export function linkForce() {
	const force = d3
		.forceLink<Node, Link>()
		.id((d: Node) => d.id)
		.strength((d: Link) => {
			if (d.strength === undefined) return 0.3;
			if (typeof d.strength === "number") return d.strength;
			switch (d.strength) {
				case LinkStrength.Strong:
					return 0.5;
				case LinkStrength.Weak:
					return 0.3;
				case LinkStrength.Loose:
					return 0;
				default:
					return 0.3;
			}
		});
	return force;
}

export function xForce() {
	const force = d3
		.forceX<Node>()
		.x((d: Node) => position(d).x)
		.strength((d: Node) => strength(d));
	return force;
}

export function yForce() {
	const force = d3
		.forceY<Node>()
		.y((d: Node) => position(d).y)
		.strength((d: Node) => strength(d));
	return force;
}

export function gravity(envGravity: number = -10000) {
	const force = d3.forceManyBody<Node>().strength((d: Node) => {
		if (d.gravity) return d.gravity;
		return envGravity;
	});
	return force;
}

export function circleCollide() {
	const force = d3.forceCollide<Node>().radius((d: Node) => {
		const template = d.shape.template;
		return ((template?.shapeSize ?? 300) / 2) * d.shape.scale;
	});
	return force;
}

function position(d: Node): { x: number; y: number } {
	if (d.satellite) return { x: d.satellite.x ?? 0, y: d.satellite.y ?? 0 };
	if (d.anchor) return { x: d.anchor.x ?? 0, y: d.anchor.y ?? 0 };
	return { x: 0, y: 0 };
}

function strength(d: Node): number {
	if (d.satellite) return 6;
	if (d.anchor) {
		switch (d.anchor.type) {
			case AnchorType.Hard:
			case AnchorType.Soft:
				return 2;
			default:
				return 0;
		}
	}
	return 0;
}
