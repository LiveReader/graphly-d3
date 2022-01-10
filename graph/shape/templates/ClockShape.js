ClockShape.shapeSize = 150;

function ClockShape(data, initialShape, changes) {
	const shapeSize = ClockShape.shapeSize;
	const shape = initialShape ? initialShape : Shape.create("g");

	const bodyShape = addBody();
	const timeDots = addTimeDots();
	const timeLabels = addTimeLabels();
	const hourHand = addHand("hour", shapeSize / 4, shapeSize / 20, "#3a3a4f");
	const minuteHand = addHand("hour", shapeSize / 3, shapeSize / 30, "#3a3a4f");
	const secondHand = addHand("hour", shapeSize / 2.5, shapeSize / 40, "#c03030");
	const centerDot = addCenterDot();

	// rotate the hands to the current time
	if (!initialShape) {
		const timerID = setInterval(() => {
			const now = new Date();
			const hour = now.getHours() % 12;
			const minute = now.getMinutes();
			const second = now.getSeconds();
			const hourAngle = (hour / 12) * 360;
			const minuteAngle = (minute / 60) * 360;
			const secondAngle = (second / 60) * 360;
			hourHand.attr(
				"transform",
				`translate(${-(shapeSize / 2)}, ${-(shapeSize / 2)}), rotate(${hourAngle}, ${shapeSize / 2}, ${
					shapeSize / 2
				})`
			);
			minuteHand.attr(
				"transform",
				`translate(${-(shapeSize / 2)}, ${-(shapeSize / 2)}), rotate(${minuteAngle}, ${shapeSize / 2}, ${
					shapeSize / 2
				})`
			);
			secondHand.attr(
				"transform",
				`translate(${-(shapeSize / 2)}, ${-(shapeSize / 2)}), rotate(${secondAngle}, ${shapeSize / 2}, ${
					shapeSize / 2
				})`
			);
		}, 1000);
	}

	OnZoom(data, 0.6, [
		LODStyle(timeLabels, "hidden", (k) => k < 0.6),
		LODStyle(timeDots, "hidden", (k) => k > 0.6 || k < 0.4),
	]);
	OnZoom(data, 0.4, [
		LODStyle(timeDots, "hidden", (k) => k > 0.6 || k < 0.4),
		LODStyle(secondHand, "hidden", (k) => k < 0.4),
	]);

	Shape.transform(shape, false, data.shape.scale * shapeSize);
	return shape;

	function addBody() {
		const bodyShape = initialShape ? initialShape.select("circle.body") : Shape.create("circle");
		bodyShape.classed("body", true).attr("r", shapeSize / 2);
		if (!initialShape) {
			shape.append(() => bodyShape.node());
		}
		return bodyShape;
	}

	function addTimeDots() {
		const timeDots = initialShape ? initialShape.selectAll("circle.time-indicator-dot") : Shape.create("g");
		timeDots.classed("time-indicator-dot", true);

		for (let i = 0; i < 12; i++) {
			const dot = timeDots.append("circle");
			dot.classed("time-indicator-dot", true)
				.attr("r", shapeSize / 30)
				.attr("fill", "#3a3a4f")
				.attr(
					"transform",
					`translate(${(shapeSize / 2.6) * Math.cos((i * Math.PI) / 6)}, ${
						(shapeSize / 2.6) * Math.sin((i * Math.PI) / 6)
					})`
				);
			timeDots.append(() => dot.node());
		}

		if (!initialShape) {
			shape.append(() => timeDots.node());
		}
		return timeDots;
	}

	function addTimeLabels() {
		const timeLabels = initialShape ? initialShape.selectAll("text.time-indicator-label") : Shape.create("g");
		timeLabels.classed("time-indicator-label", true);

		for (let i = 0; i < 12; i++) {
			const label = timeLabels.append("text");
			label
				.classed("time-indicator-label", true)
				.attr("text-anchor", "middle")
				.attr("dominant-baseline", "central")
				.attr("fill", "#3a3a4f")
				.attr("stroke", "#3a3a4f")
				.attr("font-size", 16)
				.attr(
					"transform",
					`translate(${(shapeSize / 2.6) * Math.cos((i * Math.PI) / 6)}, ${
						(shapeSize / 2.6) * Math.sin((i * Math.PI) / 6)
					})`
				)
				.text((i + 2 < 12 ? i + 2 : i - 10) + 1);
			timeLabels.append(() => label.node());
		}

		if (!initialShape) {
			shape.append(() => timeLabels.node());
		}
		return timeLabels;
	}

	function addHand(hand, length, width, color) {
		const handShape = initialShape ? initialShape.select(`path.${hand}-hand`) : Shape.create("path");
		handShape
			.classed(`${hand}-hand`, true)
			.attr("d", `M ${shapeSize / 2}, ${shapeSize / 2} L ${shapeSize / 2}, ${shapeSize / 2 - length}`)
			.attr("stroke", color)
			.attr("stroke-width", width)
			.attr("transform", `translate(${-(shapeSize / 2)}, ${-(shapeSize / 2)})`);
		if (!initialShape) {
			shape.append(() => handShape.node());
		}
		return handShape;
	}

	function addCenterDot() {
		const centerDot = initialShape ? initialShape.select("circle.center-dot") : Shape.create("circle");
		centerDot
			.classed("center-dot", true)
			.attr("r", shapeSize / 30)
			.attr("fill", "#3a3a4f");
		if (!initialShape) {
			shape.append(() => centerDot.node());
		}
		return centerDot;
	}
}

Templates.add("shape_clock", ClockShape);
