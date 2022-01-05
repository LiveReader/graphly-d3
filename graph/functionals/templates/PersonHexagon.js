function PersonHexagon(data, initialShape) {
	const shape = initialShape ? initialShape : Shape.create("g");
	// shape.selectAll("*").remove();

	const bodyShape = initialShape
		? shape.select("path.background")
		: PathShape(
				"M268.62,884a31,31,0,0,1-26.76-15.45L4.64,457.72a31,31,0,0,1,0-30.9L241.86,16A31,31,0,0,1,268.62.5H743.05A31,31,0,0,1,769.81,16L1007,426.82a31,31,0,0,1,0,30.9L769.81,868.59A31,31,0,0,1,743.05,884Z"
		  );

	bodyShape.classed("hexagon-person", true).classed("background", true).classed("shadow", true);
	// .classed("status", true)
	// .classed("deceased", true)
	// .classed("immediate", true)
	// .classed("delayed", true)
	// .classed("minor", true)

	const headShape = initialShape
		? shape.select("path.status")
		: PathShape(
				"M506.08,253.5C643,253.5,774.2,246.6,895.77,234L770.34,16.7A31.4,31.4,0,0,0,743.15,1H268.71a31.38,31.38,0,0,0-27.19,15.7L116.1,233.93C237.75,246.59,369.09,253.5,506.08,253.5Z"
		  );

	headShape
		.classed("hexagon-person", true)
		.classed("status", true)
		.classed("deceased", data.status === "deceased")
		.classed("immediate", data.status === "immediate")
		.classed("delayed", data.status === "delayed")
		.classed("minor", data.status === "minor")
	
	const test = ShapeCollection([], CollectionStyle(0, 0, 0, 0, 0, 0, 0))

	if (!initialShape) {
		shape.append(() => bodyShape.node());
		shape.append(() => headShape.node());
		Shape.resize(shape, data.shape.scale * 300);
	}

	return shape;
}

Templates.add("shape_01", PersonHexagon);
