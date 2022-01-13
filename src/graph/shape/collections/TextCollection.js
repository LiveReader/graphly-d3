import * as TextShape from "../shapes/TextShape";
import { CollectionStyle, ShapeCollection } from "./ShapeCollection";

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
		const textShape = TextShape(word, textStyles);
		textShapes.push(textShape);
	});
	const ellipsis = TextShape("...", textStyles);
	const collection = ShapeCollection(textShapes, style, ellipsis);
	return collection;
}

export default TextCollection;
