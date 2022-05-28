import Shape from "../Shape";

function PathShape(path: string) {
	const shape = Shape.create("path");
	shape.attr("d", path);
	return shape;
}

export default PathShape;
