import * as Shape from "../shape/shape";
import { Node } from "../types/Node";
import { Link } from "../types/Link";

export enum ArrowPosition {
	Head = "head",
	Tail = "tail",
}

export function line(link: Link) {
	const points = getSurfacePoints(link, link.padding ?? 10);
	if (!points) return;
	return (
		`M ${points.start.x} ${points.start.y}` +
		`Q ${points.center.x}, ${points.center.y}` +
		` ${points.end.x} ${points.end.y}`
	);
}

export function arrow(link: Link, _arrowPos: ArrowPosition = ArrowPosition.Head) {
	if (!link.directed) return "";
	const points = getSurfacePoints(link, link.padding ?? 10);
	if (!points) return;
	const arrowAngle = Math.atan2(points.end.y - points.center.y, points.end.x - points.center.x);
	const arrowRadius = 10;
	const arrowStart = {
		x: points.end.x + arrowRadius * Math.cos(arrowAngle + Math.PI / 2),
		y: points.end.y + arrowRadius * Math.sin(arrowAngle + Math.PI / 2),
	};
	const arrowTip = {
		x: points.end.x + arrowRadius * Math.cos(arrowAngle),
		y: points.end.y + arrowRadius * Math.sin(arrowAngle),
	};
	const arrowEnd = {
		x: points.end.x + arrowRadius * Math.cos(arrowAngle - Math.PI / 2),
		y: points.end.y + arrowRadius * Math.sin(arrowAngle - Math.PI / 2),
	};
	return `M ${arrowStart.x} ${arrowStart.y}` + `L ${arrowTip.x} ${arrowTip.y}` + `L ${arrowEnd.x} ${arrowEnd.y}`;
}

export function labelPosition(link: Link) {
	const points = getSurfacePoints(link, link.padding ?? 10);
	if (!points) return;
	const edgeCenter = lineCenter(points.start, points.end);
	const x = points.center.x + (edgeCenter.x - points.center.x) / 2;
	const y = points.center.y + (edgeCenter.y - points.center.y) / 2;
	return "translate(" + x + "," + y + ")";
}

function lineStart(link: Link): { x: number; y: number } {
	if (typeof link.source === "string" || typeof link.target === "string") return { x: 0, y: 0 };
	return calculateIntersection(link.target, link.source);
}

function lineEnd(link: Link): { x: number; y: number } {
	if (typeof link.source === "string" || typeof link.target === "string") return { x: 0, y: 0 };
	return calculateIntersection(link.source, link.target);
}

function lineCenter(start: { x: number; y: number }, end: { x: number; y: number }): { x: number; y: number } {
	return { x: (start.x + end.x) / 2, y: (start.y + end.y) / 2 };
}

function lineCenterWithOffset(
	start: { x: number; y: number },
	end: { x: number; y: number },
	offset?: { x: number; y: number }
): { x: number; y: number } {
	const lc = lineCenter(start, end);
	return { x: lc.x + (offset?.x ?? 0), y: lc.y - (offset?.y ?? 0) };
}

function offset(
	link: Link,
	start: { x: number; y: number },
	end: { x: number; y: number },
	bezierCurveFactor: number
): { x: number; y: number } {
	const dX = dx(start, end);
	const dY = dy(start, end);
	const normal = normalize(dX, dY);
	const x = bezierCurveFactor * (dY / normal) * normal * ((link.i ?? 0) + 1);
	const y = bezierCurveFactor * (dX / normal) * normal * ((link.i ?? 0) + 1);
	return { x: x, y: y };
}

function dx(start: { x: number; y: number }, end: { x: number; y: number }): number {
	return end.x - start.x;
}

function dy(start: { x: number; y: number }, end: { x: number; y: number }): number {
	return end.y - start.y;
}

function normalize(dx: number, dy: number): number {
	return Math.sqrt(dx * dx + dy * dy);
}

function calculateIntersection(source: Node, target: Node): { x: number; y: number } {
	const dx = (target.x ?? 0) - (source.x ?? 0);
	const dy = (target.y ?? 0) - (source.y ?? 0);
	const length = Math.sqrt(dx * dx + dy * dy);
	if (length === 0) return { x: source.x ?? 0, y: source.y ?? 0 };
	return { x: dx + (source.x ?? 0), y: dy + (source.y ?? 0) };
}

function getSurfacePoints(
	link: Link,
	distance: number = 0
): { start: { x: number; y: number }; end: { x: number; y: number }; center: { x: number; y: number } } {
	const start = lineStart(link);
	const end = lineEnd(link);
	const off = offset(link, start, end, 0.1);
	if (typeof link.source === "string" || typeof link.target === "string") return { start, end, center: off };
	const center = lineCenterWithOffset(
		{ x: link.source.x ?? 0, y: link.source.y ?? 0 },
		{ x: link.target.x ?? 0, y: link.target.y ?? 0 },
		off
	);
	const arrowDistance = link.directed ? 20 : 0;
	const path = Shape.create("g")
		.append("path")
		.attr("d", `M ${start.x} ${start.y}` + `Q ${center.x}, ${center.y}` + ` ${end.x} ${end.y}`)
		.node();
	if (!path) return { start, end, center: off };
	const sourceSize = link.source.shape.failed
		? link.source.forceSimulation?.templateStore.errorTemplate.shapeSize
		: link.source.shape.template?.shapeSize ?? 300;
	const targetSize = link.target.shape.failed
		? link.target.forceSimulation?.templateStore.errorTemplate.shapeSize
		: link.target.shape.template?.shapeSize ?? 300;
	const startDistance = (link.source.shape.scale ?? 1) * ((sourceSize ?? 300) / 2);
	const endDistance = (link.target.shape.scale ?? 1) * ((targetSize ?? 300) / 2);
	const surfaceStart = path.getPointAtLength(startDistance + distance);
	const surfaceEnd = path.getPointAtLength(path.getTotalLength() - endDistance - distance - arrowDistance);
	const surfaceOffset = offset(link, surfaceStart, surfaceEnd, 0.1);
	const surfaceCenter = lineCenterWithOffset(surfaceStart, surfaceEnd, surfaceOffset);
	return {
		start: { x: surfaceStart.x, y: surfaceStart.y },
		center: { x: surfaceCenter.x, y: surfaceCenter.y },
		end: { x: surfaceEnd.x, y: surfaceEnd.y },
	};
}
