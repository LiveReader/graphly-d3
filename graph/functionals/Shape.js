const Shape = () => {};

/**
 * @callback onElement
 * @param {object} el HTML element
 */
/**
 * @param  {object} shape D3 selection
 * @callback  onElement
 */
Shape.prerender = function (shape, onElement = (el) => {}) {
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
}

/**
 * @param  {object} shape D3 selection
 * @return {object}       Bounding box
 */
Shape.getBBox = function (shape) {
	let bbox = null;
	Shape.prerender(shape, (el) => {
		bbox = el.getBBox();
	});
	return bbox;
};

/**
 * @param  {string} type svg element type
 * @return {object}      D3 selection
 */
Shape.create = function (type) {
	return d3.select(document.createElementNS("http://www.w3.org/2000/svg", type));
};

/**
 * @param  {object} shape D3 selection
 * @param  {object} size width of the shape
 */
Shape.resize = function (shape, size) {
	const bbox = Shape.getBBox(shape);
	const scale = size / bbox.width;
	shape.attr(
		"transform",
		`translate(${(-bbox.width * scale) / 2 || 0}, ${(-bbox.height * scale) / 2 || 0}) scale(${scale || 1})`
	);
};
