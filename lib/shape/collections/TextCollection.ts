import TextShape from "../shapes/TextShape";
import { ShapeCollection } from "./ShapeCollection";

/**
 * @param  {String} text
 * @param  {CollectionStyle} style collection style
 * @param  {ShapeStyle[]} textStyles array of text styles
 * @return {Object} shape
 */
function TextCollection(texts, style, textStyles = []) {
	const textShapes = [];
	const words = texts.split(" ");
	words.forEach((word) => {
		if (word.includes("\n")) {
			const lines = word.split("\n");
			lines.forEach((line) => {
				textShapes.push(TextShape(line, textStyles));
				textShapes.push("<break-line>");
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

export default TextCollection;
