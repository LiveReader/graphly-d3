shape_02.shapeSize = 300;

function shape_02(data, initialShape, changes, Template) {
	const { Shape, PathShape, ShapeStyle, OnZoom, LODStyle, CollectionStyle, TextCollection } = Template;

	const shape = initialShape ? initialShape : Shape.create("g");

	addBody();
	addHead();
	addTitle();
	const headlineShape = addHeadline();

	OnZoom(data, 0.4, [LODStyle(headlineShape, "class", "hidden", (k) => k < 0.4)]);

	Shape.transform(shape, true, data.shape.scale * shape_02.shapeSize);
	return shape;

	function addBody() {
		const bodyShape = initialShape
			? shape.select("path.body")
			: PathShape(
					"M268.62,884C257.6,883.979 247.388,878.084 241.86,868.55L4.64,457.72C-0.852,448.166 -0.852,436.374 4.64,426.82L241.86,16C247.375,6.447 257.589,0.531 268.62,0.5L743.05,0.5C754.081,0.531 764.295,6.447 769.81,16L1007,426.82C1012.49,436.374 1012.49,448.166 1007,457.72L769.81,868.59C764.272,878.108 754.062,883.988 743.05,884L268.62,884Z"
			  );
		bodyShape.classed("body", true).classed("hexagon-vehicle", true).classed("background", true);
		if (!initialShape) {
			shape.append(() => bodyShape.node());
		}
		return bodyShape;
	}

	function addHead() {
		const headShape = initialShape
			? shape.select("path.head")
			: PathShape(
					"M318.483,0C318.483,0 318.407,143.503 318.359,232.359C318.339,270.326 349.059,301.142 387.025,301.241C454.452,301.416 556.745,301.682 624.393,301.858C642.738,301.905 660.344,294.629 673.302,281.644C686.261,268.658 693.501,251.038 693.416,232.692C693,143.517 692.332,0 692.332,0L318.483,0Z"
			  );
		headShape.classed("hexagon-vehicle", true).classed("header", true);
		if (!initialShape) {
			shape.append(() => headShape.node());
		}
		return headShape;
	}

	function addTitle() {
		if (!changes.label) return shape.select("g.title");
		shape.select("g.title").remove();
		const bbox = Shape.getBBox(shape);
		const titleShape = TextCollection(
			data.label,
			CollectionStyle(100, bbox.width, 0, bbox.height * 0.68, 40, 40, 1),
			[ShapeStyle("class", "hexagon-vehicle", true), ShapeStyle("class", "title", true)]
		);
		titleShape.classed("title", true);
		shape.append(() => titleShape.node());
		return titleShape;
	}

	function addHeadline() {
		if (!changes.status) return shape.select("g.headline");
		shape.select("g.headline").remove();
		const bbox = Shape.getBBox(shape);
		const headlineShape = TextCollection(
			data.status,
			CollectionStyle(100, bbox.width, 0, bbox.height * 0.235, 40, 40, 1),
			[ShapeStyle("class", "hexagon-vehicle", true), ShapeStyle("class", "headline", true)]
		);
		headlineShape.classed("headline", true);
		shape.append(() => headlineShape.node());
		return headlineShape;
	}
}

export default shape_02;
