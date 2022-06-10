import * as d3 from "d3";
import TextShape from "../shapes/TextShape";
import { ShapeStyle } from "../utils/styleModifier";
import { ShapeCollection, CollectionStyle, BreakLine } from "./ShapeCollection";

export function TextCollection(
	text: string,
	style: CollectionStyle,
	textStyles: ShapeStyle[] = []
): d3.Selection<SVGElement, any, any, any> {
	const textShapes: (d3.Selection<SVGElement, any, any, any> | BreakLine)[] = [];
	const words = text.split(" ");
	words.forEach((word) => {
		if (word.includes("\n")) {
			const lines = word.split("\n");
			lines.forEach((line) => {
				textShapes.push(TextShape(line, textStyles));
				textShapes.push(BreakLine());
			});
			textShapes.pop();
		} else {
			textShapes.push(TextShape(word, textStyles));
		}
	});
	const ellipsis = TextShape("...", textStyles);
	const collection = ShapeCollection(textShapes, style, ellipsis);
	return collection;
}
