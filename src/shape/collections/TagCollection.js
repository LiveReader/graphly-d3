import { TagShape } from "../shapes/TagShape.js";
import { ShapeCollection } from "./ShapeCollection.js";

/**
 * @param  {String[]} tags array of strings
 * @param  {CollectionStyle} style collection style
 * @param  {TagStyle} tagStyle tag style
 * @return {Object} shape
 */
function TagCollection(tags, style, tagStyle) {
	const tagShapes = [];
	tags.forEach((tag) => {
		const tagShape = TagShape(tag, tagStyle);
		tagShapes.push(tagShape);
	});
	const ellipsis = TagShape("...", tagStyle);
	const collection = ShapeCollection(tagShapes, style, ellipsis);
	return collection;
}

export default TagCollection;
