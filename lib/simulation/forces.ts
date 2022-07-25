import * as d3 from "d3";

import { Node, AnchorType } from "../types/Node";
import { Link, LinkStrength } from "../types/Link";
import { pointInPolygon } from "../link/link";

export function linkForce(distance: number): d3.ForceLink<Node, Link> {
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
		})
		.distance(distance);
	return force;
}

export function xForce(): d3.ForceX<Node> {
	const force = d3
		.forceX<Node>()
		.x((d: Node) => position(d).x)
		.strength((d: Node) => strength(d));
	return force;
}

export function yForce(): d3.ForceY<Node> {
	const force = d3
		.forceY<Node>()
		.y((d: Node) => position(d).y)
		.strength((d: Node) => strength(d));
	return force;
}

export function gravity(envGravity: number): d3.ForceManyBody<Node> {
	const force = d3.forceManyBody<Node>().strength((d: Node) => {
		if (d.gravity) return d.gravity;
		return envGravity;
	});
	return force;
}

export function circleCollide(): d3.Force<Node, Link> {
	const force = d3.forceCollide<Node>().radius((d: Node) => {
		const template = d.shape.template;
		const radius = ((template?.shapeSize ?? 300) / 2) * d.shape.scale;
		return radius;
	}) as d3.Force<Node, Link>;
	return force;
}

export function position(d: Node): { x: number; y: number } {
	if (d.satellite) return { x: d.satellite.x ?? 0, y: d.satellite.y ?? 0 };
	if (d.anchor) return { x: d.anchor.x ?? 0, y: d.anchor.y ?? 0 };
	return { x: 0, y: 0 };
}

export function strength(d: Node): number {
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

export function shapeCollide(_alpha: number, nodes: Node[]) {
	for (let i = 0; i < nodes.length; i++) {
		for (let j = i + 1; j < nodes.length; j++) {
			const a = nodes[i];
			const b = nodes[j];
			if (nearBy(a, b)) {
				if (a.shape.bodyPoints?.length == 0 || b.shape.bodyPoints?.length == 0) {
					circularCollision(a, b);
					continue;
				}
				if (polygonsIntersect(a, b)) {
					const angle = Math.atan2((b.y ?? 0) - (a.y ?? 0), (b.x ?? 0) - (a.x ?? 0));
					const dx = Math.cos(angle) * 6;
					const dy = Math.sin(angle) * 6;
					a.vx = (a.vx ?? 0) - dx;
					a.vy = (a.vy ?? 0) - dy;
					b.vx = (b.vx ?? 0) + dx;
					b.vy = (b.vy ?? 0) + dy;
				}
			}
		}
	}
}

function nearBy(n1: Node, n2: Node) {
	const n1Pos = { x: n1.x ?? 0, y: n1.y ?? 0 };
	const n1Radius = ((n1.shape?.template?.shapeSize ?? 300) / 2) * (n1.shape.scale * 1.5);
	const n2Pos = { x: n2.x ?? 0, y: n2.y ?? 0 };
	const n2Radius = ((n2.shape?.template?.shapeSize ?? 300) / 2) * (n2.shape.scale * 1.5);
	const distance = Math.sqrt(Math.pow(n1Pos.x - n2Pos.x, 2) + Math.pow(n1Pos.y - n2Pos.y, 2));
	return distance < n1Radius + n2Radius;
}

function polygonsIntersect(n1: Node, n2: Node): boolean {
	const n1p = (n1.shape.bodyPoints ?? []).map((p) => ({ x: p.x - (n1.x ?? 0), y: p.y - (n1.y ?? 0) }));
	const n2p = (n2.shape.bodyPoints ?? []).map((p) => ({ x: p.x - (n2.x ?? 0), y: p.y - (n2.y ?? 0) }));
	for (let i = 0; i < n1p.length; i++) {
		const point = {
			x: n1p[i].x,
			y: n1p[i].y,
		};
		if (pointInPolygon(point, n2p)) return true;
	}
	return false;
}

function circularCollision(n1: Node, n2: Node) {
	const n1Pos = { x: n1.x ?? 0, y: n1.y ?? 0 };
	const n1Radius = ((n1.shape?.template?.shapeSize ?? 300) / 2) * n1.shape.scale;
	const n2Pos = { x: n2.x ?? 0, y: n2.y ?? 0 };
	const n2Radius = ((n2.shape?.template?.shapeSize ?? 300) / 2) * n2.shape.scale;
	const distance = Math.sqrt(Math.pow(n1Pos.x - n2Pos.x, 2) + Math.pow(n1Pos.y - n2Pos.y, 2));
	if (distance < n1Radius + n2Radius) {
		const angle = Math.atan2(n2Pos.y - n1Pos.y, n2Pos.x - n1Pos.x);
		const dx = Math.cos(angle) * 30;
		const dy = Math.sin(angle) * 30;
		n1.vx = (n1.vx ?? 0) - dx;
		n1.vy = (n1.vy ?? 0) - dy;
		n2.vx = (n2.vx ?? 0) + dx;
		n2.vy = (n2.vy ?? 0) + dy;
		n1.x = n1Pos.x + dx;
		n1.y = n1Pos.y + dy;
		n2.x = n2Pos.x - dx;
		n2.y = n2Pos.y - dy;
	}
}
