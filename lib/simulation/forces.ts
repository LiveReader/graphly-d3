import * as d3 from "d3";

import { Node, AnchorType } from "../types/Node";
import { Link, LinkStrength } from "../types/Link";
import { pointInPolygon } from "../link/link";
import ForceSimulation from "./forceSimulation";

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

export function shapeCollide(this: ForceSimulation, alpha: number): any {
	const nodes = this.graph.nodes;
	var quadtree = d3
		.quadtree()
		.x((d: any) => d.x)
		.y((d: any) => d.y)
		.addAll(nodes as any);

	nodes.forEach((d: Node) => {
		d.x = d.x || 0;
		d.y = d.y || 0;
		var r = (d.shape.template?.shapeSize ?? 300) * d.shape.scale;
		var nx1 = d.x - r;
		var nx2 = d.x + r;
		var ny1 = d.y - r;
		var ny2 = d.y + r;
		quadtree.visit((quad: any, x1: number, y1: number, x2: number, y2: number) => {
			if (quad.data && quad.data !== d) {
				var x = (d.x ?? 0) - quad.data.x;
				var y = (d.y ?? 0) - quad.data.y;
				var l = Math.sqrt(x * x + y * y);
				const r = (d.shape.template?.shapeSize ?? 300) * d.shape.scale;
				if (nearBy(d, quad.data)) {
					if (d.shape.bodyPoints?.length == 0 || quad.data.shape.bodyPoints?.length == 0) {
						// collision with circle
						if (l < r) {
							l = ((l - r) / l) * alpha;
							d.x = d.x || 0;
							d.y = d.y || 0;
							d.x -= x *= l;
							d.y -= y *= l;
							quad.data.x += x;
							quad.data.y += y;
						}
					} else {
						// collision with body polygon
						if (polygonsIntersect(d, quad.data)) {
							l = ((l - r) / l) * alpha;
							d.x = d.x || 0;
							d.y = d.y || 0;
							d.x -= x *= l;
							d.y -= y *= l;
							quad.data.x += x;
							quad.data.y += y;
						}
					}
				}
			}
			return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
		});
	});
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
