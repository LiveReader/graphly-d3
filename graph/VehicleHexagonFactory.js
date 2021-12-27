class VehicleHexagonFactory extends ShapeFactory {
	constructor(simulation, data, size = 100) {
		super(simulation, size);

		this.simulation = simulation;
		this.data = data;

		super
			.addPathComponent(
				// body shape
				"M268.62,884C257.6,883.979 247.388,878.084 241.86,868.55L4.64,457.72C-0.852,448.166 -0.852,436.374 4.64,426.82L241.86,16C247.375,6.447 257.589,0.531 268.62,0.5L743.05,0.5C754.081,0.531 764.295,6.447 769.81,16L1007,426.82C1012.49,436.374 1012.49,448.166 1007,457.72L769.81,868.59C764.272,878.108 754.062,883.988 743.05,884L268.62,884Z",
				[
					ShapeStyle("hexagon-vehicle", true),
					ShapeStyle("background", true),
					ShapeStyle("shadow", true),
				]
			)
			.addPathComponent(
				// head shape
				"M318.483,0C318.483,0 318.407,143.503 318.359,232.359C318.339,270.326 349.059,301.142 387.025,301.241C454.452,301.416 556.745,301.682 624.393,301.858C642.738,301.905 660.344,294.629 673.302,281.644C686.261,268.658 693.501,251.038 693.416,232.692C693,143.517 692.332,0 692.332,0L318.483,0Z",
				[ShapeStyle("hexagon-vehicle", true), ShapeStyle("header", true)]
			);
	}

	render() {
		let shape = super.render(this.data);
		const bbox = shape.node().getBBox();

		this.renderHeadline(shape, bbox);
		this.renderTitle(shape, bbox);

		return super.render(this.data);
	}

	renderHeadline(shape, bbox) {
		const headlineField = new TextFieldFactory(
			this.simulation,
			shape,
			CollectionStyle(100, bbox.width, 0, bbox.height * 0.235, 40, 40, 1),
			[ShapeStyle("hexagon-vehicle", true), ShapeStyle("headline", true)],
			(el) => el.status
		);
		headlineField.addLODstyle(LODStyle("hidden", (el, k) => k < 0.4));
		super.addSubShape(headlineField);
	}

	renderTitle(shape, bbox) {
		const titleField = new TextFieldFactory(
			this.simulation,
			shape,
			CollectionStyle(100, bbox.width, 0, bbox.height * 0.68, 40, 40, 1, "center", [60]),
			[ShapeStyle("hexagon-vehicle", true), ShapeStyle("title", true)],
			(el) => el.label
		);
		super.addSubShape(titleField);
	}
}
