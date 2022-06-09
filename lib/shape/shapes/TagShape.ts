import * as d3 from "d3";
import Shape from "../shape";
import { ShapeStyle, applyStyles } from "../utils/styleModifier";

/**
 * @param  {Number[]} padding padding of tag [x,y]
 * @param  {ShapeStyle[]} textStyles array of css classes
 * @param  {ShapeStyle[]} backgroundStyles array of css classes
 * @param  {Number} cornerRadius radius of the corners
 */
function TagStyle(
	padding: number[] = [0, 0],
	textStyles: ShapeStyle[] = [],
	backgroundStyles: ShapeStyle[] = [],
	cornerRadius: number = 0
) {
	return {
		padding: typeof padding === "number" ? [padding, padding] : padding,
		textStyles: textStyles,
		backgroundStyles: backgroundStyles,
		cornerRadius: cornerRadius,
	};
}

/**
 * @param  {String} text text of tag
 * @param  {TagStyle} style of the tag
 * @return {Object} shape
 */
function TagShape(text: string, style: any): d3.Selection<SVGElement, any, any, any> {
	const shape = Shape.create("g").classed("tag", true);

	const textShape = shape.append("text").text(text).attr("dy", "0.35em");
	applyStyles(textShape, style.textStyles);
	const textBBox = Shape.getBBox(shape);

	const width = textBBox.width + style.padding[0] * 2;
	const height = textBBox.height + style.padding[1] * 2;
	const cr = style.cornerRadius;
	const backgroundShape = shape
		.append("path")
		.attr(
			"d",
			`M ${0} ${-height / 2} ` +
				`L ${width / 2 - cr} ${-height / 2} ` +
				`A ${cr} ${cr} 0 0 1 ${width / 2} ${-(height / 2) + cr} ` +
				`L ${width / 2} ${height / 2 - cr} ` +
				`A ${cr} ${cr} 0 0 1 ${width / 2 - cr} ${height / 2} ` +
				`L ${-width / 2 + cr} ${height / 2} ` +
				`A ${cr} ${cr} 0 0 1 ${-width / 2} ${height / 2 - cr} ` +
				`L ${-width / 2} ${-height / 2 + cr} ` +
				`A ${cr} ${cr} 0 0 1 ${-width / 2 + cr} ${-height / 2} ` +
				`Z`
		);
	applyStyles(backgroundShape, style.backgroundStyles);
	textShape.remove();
	shape.append(() => textShape.node());
	return shape;
}

export { TagStyle, TagShape };
