import Shape from "../Shape";

function SVGShape(code: string): d3.Selection<SVGElement, any, any, any> {
	const shape = Shape.create("g");
	shape.html(code);
	return shape;
}

export default SVGShape;
