class PersonHexagonFactory extends ShapeFactory {
	constructor(data, size = 100) {
		super(size);

		this.data = data;
		this.statusOptions = {
			minor: "minor",
			delayed: "delayed",
			immediate: "immediate",
			deceased: "deceased",
		};

		super
			.addPathComponent(
				// body shape
				"M268.62,884a31,31,0,0,1-26.76-15.45L4.64,457.72a31,31,0,0,1,0-30.9L241.86,16A31,31,0,0,1,268.62.5H743.05A31,31,0,0,1,769.81,16L1007,426.82a31,31,0,0,1,0,30.9L769.81,868.59A31,31,0,0,1,743.05,884Z",
				[ShapeStyle("hexagon-person", true), ShapeStyle("background", true), ShapeStyle("shadow", true)]
			)
			.addPathComponent(
				// status head shape
				"M506.08,253.5C643,253.5,774.2,246.6,895.77,234L770.34,16.7A31.4,31.4,0,0,0,743.15,1H268.71a31.38,31.38,0,0,0-27.19,15.7L116.1,233.93C237.75,246.59,369.09,253.5,506.08,253.5Z",
				[
					ShapeStyle("hexagon-person", true),
					ShapeStyle("status", true),
					ShapeStyle("deceased", (el) => el.status === this.statusOptions.deceased),
					ShapeStyle("immediate", (el) => el.status === this.statusOptions.immediate),
					ShapeStyle("delayed", (el) => el.status === this.statusOptions.delayed),
					ShapeStyle("minor", (el) => el.status === this.statusOptions.minor),
				]
			);

		return this.render();
		// return super.render(this.data);
	}

	render() {
		let hexagon = super.render(this.data);
		this.addTitle(hexagon);
		this.addTags(hexagon);

		hexagon = super.render(this.data, (el) => {
			el.status = el.status ?? this.statusOptions.immediate;
		});

		return hexagon;
	}

	addTitle(shape) {
		const bbox = shape.node().getBBox();
		const title = new CollectionFactory(CollectionStyle(80, bbox.width, 0, bbox.height * 0.47, 10, 10, 2));
		super.addSubShape(title);

		shape.select((d) => {
			const currentNode = shape.filter((el) => el.id === d.id);
			currentNode.select((el) => {
				const inicials = el.name.first.charAt(0) + el.name.last.charAt(0);
				const text = Text(currentNode, inicials, [
					ShapeStyle("hexagon-person", true),
					ShapeStyle("title", true),
				]);
				title.addItem(text, currentNode)
			});
		});
	}

	addTags(shape) {
		const bbox = shape.node().getBBox();
		const tagCollection = new CollectionFactory(
			CollectionStyle(310, bbox.width, 0, bbox.height * 0.6, 20, 20, 3, "center", [70, 120, 170])
		);
		super.addSubShape(tagCollection);

		shape.select((d) => {
			const currentNode = shape.filter((el) => el.id === d.id);
			currentNode.select((el) => {
				el.tags.forEach((tag) => {
					const tagShape = Tag(
						currentNode,
						tag,
						[40, 15],
						[ShapeStyle("tag", false)],
						[ShapeStyle("hexagon-person", true), ShapeStyle("tag-text", true)],
						[
							ShapeStyle("hexagon-person", true),
							ShapeStyle("status", true),
							ShapeStyle("tag-background", true),
							ShapeStyle("deceased", (el) => el.status === this.statusOptions.deceased),
							ShapeStyle("immediate", (el) => el.status === this.statusOptions.immediate),
							ShapeStyle("delayed", (el) => el.status === this.statusOptions.delayed),
							ShapeStyle("minor", (el) => el.status === this.statusOptions.minor),
						]
					);
					tagCollection.addItem(tagShape, currentNode);
				});
			});
		});
	}
}
