import * as d3 from "d3";
import { TagShape } from "../shapes/TagShape";
import { ShapeCollection } from "./ShapeCollection";

/**
 * @param  {String[]} tags array of strings
 * @param  {CollectionStyle} style collection style
 * @param  {TagStyle} tagStyle tag style
 * @return {Object} shape
 */
function TagCollection(tags: string[], style: any, tagStyle: any): d3.Selection<SVGElement, any, any, any> {
	const tagShapes: d3.Selection<SVGElement, any, any, any>[] = [];
	tags.forEach((tag) => {
		const tagShape = TagShape(tag, tagStyle);
		tagShapes.push(tagShape);
	});
	const ellipsis = TagShape("...", tagStyle);
	const collection = ShapeCollection(tagShapes, style, ellipsis);
	return collection;
}

export default TagCollection;
