import Shape from "../Shape";

function PathShape(path) {
	const shape = Shape.create("path");
	shape.attr("d", path);
	return shape;
}

export default PathShape;
