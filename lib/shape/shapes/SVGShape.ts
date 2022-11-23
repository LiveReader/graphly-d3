import * as Shape from "../Shape";

export function SVGShape(code: string): d3.Selection<SVGElement, any, any, any> {
	const shape = Shape.create("g");
	shape.html(code);
	return shape;
}
