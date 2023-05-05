import * as d3 from "d3";
import * as Shape from "../shape/Shape";
import { linkID } from "../simulation/render";
import { Node } from "../types/Node";
import { Link, ArrowDirection } from "../types/Link";

export function lineFull(link: Link) {
	const start = lineStart(link);
	const end = lineEnd(link);
	const center = lineCenterWithOffset(start, end, offset(link, start, end, 0.1));
	const points = {
		start: start,
		center: center,
		end: end,
	};
	if (!points) return;
	return (
		`M ${points.start.x} ${points.start.y}` +
		`Q ${points.center.x}, ${points.center.y}` +
		` ${points.end.x} ${points.end.y}`
	);
}

export function line(link: Link) {
	const points = getSurfacePoints(link, link.padding ?? 10);
	if (!points) return;
	const left = points.start.x > points.end.x;
	const start = {
		x: left ? points.end.x : points.start.x,
		y: left ? points.end.y : points.start.y,
	};
	const end = {
		x: left ? points.start.x : points.end.x,
		y: left ? points.start.y : points.end.y,
	};
	return `M ${start.x} ${start.y}` + `Q ${points.center.x}, ${points.center.y}` + ` ${end.x} ${end.y}`;
}

export function arrow(link: Link, arrowPos: ArrowDirection = ArrowDirection.Head) {
	if (!link.directed) return "";
	if (
		arrowPos == ArrowDirection.Head &&
		link.directed !== true &&
		arrowPos == ArrowDirection.Head &&
		link.directed != ArrowDirection.Head &&
		arrowPos == ArrowDirection.Head &&
		link.directed != ArrowDirection.Both
	)
		return "";
	if (
		arrowPos == ArrowDirection.Tail &&
		link.directed != ArrowDirection.Tail &&
		arrowPos == ArrowDirection.Tail &&
		link.directed != ArrowDirection.Both
	)
		return "";
	const padding = link.padding ?? 10;
	const points = getSurfacePoints(link, padding);
	if (!points) return;
	const arrowAngle =
		arrowPos == ArrowDirection.Head
			? Math.atan2(points.end.y - points.center.y, points.end.x - points.center.x)
			: Math.atan2(points.start.y - points.center.y, points.start.x - points.center.x);
	const arrowRadius = 10;
	const arrowStart =
		arrowPos == ArrowDirection.Head
			? {
					x: points.end.x + arrowRadius * Math.cos(arrowAngle + Math.PI / 2),
					y: points.end.y + arrowRadius * Math.sin(arrowAngle + Math.PI / 2),
			  }
			: {
					x: points.start.x + arrowRadius * Math.cos(arrowAngle + Math.PI / 2),
					y: points.start.y + arrowRadius * Math.sin(arrowAngle + Math.PI / 2),
			  };
	const arrowTip =
		arrowPos == ArrowDirection.Head
			? {
					x: points.end.x + arrowRadius * Math.cos(arrowAngle),
					y: points.end.y + arrowRadius * Math.sin(arrowAngle),
			  }
			: {
					x: points.start.x + arrowRadius * Math.cos(arrowAngle),
					y: points.start.y + arrowRadius * Math.sin(arrowAngle),
			  };
	const arrowEnd =
		arrowPos == ArrowDirection.Head
			? {
					x: points.end.x + arrowRadius * Math.cos(arrowAngle - Math.PI / 2),
					y: points.end.y + arrowRadius * Math.sin(arrowAngle - Math.PI / 2),
			  }
			: {
					x: points.start.x + arrowRadius * Math.cos(arrowAngle - Math.PI / 2),
					y: points.start.y + arrowRadius * Math.sin(arrowAngle - Math.PI / 2),
			  };
	return `M ${arrowStart.x} ${arrowStart.y}` + `L ${arrowTip.x} ${arrowTip.y}` + `L ${arrowEnd.x} ${arrowEnd.y}`;
}

export function labelDy(link: Link) {
	const points = getSurfacePoints(link, link.padding ?? 10);
	if (!points) return;
	return points.start.x > points.end.x ? "0.5em" : "-0.5em";
}

function lineStart(link: Link): { x: number; y: number } {
	if (typeof link.source === "string" || typeof link.target === "string") return { x: 0, y: 0 };
	return calculateStartpoint(link.target, link.source);
}

function lineEnd(link: Link): { x: number; y: number } {
	if (typeof link.source === "string" || typeof link.target === "string") return { x: 0, y: 0 };
	return calculateStartpoint(link.source, link.target);
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
	const curvature = link.curvature !== undefined ? link.curvature : bezierCurveFactor;
	const indexFactor = link.curvature !== undefined ? 1 : (link.i ?? 0) + 1;
	const x = curvature * (dY / normal) * normal * indexFactor;
	const y = curvature * (dX / normal) * normal * indexFactor;
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

function calculateStartpoint(source: Node, target: Node): { x: number; y: number } {
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
	const arrowHeadDistance =
		link.directed === true || link.directed == ArrowDirection.Head || link.directed == ArrowDirection.Both ? 20 : 0;
	const arrowTailDistance = link.directed == ArrowDirection.Tail || link.directed == ArrowDirection.Both ? 20 : 0;
	const path = Shape.create("g")
		.append("path")
		.attr("d", `M ${start.x} ${start.y}` + `Q ${center.x}, ${center.y}` + ` ${end.x} ${end.y}`)
		.node();
	if (!path) return { start, end, center: off };

	const sourceSize: number = link.source.shape.failed ? 200 : link.source.shape.template?.shapeSize ?? 300;
	const targetSize: number = link.target.shape.failed ? 200 : link.target.shape.template?.shapeSize ?? 300;

	const startIntersection = calculateIntersectionDistance(link.source, link.target, link, false);
	const endIntersection = calculateIntersectionDistance(link.source, link.target, link, true);

	const startDistance = startIntersection || (link.source.shape.scale ?? 1) * (sourceSize / 2);
	const endDistance = endIntersection || (link.target.shape.scale ?? 1) * (targetSize / 2);

	const surfaceStart: any = (path.getAttribute("d") as string).includes("NaN")
		? 0
		: path.getPointAtLength(startDistance + distance + arrowTailDistance);
	const surfaceEnd: any = (path.getAttribute("d") as string).includes("NaN")
		? 0
		: path.getPointAtLength(path.getTotalLength() - endDistance - distance - arrowHeadDistance);
	const surfaceOffset = offset(link, surfaceStart, surfaceEnd, 0.1);
	const surfaceCenter = lineCenterWithOffset(surfaceStart, surfaceEnd, surfaceOffset);
	return {
		start: { x: surfaceStart.x, y: surfaceStart.y },
		center: { x: surfaceCenter.x, y: surfaceCenter.y },
		end: { x: surfaceEnd.x, y: surfaceEnd.y },
	};
}

function calculateIntersectionDistance(
	sourceNode: Node,
	targetNode: Node,
	link: Link,
	reversed: boolean = false
): number {
	const linePath: SVGPathElement = d3
		.select("[data-id='" + linkID(link) + "']")
		.select("[data-object='link-line-full']")
		.node() as SVGPathElement;
	if (
		!linePath ||
		!linePath.getPointAtLength ||
		!linePath.getAttribute("d") ||
		(linePath.getAttribute("d") as string).includes("NaN")
	)
		return 0;

	const bodyPoints = reversed ? targetNode.shape.bodyPoints ?? [] : sourceNode.shape.bodyPoints ?? [];
	if (bodyPoints.length === 0) return 0;
	const lineLength = linePath.getTotalLength();

	const stepSize = reversed
		? -((targetNode.shape.template?.shapeSize ?? 300) * (targetNode.shape.scale ?? 1)) / 20
		: ((sourceNode.shape.template?.shapeSize ?? 300) * (sourceNode.shape.scale ?? 1)) / 20;
	let length = reversed ? lineLength : 0;
	let globalPoint = linePath.getPointAtLength(length);
	let localPoint = { x: 0, y: 0 };

	if (!reversed) {
		localPoint = {
			x: globalPoint.x - (sourceNode.x ?? 0),
			y: globalPoint.y - (sourceNode.y ?? 0),
		};
	} else {
		localPoint = {
			x: globalPoint.x - (targetNode.x ?? 0),
			y: globalPoint.y - (targetNode.y ?? 0),
		};
	}

	let iterations = 0;
	while (pointInPolygon(localPoint, bodyPoints) && length <= lineLength && iterations < 30) {
		iterations++;
		length += stepSize;
		globalPoint = linePath.getPointAtLength(length);
		if (!reversed) {
			localPoint = {
				x: globalPoint.x - (sourceNode.x ?? 0),
				y: globalPoint.y - (sourceNode.y ?? 0),
			};
		} else {
			localPoint = {
				x: globalPoint.x - (targetNode.x ?? 0),
				y: globalPoint.y - (targetNode.y ?? 0),
			};
		}
	}

	iterations = 0;
	while (!pointInPolygon(localPoint, bodyPoints) && length >= 0 && iterations < 30) {
		iterations++;
		length = reversed ? length + 1 : length - 1;
		globalPoint = linePath.getPointAtLength(length);
		if (!reversed) {
			localPoint = {
				x: globalPoint.x - (sourceNode.x ?? 0),
				y: globalPoint.y - (sourceNode.y ?? 0),
			};
		} else {
			localPoint = {
				x: globalPoint.x - (targetNode.x ?? 0),
				y: globalPoint.y - (targetNode.y ?? 0),
			};
		}
	}
	const ditanceFactor = reversed ? (targetNode.shape.scale ?? 1) / (sourceNode.shape.scale ?? 1) : 1;
	const distance = (reversed ? lineLength - length : length) * ditanceFactor;
	return distance;
}

export function pointInPolygon(point: { x: number; y: number }, polygon: { x: number; y: number }[]) {
	var inside = false;
	for (var i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
		var xi = polygon[i].x,
			yi = polygon[i].y;
		var xj = polygon[j].x,
			yj = polygon[j].y;

		var intersect = yi > point.y != yj > point.y && point.x < ((xj - xi) * (point.y - yi)) / (yj - yi) + xi;
		if (intersect) inside = !inside;
	}
	return inside;
}
