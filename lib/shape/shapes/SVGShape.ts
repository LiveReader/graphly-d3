import Shape from "../Shape";

function SVGShape(code: string) {
	const shape = Shape.create("g");
	shape.html(code);
	return shape;
}

export default SVGShape;
