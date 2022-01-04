function ShapePath(path, styles) {
	const shape = Shape.create("path");
	shape.attr("d", path);
	styles.forEach((style) => {
		shape.classed(style.className, style.condition);
	});
	return shape.node();
}
