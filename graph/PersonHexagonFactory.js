class PersonHexagonFactory {
	constructor(data) {
		this.data = data;
		this.size = 100;

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

	setSize(size) {
		this.size = size;
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

		this.renderShape(hexagon);
		this.renderTitle(hexagon);
		this.renderTags(hexagon);

		// get bounding box of hexagon
		const bbox = hexagon.node().getBBox();

		// scale hexagon to be 300px wide
		const scale = this.size / bbox.width;

		// translate hexagon to be centered
		hexagon.attr(
			"transform",
			`translate(${-(bbox.width * scale) / 2}, ${-(bbox.height * scale) / 2}) scale(${scale})`
		);

		return hexagon;
	}

	renderShape(shape) {
		// background shape
		shape
			.append("path")
			.attr("d", this.shapes.background)
			.classed("hexagon-person", true)
			.classed("background", true);

		// status shape
		shape
			.append("path")
			.attr("d", this.shapes.status)
			.classed("hexagon-person", true)
			.classed("status", true)
			.classed("deceased", (d) => d.status === this.statusOptions.deceased)
			.classed("immediate", (d) => d.status === this.statusOptions.immediate)
			.classed("delayed", (d) => d.status === this.statusOptions.delayed)
			.classed("minor", (d) => d.status === this.statusOptions.minor);
	}

	renderTitle(shape) {
		const bbox = shape.node().getBBox();

		shape
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
			});
	}

	renderTags(shape) {
		const bbox = shape.node().getBBox();
		const margin = 80;

		const allTagShapes = [];

		shape.select((d) => {

			const tagShapes = [];

			d.tags.forEach((tag) => {

				const tagShape = shape
					.append("g")
					.classed("hexagon-person", true)
					.classed("tag", true);

				const tagText = tagShape
					.append("text")
					.classed("hexagon-person", true)
					.classed("tag", true)
					.text(tag)
					.attr("dy", "0.65em");

				const tagBackground = tagShape
					.append("rect")
					.attr("rx", 35)
					.attr("ry", 35)
					.attr("height", 70)
					.attr("width", () => {
						const textBBox = tagText.node().getBBox();
						return textBBox.width + margin;
					})
					.attr("x", () => {
						const textBBox = tagText.node().getBBox();
						return (-textBBox.width / 2) - margin / 2;
					})
					.attr("y", () => {
						const textBBox = tagText.node().getBBox();
						return -textBBox.height / 2;
					})
					.classed("hexagon-person", true)
					.classed("status", true)
					.classed("deceased", d.status === this.statusOptions.deceased)
					.classed("immediate", d.status === this.statusOptions.immediate)
					.classed("delayed", d.status === this.statusOptions.delayed)
					.classed("minor", d.status === this.statusOptions.minor)
					.attr("style", "stroke: none");

				tagShape.attr("transform", () => {
					const tagBBox = tagShape.node().getBBox();
					return `translate(${-tagBBox.x - tagBBox.width / 2}, ${-tagBBox.y - tagBBox.height / 2})`;
				});

				// move tagText to the front
				tagText.node().parentNode.appendChild(tagText.node());

				tagShapes.push(tagShape.node());

				tagShape.remove();
			});

			allTagShapes.push({
				parent: d,
				shapes: tagShapes,
			});
		});

		allTagShapes.forEach((tagShapes) => {
			// sort tagShapes by width of the element
			const sortedShapes = tagShapes.shapes
			// .sort((a, b) => {
			// 	return a.getBBox().width - b.getBBox().width;
			// });
			// console.log(sortedShapes);

			const currentNode = shape
			.filter((d) => d.id === tagShapes.parent.id);

			const tagsGroup = currentNode
				.append("g")
				.classed("tags", true)

			for (let i = 0; i < sortedShapes.length; i++) {
				tagsGroup
					.append(() => {
						return sortedShapes[i];
					})
					.attr("transform", () => {
						const tagBBox = sortedShapes[i].getBBox();
						return `translate(${bbox.width / 2}, ${(bbox.height * 0.55) + ((tagBBox.height + 5) * i)})`;
					});
			}
		});
	}
}
