import Shape from "../Shape.js";

function SVGShape(code) {
	const shape = Shape.create("g");
	shape.html(code);
	return shape;
}

export default SVGShape;
