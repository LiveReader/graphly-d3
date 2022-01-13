import * as Shape from "../shape/Shape";
import * as TemplateAPI from "../shape/TemplateAPI";

const Edge = {};

/**
 * @param  {Object} edge D3 link object
 */
Edge.line = function (edge) {
	const points = Edge.getSurfacePoints(edge, 10);
	return (
		`M ${points.start.x} ${points.start.y}` +
		`Q ${points.center.x}, ${points.center.y}` +
		` ${points.end.x} ${points.end.y}`
	);
};

/**
 * @param  {Object} edge D3 link object
 */
Edge.arrow = function (edge) {
	if (!edge.directed) {
		return "";
	}
	const points = Edge.getSurfacePoints(edge, 10);
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
};

/**
 * @param  {Object} edge D3 link object
 */
Edge.labelPosition = function (edge) {
	const points = Edge.getSurfacePoints(edge, 10);
	const edgeCenter = Edge.lineCenter(points.start, points.end);
	const x = points.center.x + (edgeCenter.x - points.center.x) / 2;
	const y = points.center.y + (edgeCenter.y - points.center.y) / 2;
	return "translate(" + x + "," + y + ")";
};

/**
 * @param  {Object} edge D3 link object
 */
Edge.lineStart = function (edge) {
	return calculateIntersection(edge.target, edge.source);
};

/**
 * @param  {Object} edge D3 link object
 */
Edge.lineEnd = function (edge) {
	return calculateIntersection(edge.source, edge.target);
};

/**
 * @param  {Object} start
 * @param  {Object} end
 */
Edge.lineCenter = function (start, end) {
	return { x: (start.x + end.x) / 2, y: (start.y + end.y) / 2 };
};

/**
 * @param  {Object} start
 * @param  {Object} end
 * @param  {Number} offset
 */
Edge.lineCenterWithOffset = function (start, end, offset) {
	const lineCenter = Edge.lineCenter(start, end);
	return { x: lineCenter.x + offset.x ?? 0, y: lineCenter.y - offset.y };
};

/**
 * @param  {Object} start
 * @param  {Object} end
 * @param  {Number} bezierCurveFactor
 */
Edge.offset = function (edge, start, end, bezierCurveFactor) {
	const dx = Edge.dx(start, end);
	const dy = Edge.dy(start, end);
	const normal = Edge.normalize(dx, dy);
	const x = bezierCurveFactor * (dy / normal) * normal * ((edge.i ?? 0) + 1);
	const y = bezierCurveFactor * (dx / normal) * normal * ((edge.i ?? 0) + 1);
	return { x: x, y: y };
};

/**
 * @param  {Object} start
 * @param  {Object} end
 */
Edge.dx = function (start, end) {
	return end.x - start.x;
};
/**
 * @param  {Object} start
 * @param  {Object} end
 */
Edge.dy = function (start, end) {
	return end.y - start.y;
};
/**
 * @param  {Object} dx
 * @param  {Object} dy
 */
Edge.normalize = function (dx, dy) {
	return Math.sqrt(dx * dx + dy * dy);
};

/**
 * @param source the source node
 * @param target the target node
 * @param additionalDistance additional distance the
 * @returns {{x: number, y: number}}
 */
function calculateIntersection(source, target) {
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
Edge.getSurfacePoints = function (edge, distance = 0) {
	const start = Edge.lineStart(edge);
	const end = Edge.lineEnd(edge);
	const offset = Edge.offset(edge, start, end, 0.1);
	const center = Edge.lineCenterWithOffset(edge.source, edge.target, offset);

	const arrowDistance = edge.directed ? 20 : 0;
	const path = Shape.create("g")
		.append("path")
		.attr("d", `M ${start.x} ${start.y}` + `Q ${center.x}, ${center.y}` + ` ${end.x} ${end.y}`)
		.node();
	const startDistance =
		(edge.source.shape.scale ?? 1) * (TemplateAPI.get(edge.source.shape.type).shapeSize / 2 ?? 150);
	const endDistance = (edge.target.shape.scale ?? 1) * (TemplateAPI.get(edge.target.shape.type).shapeSize / 2 ?? 150);
	const surfaceStart = path.getPointAtLength(startDistance + distance);
	const surfaceEnd = path.getPointAtLength(path.getTotalLength() - endDistance - distance - arrowDistance);
	const surfaceOffset = Edge.offset(edge, surfaceStart, surfaceEnd, 0.1);
	const surfaceCenter = Edge.lineCenterWithOffset(surfaceStart, surfaceEnd, surfaceOffset);
	return {
		start: { x: surfaceStart.x, y: surfaceStart.y },
		center: { x: surfaceCenter.x, y: surfaceCenter.y },
		end: { x: surfaceEnd.x, y: surfaceEnd.y },
	};
};

export default Edge;
