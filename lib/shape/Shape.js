import * as d3 from "d3";

const Shape = {};

/**
 * @callback onElement
 * @param {Object} el HTML element
 */
/**
 * @param  {Object} shape D3 selection
 * @callback  onElement
 */
Shape.prerender = function (shape, onElement = () => {}) {
	let svg = null;
	if (!document.getElementById("PRERENDER_SVG")) {
		svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		svg.id = "PRERENDER_SVG";
		svg.style.opacity = 0;
		document.body.appendChild(svg);
	} else {
		svg = document.getElementById("PRERENDER_SVG");
	}
	svg.innerHTML = shape.html();
	onElement(svg.children[0]);
	svg.innerHTML = "";
};

/**
 * @param  {Object} shape D3 selection
 * @return {Object}       Bounding box
 */
Shape.getBBox = function (shape) {
	let bbox = null;
	Shape.prerender(shape, (el) => {
		bbox = el.getBBox();
	});
	return bbox;
};

/**
 * @param  {String} type svg element type
 * @return {Object}      D3 selection
 */
Shape.create = function (type) {
	return d3.select(document.createElementNS("http://www.w3.org/2000/svg", type));
};

/**
 * @param  {Object} shape D3 selection
 * @param  {Boolean} centered whether the shape is centered
 * @param  {Object} size width of the shape
 */
Shape.transform = function (shape, centered, size) {
	const bbox = Shape.getBBox(shape);
	const scale = size / Math.max(bbox.width, bbox.height);
	const translate = centered
		? { x: (-bbox.width * scale) / 2 || 0, y: (-bbox.height * scale) / 2 || 0 }
		: { x: 0, y: 0 };
	shape.attr("transform", `translate(${translate.x}, ${translate.y}) scale(${scale || 1})`);
};

/**
 * @param  {Object} reference to the shape
 * @return {Boolean}          true if the shape is already rendered
 */
Shape.alreadyExists = function (reference) {
	return typeof d3.select(reference).node().getAttribute === "function";
};

/**
 * @param  {Object} data data object
 * @return {Object}      cleaned data object
 */
Shape.cleanData = function (data) {
	const bind = Object.assign({}, data);
	delete bind.x;
	delete bind.y;
	delete bind.vx;
	delete bind.vy;
	delete bind.index;
	delete bind.forceSimulation;
	delete bind.anchor;
	delete bind.cluster;
	return bind;
};

/**
 * @param  {Object} shape D3 selection
 * @param  {Object} data data object
 */
Shape.bind = function (shape, data) {
	shape.attr("data-bind", JSON.stringify(Shape.cleanData(data)));
};

/**
 * @param  {Object} shape D3 selection
 * @return {Object}       data object
 */
Shape.getData = function (shape) {
	return JSON.parse(shape.attr("data-bind"));
};

/**
 * @param  {Object} shape D3 selection
 * @return {Boolean}      true if the shape has data
 */
Shape.hasData = function (shape) {
	return !!shape.attr("data-bind");
};

/**
 * @param  {Object} shape D3 selection
 * @param  {Object} data data object
 * @return {Object}      changes object
 */
Shape.dataChanges = function (shape, data) {
	if (!Shape.hasData(shape)) {
		return Object.assign({}, Shape.cleanData(data));
	}
	const prevData = Shape.getData(shape);
	if (JSON.stringify(Shape.cleanData(prevData)) !== JSON.stringify(Shape.cleanData(data))) {
		return Shape.getChanges(Shape.cleanData(data), prevData);
	}
	return null;
};

/**
 * @param  {Object} a current data
 * @param  {Object} b previous data
 * @return {Object}   changes object
 */
Shape.getChanges = function (a, b) {
	if (!a || !b) return {};
	if (typeof a !== "object" || typeof b !== "object") return {};
	const changes = {};
	Object.keys(a).forEach((key) => {
		if (typeof a[key] == "object" && !Array.isArray(a[key])) {
			const c = Shape.getChanges(a[key], b[key]);
			Object.keys(c).length > 0 ? (changes[key] = c) : null;
		} else if (Array.isArray(a[key])) {
			const c = JSON.stringify(a[key]) !== JSON.stringify(b[key]) ? a[key] : [];
			c.length > 0 ? (changes[key] = c) : null;
		} else if (JSON.stringify(a[key]) !== JSON.stringify(b[key])) {
			changes[key] = a[key];
		}
	});
	return changes;
};

export default Shape;
