function TestShape(data) {
	const update = typeof d3.select(this).node().getAttribute === "function";
	const shape = update ? d3.select(this) : d3.select(document.createElementNS("http://www.w3.org/2000/svg", "g"));

	if (update && !hasDataChanges(data, JSON.parse(shape.attr("data-dataset")))) return shape.node();
	if (update) shape.selectAll("*").remove();

	shape
		.classed("node", true)
		.attr("id", () => data.id)
		.attr("data-dataset", () => JSON.stringify(data));
	const rndColor = d3.interpolateRainbow(Math.random());
	shape.append(() => CircleShape(data.shape.scale * 100, rndColor));
	shape.append(() => TitleShape(data.label ?? data.id, "#f8f8ff"));

	return shape.node();

	function hasDataChanges(a, b) {
		if (!a || !b) return false;
		const keys = Object.keys(a);
		let change = undefined;
		keys.forEach((key) => {
			if (key != "x" && key != "y" && key != "vx" && key != "vy") {
				if (typeof a[key] === "object") {
					if (hasDataChanges(a[key], b[key])) {
						change = key;
					}
				} else if (Array.isArray(a[key])) {
					a[key].forEach((item, index) => {
						if (hasDataChanges(item, b[key][index])) {
							change = key;
						}
					});
				} else if (a[key] !== b[key]) {
					change = key;
				}
			}
		});
		return change;
	}
}

function CircleShape(radius, color) {
	const shape = d3.select(document.createElementNS("http://www.w3.org/2000/svg", "g"));
	shape.append("circle").attr("r", radius).attr("fill", color);
	return shape.node();
}

function TitleShape(title, color) {
	const shape = d3.select(document.createElementNS("http://www.w3.org/2000/svg", "g"));
	shape
		.append("text")
		.attr("x", 0)
		.attr("y", 0)
		.attr("dy", "0.35em")
		.attr("text-anchor", "middle")
		.attr("stroke", color)
		.text(title);
	return shape.node();
}
