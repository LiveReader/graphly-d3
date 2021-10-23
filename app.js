let container = d3.select("#list_data");

let incrementButton = d3.select("#list_increment");
let decrementButton = d3.select("#list_decrement");

let list_data = [1, 2, 3, 4, 5];

incrementButton.on("click", function () {
	list_data.push(list_data.length + 1);
	render();
});

decrementButton.on("click", function () {
	list_data.pop();
	render();
});

function render() {
	const dataPoint = container.selectAll("p").data(list_data);
	dataPoint
		.enter()
		.append("p")
		.text((d) => d);
	dataPoint.exit().remove();
}

render();
