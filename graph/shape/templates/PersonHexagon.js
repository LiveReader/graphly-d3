function PersonHexagon(data, initialShape, changes) {
	const shapeSize = 300;
	const shape = initialShape ? initialShape : Shape.create("g");
	// shape.selectAll("*").remove();

	const bodyShape = addBody();
	const headShape = addHead();
	const tagCollection = addTags();
	const titleShape = addTitle();
	const largeTitleShape = addLargeTitle();
	const timerShape = addTimer();

	// Timer Shape
	if (changes.countdown && data.countdown && data.countdown > 0) {
		let previousTimeStamp = Date.now();
		const timerID = setInterval(() => {
			const elapsed = Date.now() - previousTimeStamp;
			let countdown = data.countdown - elapsed / 1000;
			if (countdown <= 0) {
				countdown = 0;
				timerShape.select("text").text(countdown.toFixed(1));
				clearInterval(timerID);
				return;
			}
			timerShape.select("text").text(countdown.toFixed(1));
		}, 100);
	}

	OnZoom(data, 0.2, [
		LODStyle(bodyShape, "background", (k) => k > 0.2),
		LODStyle(bodyShape, "status", (k) => k < 0.2),
		LODStyle(bodyShape, "deceased", (k) => data.status === "deceased" && k < 0.2),
		LODStyle(bodyShape, "immediate", (k) => data.status === "immediate" && k < 0.2),
		LODStyle(bodyShape, "delayed", (k) => data.status === "delayed" && k < 0.2),
		LODStyle(bodyShape, "minor", (k) => data.status === "minor" && k < 0.2),
		LODStyle(largeTitleShape, "hidden", (k) => k > 0.6 || k < 0.2),
	]);
	OnZoom(data, 0.6, [
		LODStyle(tagCollection, "hidden", (k) => k < 0.6),
		LODStyle(titleShape, "hidden", (k) => k < 0.6),
		LODStyle(largeTitleShape, "hidden", (k) => k > 0.6 || k < 0.2),
		LODStyle(timerShape, "hidden", (k) => k < 0.6),
	]);

	Shape.transform(shape, true, data.shape.scale * shapeSize);
	return shape;

	function addBody() {
		const bodyShape = initialShape
			? shape.select("path.body")
			: PathShape(
					"M268.62,884a31,31,0,0,1-26.76-15.45L4.64,457.72a31,31,0,0,1,0-30.9L241.86,16A31,31,0,0,1,268.62.5H743.05A31,31,0,0,1,769.81,16L1007,426.82a31,31,0,0,1,0,30.9L769.81,868.59A31,31,0,0,1,743.05,884Z"
			  );
		bodyShape.classed("body", true).classed("hexagon-person", true);
		if (!initialShape) {
			shape.append(() => bodyShape.node());
		}
		return bodyShape;
	}

	function addHead() {
		const headShape = initialShape
			? shape.select("path.head")
			: PathShape(
					"M506.08,253.5C643,253.5,774.2,246.6,895.77,234L770.34,16.7A31.4,31.4,0,0,0,743.15,1H268.71a31.38,31.38,0,0,0-27.19,15.7L116.1,233.93C237.75,246.59,369.09,253.5,506.08,253.5Z"
			  );
		headShape
			.classed("head", true)
			.classed("hexagon-person", true)
			.classed("status", true)
			.classed("deceased", data.status === "deceased")
			.classed("immediate", data.status === "immediate")
			.classed("delayed", data.status === "delayed")
			.classed("minor", data.status === "minor");
		if (!initialShape) {
			shape.append(() => headShape.node());
		}
		return headShape;
	}

	function addTags() {
		if (!(changes.tags || changes.status)) return shape.select("g.tags");
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
		tagCollection.classed("tags", true);
		shape.append(() => tagCollection.node());
		return tagCollection;
	}

	function addTitle() {
		if (!changes.name) return shape.select("g.title");
		shape.select("g.title").remove();
		const bbox = Shape.getBBox(shape);
		const initials = data.name.first.charAt(0) + data.name.last.charAt(0);
		const titleShape = TextCollection(
			initials,
			CollectionStyle(100, bbox.width, 0, bbox.height * 0.47, 40, 40, 1, Alignment.Center, [60]),
			[ShapeStyle("hexagon-person", true), ShapeStyle("title", true)]
		);
		titleShape.classed("title", true);
		shape.append(() => titleShape.node());
		return titleShape;
	}

	function addLargeTitle() {
		if (!changes.name) return shape.select("g.largeTitle");
		shape.select("g.largeTitle").remove();
		const bbox = Shape.getBBox(shape);
		const initials = data.name.first.charAt(0) + data.name.last.charAt(0);
		const largeTitleShape = TextCollection(
			initials,
			CollectionStyle(100, bbox.width, 0, bbox.height * 0.65, 40, 40, 1, Alignment.Center, [60]),
			[ShapeStyle("hexagon-person", true), ShapeStyle("title", true), ShapeStyle("large", true)]
		);
		largeTitleShape.classed("largeTitle", true);
		shape.append(() => largeTitleShape.node());
		return largeTitleShape;
	}

	function addTimer() {
		if (initialShape) return shape.select("g.countdown");
		const bbox = Shape.getBBox(shape);
		const timerShape = TextCollection("", CollectionStyle(100, bbox.width, 0, bbox.height * 0.2, 40, 40, 1), [
			ShapeStyle("timer", true),
			ShapeStyle("hexagon-person", true),
			ShapeStyle("title", true),
		]);
		timerShape.classed("countdown", true);
		shape.append(() => timerShape.node());
		return timerShape;
	}
}

Templates.add("shape_01", PersonHexagon);
