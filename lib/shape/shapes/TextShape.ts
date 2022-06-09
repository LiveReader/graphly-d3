import Shape from "../shape";
import { ShapeStyle, applyStyles } from "../utils/styleModifier";

/**
 * @param  {String} text
 * @param  {ShapeStyle[]} styles
 * @return {Object} shape
 */
function TextShape(text: string, styles: ShapeStyle[] = []): d3.Selection<SVGElement, any, any, any> {
	const shape = Shape.create("g").classed("text", true);
	const textShape = shape.append("text").text(text);
	applyStyles(textShape, styles);
	return shape;
}

export default TextShape;
