class PersonHexagonFactory {
	constructor(data, size = 100) {
		this.data = data;
		this.size = size;

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
				const tagShape = shape.append("g").classed("hexagon-person", true).classed("tag", true);

				const tagText = tagShape
					.append("text")
					.classed("hexagon-person", true)
					.classed("tag", true)
					.text(tag)
					.attr("dy", "0.65em");

				const tagBackground = tagShape
					.append("rect")
					.attr("rx", 45)
					.attr("ry", 45)
					.attr("height", 90)
					.attr("width", () => {
						const textBBox = tagText.node().getBBox();
						return textBBox.width + margin;
					})
					.attr("x", () => {
						const textBBox = tagText.node().getBBox();
						return -textBBox.width / 2 - margin / 2;
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

				// tagShape.attr("transform", `translate(${50}, ${0})`);

				// move tagText to the front
				tagText.node().parentNode.appendChild(tagText.node());

				tagShapes.push(tagShape);

				tagShape.remove();
			});

			allTagShapes.push({
				parent: d,
				shapes: tagShapes,
			});
		});

		allTagShapes.forEach((tagShapes) => {
			// sort tagShapes by width of the element
			const sortedShapes = tagShapes.shapes;
			// .sort((a, b) => {
			// 	return a.getBBox().width - b.getBBox().width;
			// });
			// console.log(sortedShapes);

			const currentNode = shape.filter((d) => d.id === tagShapes.parent.id);

			const spacing = 20;
			const groups = this.buildTagGroups(currentNode, spacing);
			console.log(groups);
			const tagGroups = [[]];

			for (let i = 0; i < sortedShapes.length; i++) {
				const shape = sortedShapes[i];
				const line = groups[tagGroups.length - 1];
				if (line == undefined) {
					continue;
				}

				currentNode.node().appendChild(shape.node());

				const group = tagGroups[tagGroups.length - 1];
				const maxWidth = line.width;
				const tagWidth = shape.node().getBBox().width;

				let sumWidth = 0;
				group.forEach((tag) => {
					sumWidth += tag.node().getBBox().width + spacing;
				});

				if (sumWidth + tagWidth > maxWidth) {
					console.log(sumWidth, maxWidth);
					tagGroups.push([shape]);
				} else {
					tagGroups[tagGroups.length - 1].push(shape);
				}
			}

			// append shapes to proper group and position
			for (let i = 0; i < tagGroups.length; i++) {
				const group = tagGroups[i];
				if (groups[i] == undefined) {
					group.forEach((shape) => {
						shape.remove();
					});
					return;
				}
				let lineWidth = groups[i].width;
				let groupWidth = 0;
				group.forEach((tag) => {
					groupWidth += tag.node().getBBox().width;
				});
				let offset = (lineWidth - groupWidth) / 2;

				let sumWidth = 0;
				for (let j = 0; j < group.length; j++) {
					const tagShape = group[j];
					groups[i].parent.node().appendChild(tagShape.node());
					let position = sumWidth + (tagShape.node().getBBox().width / 2) - spacing / 2;
					tagShape.attr("transform", `translate(${position + offset}, ${0})`);

					sumWidth += tagShape.node().getBBox().width + spacing;
				}
			}
		});
	}

	buildTagGroups(shape, lineSpacing) {
		const bbox = shape.node().getBBox();
		const line_height = 90;
		const line_margins = [60, 110, 160];

		const tagGroups = [];

		const groups = shape
			.append("g")
			.classed("tag-groups", true)
			.attr("transform", `translate(${0}, ${bbox.height * 0.6})`);

		for (let i = 0; i < line_margins.length; i++) {
			groups
				.append("g")
				.classed("tag-group", true)
				.attr("transform", `translate(${line_margins[i]}, ${(line_height + lineSpacing) * i})`)
				.call((d) => {
					tagGroups.push({
						parent: d,
						width: bbox.width - line_margins[i] * 2,
					});
				});
		}

		return tagGroups;
	}
}
