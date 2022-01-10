const Edge = {};

/**
 * @param  {Object} edge D3 link object
 */
Edge.line = function (edge) {
	const lineStart = Edge.lineStart(edge);
	const lineEnd = Edge.lineEnd(edge);
	const offset = Edge.offset(lineStart, lineEnd, 0.1);
	const lineCenter = Edge.lineCenterWithOffset(lineStart, lineEnd, offset);

	return `M ${lineStart.x} ${lineStart.y}` + `Q ${lineCenter.x}, ${lineCenter.y}` + ` ${lineEnd.x} ${lineEnd.y}`;
};

/**
 * @param  {Object} edge D3 link object
 */
Edge.arrow = function (edge) {
	if (!edge.directed) {
		return "";
	}
	const lineStart = Edge.lineStart(edge);
	const lineEnd = Edge.lineEnd(edge);
	const dx = Edge.dx(lineStart, lineEnd);
	const dy = Edge.dy(lineStart, lineEnd);
	const arrowAngle = Math.atan2(dy, dx);
	const arrowRadius = 10;
	const arrowStart = {
		x: lineEnd.x + arrowRadius * Math.cos(arrowAngle + Math.PI / 2),
		y: lineEnd.y + arrowRadius * Math.sin(arrowAngle + Math.PI / 2),
	};
	const arrowTip = {
		x: lineEnd.x + arrowRadius * Math.cos(arrowAngle),
		y: lineEnd.y + arrowRadius * Math.sin(arrowAngle),
	};
	const arrowEnd = {
		x: lineEnd.x + arrowRadius * Math.cos(arrowAngle - Math.PI / 2),
		y: lineEnd.y + arrowRadius * Math.sin(arrowAngle - Math.PI / 2),
	};
	return `M ${arrowStart.x} ${arrowStart.y}` + `L ${arrowTip.x} ${arrowTip.y}` + `L ${arrowEnd.x} ${arrowEnd.y}`;
};

/**
 * @param  {Object} edge D3 link object
 */
Edge.lineStart = function (edge) {
	return calculateIntersection(edge.target, edge.source, 5);
};

/**
 * @param  {Object} edge D3 link object
 */
Edge.lineEnd = function (edge) {
	const distance = edge.target.shape.scale ?? 1 * 150;
	const arrowDistance = edge.directed ? 20 : 0;
	return calculateIntersection(edge.source, edge.target, distance + arrowDistance);
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
Edge.offset = function (start, end, bezierCurveFactor) {
	const dx = Edge.dx(start, end);
	const dy = Edge.dy(start, end);
	const normal = Edge.normalize(dx, dy);
	const x = bezierCurveFactor * (dy / normal) * normal;
	const y = bezierCurveFactor * (dx / normal) * normal;
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
function calculateIntersection(source, target, additionalDistance) {
	const dx = target.x - source.x;
	const dy = target.y - source.y;
	const length = Math.sqrt(dx * dx + dy * dy);
	if (length === 0) {
		return { x: source.x, y: source.y };
	}
	const innerDistance = (target.shape.scale ?? 1) * 150;
	const ratio = (length - (innerDistance + additionalDistance)) / length,
		x = dx * ratio + source.x,
		y = dy * ratio + source.y;

	return { x: x, y: y };
}
