import Shape from "../Shape.js";

/**
 * @param  {String} text
 * @param  {ShapeStyle[]} styles
 * @return {Object} shape
 */
function TextShape(text, styles = []) {
	const shape = Shape.create("g").classed("text", true);
	const textShape = shape.append("text").text(text);
	styles.forEach((s) => {
		if (s.key == "class") {
			textShape.classed(s.value, s.condition());
		} else if (s.condition) {
			textShape.style(s.key, s.value);
		}
	});
	return shape;
}

export default TextShape;
