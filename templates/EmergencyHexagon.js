EmergencyHexagon.shapeSize = 300;

function EmergencyHexagon(data, initialShape, changes, Template) {
	const { Shape, PathShape, ShapeStyle, Alignment, CollectionStyle, TextCollection } = Template;

	const shape = initialShape ? initialShape : Shape.create("g");

	const bodyShape = addBody();
	const titleShape = addTitle();

	Shape.transform(shape, true, data.shape.scale * EmergencyHexagon.shapeSize);
	return shape;

	function addBody() {
		const bodyShape = initialShape
			? shape.select("path.body")
			: PathShape(
					"M268.62,884a31,31,0,0,1-26.76-15.45L4.64,457.72a31,31,0,0,1,0-30.9L241.86,16A31,31,0,0,1,268.62.5H743.05A31,31,0,0,1,769.81,16L1007,426.82a31,31,0,0,1,0,30.9L769.81,868.59A31,31,0,0,1,743.05,884Z"
			  );
		bodyShape.classed("body", true).classed("hexagon-emergency", true).classed("background", true);
		if (!initialShape) {
			shape.append(() => bodyShape.node());
		}
		return bodyShape;
	}

	function addTitle() {
		if (!changes.name) return shape.select("g.title");
		shape.select("g.title").remove();
		const bbox = Shape.getBBox(shape);
		const titleShape = TextCollection(
			data.name.first,
			CollectionStyle(100, bbox.width, 0, bbox.height * 0.55, 40, 40, 1, Alignment.Center, [60]),
			[ShapeStyle("class", "hexagon-emergency", true), ShapeStyle("class", "title", true)]
		);
		titleShape.classed("title", true);
		shape.append(() => titleShape.node());
		return titleShape;
	}
}

export default EmergencyHexagon;
