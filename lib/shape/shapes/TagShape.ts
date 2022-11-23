import * as d3 from "d3";
import * as Shape from "../Shape";
import { ShapeStyle, applyStyles } from "../utils/styleModifier";

export interface TagStyle {
	padding: {
		top: number;
		right: number;
		bottom: number;
		left: number;
	};
	textStyles: ShapeStyle[];
	backgroundStyles: ShapeStyle[];
	cornerRadius: number;
}

export function TagStyle(
	padding: number | [number, number] | [number, number, number, number],
	textStyles: ShapeStyle[] = [],
	backgroundStyles: ShapeStyle[] = [],
	cornerRadius: number = 0
): TagStyle {
	let p = {
		top: 0,
		right: 0,
		bottom: 0,
		left: 0,
	};
	if (typeof padding === "number") {
		p = { top: padding, right: padding, bottom: padding, left: padding };
	} else if (Array.isArray(padding) && padding.length === 2) {
		p = { top: padding[0], right: padding[1], bottom: padding[0], left: padding[1] };
	} else if (Array.isArray(padding) && padding.length === 4) {
		p = { top: padding[0], right: padding[1], bottom: padding[2], left: padding[3] };
	}
	return {
		padding: p,
		textStyles: textStyles,
		backgroundStyles: backgroundStyles,
		cornerRadius: cornerRadius,
	};
}

export function TagShape(text: string, style: TagStyle): d3.Selection<SVGElement, any, any, any> {
	const shape = Shape.create("g").classed("tag", true);

	const textShape = shape.append("text").text(text).attr("dy", "0.35em").attr("text-anchor", "middle");
	applyStyles(textShape, style.textStyles);
	const textBBox = Shape.getBBox(shape);

	const width = textBBox.width;
	const height = textBBox.height;
	const pt = style.padding.top;
	const pr = style.padding.right;
	const pb = style.padding.bottom;
	const pl = style.padding.left;
	const cr = style.cornerRadius;
	const backgroundShape = shape
		.append("path")
		.attr(
			"d",
			`M ${0} ${-(height / 2) - pt} ` +
				`L ${width / 2 + pr - cr} ${-(height / 2) - pt} ` +
				`A ${cr} ${cr} 0 0 1 ${width / 2 + pr} ${-(height / 2) - pt + cr} ` +
				`L ${width / 2 + pr} ${height / 2 + pb - cr} ` +
				`A ${cr} ${cr} 0 0 1 ${width / 2 + pr - cr} ${height / 2 + pb} ` +
				`L ${-(width / 2) - pl + cr} ${height / 2 + pb} ` +
				`A ${cr} ${cr} 0 0 1 ${-(width / 2) - pl} ${height / 2 + pb - cr} ` +
				`L ${-(width / 2) - pl} ${-(height / 2) - pt + cr} ` +
				`A ${cr} ${cr} 0 0 1 ${-(width / 2) - pl + cr} ${-(height / 2) - pt} ` +
				`Z`
		);
	applyStyles(backgroundShape, style.backgroundStyles);
	textShape.remove();
	shape.append(() => textShape.node());
	return shape;
}
