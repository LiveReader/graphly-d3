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

		this.render();
	}

	render() {
		let shape = super.render(this.data);
		const bbox = shape.node().getBBox();

		// Title: person initials
		const titlField = new TextFieldFactory(
			shape,
			CollectionStyle(300, bbox.width, 0, bbox.height * 0.47, 40, 40, 2),
			[ShapeStyle("hexagon-person", true), ShapeStyle("title", true)],
			(el) => {
				const initials = el.name.first.charAt(0) + el.name.last.charAt(0);
				return initials;
			}
		);
		super.addSubShape(titlField);

		// Tags: person related status tags
		const tagCollection = new TagCollectionFactory(
			shape,
			CollectionStyle(310, bbox.width, 0, bbox.height * 0.6, 20, 20, 3, "center", [110, 170, 230]),
			TagStyle(
				[40, 15],
				[ShapeStyle("hexagon-person", true), ShapeStyle("tag-text", true)],
				[
					ShapeStyle("hexagon-person", true),
					ShapeStyle("tag-background", true),
					ShapeStyle("status", true),
					ShapeStyle("deceased", (el) => el.status === this.statusOptions.deceased),
					ShapeStyle("immediate", (el) => el.status === this.statusOptions.immediate),
					ShapeStyle("delayed", (el) => el.status === this.statusOptions.delayed),
					ShapeStyle("minor", (el) => el.status === this.statusOptions.minor),
				]
			),
			(el) => {
				return el.tags;
			}
		);
		super.addSubShape(tagCollection);

		return super.render(this.data, (el) => {
			el.status = el.status ?? this.statusOptions.immediate;
		});
	}
}
