function PersonHexagon(data) {
	const rndColor = () => {
		const r = Math.floor(Math.random() * 255);
		const g = Math.floor(Math.random() * 255);
		const b = Math.floor(Math.random() * 255);
		return `rgb(${r}, ${g}, ${b})`;
	};

	const shape = Shape.create("g");
	shape.append(() =>
		ShapePath(
			// body shape
			"M268.62,884a31,31,0,0,1-26.76-15.45L4.64,457.72a31,31,0,0,1,0-30.9L241.86,16A31,31,0,0,1,268.62.5H743.05A31,31,0,0,1,769.81,16L1007,426.82a31,31,0,0,1,0,30.9L769.81,868.59A31,31,0,0,1,743.05,884Z",
			[
				ShapeStyle("hexagon-person", true),
				ShapeStyle("shadow", true),
				// LODStyle("background", (el, k) => k > 0.2),
				// LODStyle("status", (el, k) => k < 0.2),
				// LODStyle("deceased", (el, k) => data.status === "deceased" && k < 0.2),
				// LODStyle("immediate", (el, k) => data.status === "immediate" && k < 0.2),
				// LODStyle("delayed", (el, k) => data.status === "delayed" && k < 0.2),
				// LODStyle("minor", (el, k) => data.status === "minor" && k < 0.2),
			]
		)
	);
	shape.append(() =>
		ShapePath(
			// status head shape
			"M506.08,253.5C643,253.5,774.2,246.6,895.77,234L770.34,16.7A31.4,31.4,0,0,0,743.15,1H268.71a31.38,31.38,0,0,0-27.19,15.7L116.1,233.93C237.75,246.59,369.09,253.5,506.08,253.5Z",
			[
				ShapeStyle("hexagon-person", true),
				ShapeStyle("status", true),
				ShapeStyle("deceased", data.status === "deceased"),
				ShapeStyle("immediate", data.status === "immediate"),
				ShapeStyle("delayed", data.status === "delayed"),
				ShapeStyle("minor", data.status === "minor"),
			]
		)
	)

	Shape.resize(shape, data.shape.scale * 300);

	return shape.node();
}

Templates.add("shape_01", PersonHexagon);
