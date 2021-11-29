class PersonHexagonFactory {
	constructor(data) {
		this.data = data;

		this.shapes = {};
		this.defineShapes();

		this.statusOptions = {
			minor: "minor",
			delayed: "delayed",
			immediate: "immediate",
			deceased: "deceased",
		};

		this.render();
	}

	defineShapes() {
		this.shapes.background =
			"M268.62,884a31,31,0,0,1-26.76-15.45L4.64,457.72a31,31,0,0,1,0-30.9L241.86,16A31,31,0,0,1,268.62.5H743.05A31,31,0,0,1,769.81,16L1007,426.82a31,31,0,0,1,0,30.9L769.81,868.59A31,31,0,0,1,743.05,884Z";
		this.shapes.status =
			"M506.08,253.5C643,253.5,774.2,246.6,895.77,234L770.34,16.7A31.4,31.4,0,0,0,743.15,1H268.71a31.38,31.38,0,0,0-27.19,15.7L116.1,233.93C237.75,246.59,369.09,253.5,506.08,253.5Z";
	}

	render() {
		this.data.selectAll("g").remove();
		const hexagon = this.data.append("g");

		// set status if not available yet
		hexagon.select((d) => {
			d.status = d.status ?? this.statusOptions.immediate;
		});

		// background shape
		hexagon
			.append("path")
			.attr("d", this.shapes.background)
			.classed("hexagon-person", true)
			.classed("background", true);

		// status shape
		hexagon
			.append("path")
			.attr("d", this.shapes.status)
			.classed("hexagon-person", true)
			.classed("status", true)
			.classed("deceased", (d) => d.status === this.statusOptions.deceased)
			.classed("immediate", (d) => d.status === this.statusOptions.immediate)
			.classed("delayed", (d) => d.status === this.statusOptions.delayed)
			.classed("minor", (d) => d.status === this.statusOptions.minor);

		
		// get bounding box of hexagon
		const bbox = hexagon.node().getBBox();

		// append title
		hexagon
			.append("text")
			.attr("x", (d) => {
				return bbox.width / 2;
			})
			.attr("y", (d) => {
				return bbox.height * 0.45;
			})
			.attr("dy", "0.35em")
			.classed("hexagon-person", true)
			.classed("title", true)
			.text((d) => {
				const inicials = d.name.first.charAt(0) + d.name.last.charAt(0);
				return inicials;
			})

		// change status on click to loop through them
		hexagon.on("click", (e, d) => {
			d.status = (d.status + 1) % 4;
			this.render();
		});


		// scale hexagon to be 300px wide
		const size = 300;
		const scale = size / bbox.width;

		// translate hexagon to be centered
		hexagon.attr(
			"transform",
			`translate(${-bbox.x * scale - size / 2}, ${-bbox.y * scale - size / 2}) scale(${scale})`
		);

		return hexagon;
	}
}
