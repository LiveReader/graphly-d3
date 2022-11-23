import * as Shape from "../Shape";

export function PathShape(path: string): d3.Selection<SVGElement, any, any, any> {
	const shape = Shape.create("path");
	shape.attr("d", path);
	return shape;
}
