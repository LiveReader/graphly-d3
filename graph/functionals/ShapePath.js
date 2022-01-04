function ShapePath(path) {
	const shape = Shape.create("path");
	shape.attr("d", path);
	return shape;
}
