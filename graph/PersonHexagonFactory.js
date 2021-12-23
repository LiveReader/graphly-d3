class PersonHexagonFactory extends ShapeFactory {
	constructor(simulation, data, size = 100) {
		super(simulation, size);

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
	}

	render() {
		let shape = super.render(this.data);
		const bbox = shape.node().getBBox();

		// Timer
		const timerField = new TextFieldFactory(
			shape,
			CollectionStyle(100, bbox.width, 0, bbox.height * 0.2, 40, 40, 1),
			[ShapeStyle("timer", true), ShapeStyle("hexagon-person", true), ShapeStyle("title", true)]
		);
		super.addSubShape(timerField);

		// Title: person initials
		const titlField = new TextFieldFactory(
			shape,
			CollectionStyle(100, bbox.width, 0, bbox.height * 0.47, 40, 40, 1),
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

		super.setRefreshRoutine(
			RefreshRoutine(
				(d) => !!d.countdown,
				(d, el, data) => {
					const element = el.node().getElementsByClassName("title")[0];
					const elapsed = Date.now() - data.previousTimeStamp ?? Date.now();
					let countdown = data.countdown ?? d.countdown;
					countdown < 0 ? (countdown = 0) : {};
					data.countdown = countdown - (elapsed || 0) / 1000;
					data.previousTimeStamp = Date.now();
					element.textContent = countdown.toFixed(1);
					if (countdown <= 0) return false;
				},
				100
			)
		);

		super.setOnClick((e, d, el) => {
			const statusShape = el.select(".status");
			const tagShapes = el.selectAll(".tag-background");
			statusShape.classed(d.status, false);
			tagShapes.classed(d.status, false);

			const statusIndex = Object.keys(this.statusOptions).indexOf(d.status);
			const nextStatus = Object.keys(this.statusOptions)[
				(statusIndex + 1) % Object.keys(this.statusOptions).length
			];
			d.status = nextStatus;

			statusShape.classed(d.status, true);
			tagShapes.classed(d.status, true);
		});

		return super.render(this.data, (el) => {
			el.status = el.status ?? this.statusOptions.immediate;
		});
	}
}
