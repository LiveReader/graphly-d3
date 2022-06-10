import * as d3 from "d3";
import { TagShape, TagStyle } from "../shapes/TagShape";
import { ShapeCollection, CollectionStyle } from "./ShapeCollection";

export function TagCollection(
	tags: string[],
	style: CollectionStyle,
	tagStyle: TagStyle
): d3.Selection<SVGElement, any, any, any> {
	const tagShapes: d3.Selection<SVGElement, any, any, any>[] = [];
	tags.forEach((tag) => {
		const tagShape = TagShape(tag, tagStyle);
		tagShapes.push(tagShape);
	});
	const ellipsis = TagShape("...", tagStyle);
	const collection = ShapeCollection(tagShapes, style, ellipsis);
	return collection;
}
