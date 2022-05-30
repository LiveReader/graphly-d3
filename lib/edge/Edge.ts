import Shape from "../shape/Shape";

/**
 * @param  {Object} edge D3 link object
 */
function line(edge: any) {
	const points = getSurfacePoints(edge, edge.padding ?? 10);
	if (!points) return;
	return (
		`M ${points.start.x} ${points.start.y}` +
		`Q ${points.center.x}, ${points.center.y}` +
		` ${points.end.x} ${points.end.y}`
	);
}

/**
 * @param  {Object} edge D3 link object
 */
function arrow(edge: any) {
	if (!edge.directed) {
		return "";
	}
	const points = getSurfacePoints(edge, edge.padding ?? 10);
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

/**
 * @param  {Object} edge D3 link object
 */
function labelPosition(edge: any) {
	const points = getSurfacePoints(edge, edge.padding ?? 10);
	if (!points) return;
	const edgeCenter = lineCenter(points.start, points.end);
	const x = points.center.x + (edgeCenter.x - points.center.x) / 2;
	const y = points.center.y + (edgeCenter.y - points.center.y) / 2;
	return "translate(" + x + "," + y + ")";
}

/**
 * @param  {Object} edge D3 link object
 */
function lineStart(edge: any) {
	return calculateIntersection(edge.target, edge.source);
}

/**
 * @param  {Object} edge D3 link object
 */
function lineEnd(edge: any) {
	return calculateIntersection(edge.source, edge.target);
}

/**
 * @param  {Object} start
 * @param  {Object} end
 */
function lineCenter(start: any, end: any) {
	return { x: (start.x + end.x) / 2, y: (start.y + end.y) / 2 };
}

/**
 * @param  {Object} start
 * @param  {Object} end
 * @param  {Number} offset
 */
function lineCenterWithOffset(start: any, end: any, offset: any) {
	const lc = lineCenter(start, end);
	return { x: lc.x + offset?.x || 0, y: lc.y - offset?.y || 0 };
}

/**
 * @param  {Object} start
 * @param  {Object} end
 * @param  {Number} bezierCurveFactor
 */
function offset(edge: any, start: any, end: any, bezierCurveFactor: number) {
	const dX = dx(start, end);
	const dY = dy(start, end);
	const normal = normalize(dX, dY);
	const x = bezierCurveFactor * (dY / normal) * normal * ((edge.i ?? 0) + 1);
	const y = bezierCurveFactor * (dX / normal) * normal * ((edge.i ?? 0) + 1);
	return { x: x, y: y };
}

/**
 * @param  {Object} start
 * @param  {Object} end
 */
function dx(start: any, end: any) {
	return end.x - start.x;
}
/**
 * @param  {Object} start
 * @param  {Object} end
 */
function dy(start: any, end: any) {
	return end.y - start.y;
}
/**
 * @param  {Object} dx
 * @param  {Object} dy
 */
function normalize(dx: any, dy: any) {
	return Math.sqrt(dx * dx + dy * dy);
}

/**
 * @param source the source node
 * @param target the target node
 * @param additionalDistance additional distance the
 * @returns {{x: number, y: number}}
 */
function calculateIntersection(source: any, target: any) {
	const dx = target.x - source.x;
	const dy = target.y - source.y;
	const length = Math.sqrt(dx * dx + dy * dy);
	if (length === 0) {
		return { x: source.x, y: source.y };
	}
	return { x: dx + source.x, y: dy + source.y };
}

/**
 * @param  {Object} edge D3 link object
 * @param  {Number} distance additional distance
 */
function getSurfacePoints(edge: any, distance: number = 0) {
	const start = lineStart(edge);
	const end = lineEnd(edge);
	const off = offset(edge, start, end, 0.1);
	const center = lineCenterWithOffset(edge.source, edge.target, off);

	const arrowDistance = edge.directed ? 20 : 0;
	const path = Shape.create("g")
		.append("path")
		.attr("d", `M ${start.x} ${start.y}` + `Q ${center.x}, ${center.y}` + ` ${end.x} ${end.y}`)
		.node();
	if (!path) return;
	const startDistance = (edge.source.shape.scale ?? 1) * ((edge.source.shape.template.shapeSize ?? 300) / 2);
	const endDistance = (edge.target.shape.scale ?? 1) * ((edge.target.shape.template.shapeSize ?? 300) / 2);
	const surfaceStart = path.getPointAtLength(startDistance + distance);
	const surfaceEnd = path.getPointAtLength(path.getTotalLength() - endDistance - distance - arrowDistance);
	const surfaceOffset = offset(edge, surfaceStart, surfaceEnd, 0.1);
	const surfaceCenter = lineCenterWithOffset(surfaceStart, surfaceEnd, surfaceOffset);
	return {
		start: { x: surfaceStart.x, y: surfaceStart.y },
		center: { x: surfaceCenter.x, y: surfaceCenter.y },
		end: { x: surfaceEnd.x, y: surfaceEnd.y },
	};
}

export default {
	line,
	arrow,
	labelPosition,
	lineStart,
	lineEnd,
	lineCenter,
	lineCenterWithOffset,
	offset,
	dx,
	dy,
	normalize,
	getSurfacePoints,
};
