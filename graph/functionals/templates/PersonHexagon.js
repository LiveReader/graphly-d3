function PersonHexagon(data, initialShape) {
	const shape = initialShape ? initialShape : Shape.create("g");
	// shape.selectAll("*").remove();

	addPaths();
	addTags();
	addTitle();

	if (!initialShape) {
		Shape.resize(shape, data.shape.scale * 300);
	}

	return shape;

	function addPaths() {
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
			.classed("minor", data.status === "minor");

		if (!initialShape) {
			shape.append(() => bodyShape.node());
			shape.append(() => headShape.node());
		}
	}

	function addTags() {
		shape.select("g.tags").remove();
		const bbox = Shape.getBBox(shape);
		const tagCollection = TagCollection(
			data.tags,
			CollectionStyle(310, bbox.width, 0, bbox.height * 0.6, 20, 20, 3, Alignment.Center, [110, 170, 230]),
			TagStyle(
				[40, 15],
				[ShapeStyle("hexagon-person", true), ShapeStyle("tag-text", true)],
				[
					ShapeStyle("hexagon-person", true),
					ShapeStyle("tag-background", true),
					ShapeStyle("status", true),
					ShapeStyle("deceased", data.status === "deceased"),
					ShapeStyle("immediate", data.status === "immediate"),
					ShapeStyle("delayed", data.status === "delayed"),
					ShapeStyle("minor", data.status === "minor"),
				],
				45
			)
		);
		tagCollection.attr("id", "tags");
		shape.append(() => tagCollection.node());
	}

	function addTitle() {
		shape.select("text.title").remove();
		const bbox = Shape.getBBox(shape);
		const initials = data.name.first.charAt(0) + data.name.last.charAt(0);
		const title = TextCollection(
			initials,
			CollectionStyle(100, bbox.width, 0, bbox.height * 0.47, 40, 40, 1, Alignment.Center, [60]),
			[ShapeStyle("hexagon-person", true), ShapeStyle("title", true)]
		);
		title.classed("title", true);
		shape.append(() => title.node());
	}
}

Templates.add("shape_01", PersonHexagon);
