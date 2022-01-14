import Shape from "../Shape.js";

/**
 * @param  {String} text
 * @param  {ShapeStyle[]} styles
 * @return {Object} shape
 */
function TextShape(text, styles = []) {
	const shape = Shape.create("g").classed("text", true);
	const textShape = shape.append("text").text(text);
	styles.forEach((style) => {
		textShape.classed(style.className, style.condition());
	});
	return shape;
}

export default TextShape;
