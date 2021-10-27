let container = d3.select("#list_data");

let incrementButton = d3.select("#list_increment");
let decrementButton = d3.select("#list_decrement");

// ========================================================
// ========================= LIST =========================
// ========================================================

// let list_data = [1, 2, 3, 4, 5];

// incrementButton.on("click", function () {
// 	list_data.push(list_data.length + 1);
// 	render();
// });

// decrementButton.on("click", function () {
// 	list_data.pop();
// 	render();
// });

// function render() {
// 	const dataPoint = container.selectAll("p").data(list_data);
// 	dataPoint
// 		.enter()
// 		.append("p")
// 		.text((d) => d);
// 	dataPoint.exit().remove();
// }

// render();

// =========================================================
// ========================= GRAPH =========================
// =========================================================

const svg = d3.select("svg");
const width = window.innerWidth;
const height = window.innerHeight;
svg.attr("width", width).attr("height", height);

let graph = {
	nodes: [],
	links: [],
};

const drag = d3.drag().on("start", dragstarted).on("drag", dragged).on("end", dragended);

const simulation = d3
	.forceSimulation(graph.nodes)
	.force(
		"link",
		d3.forceLink().id((d) => d.id)
	)
	.force("charge", d3.forceManyBody().strength(-100))
	.force("center", d3.forceCenter(width / 2, height / 2))
	.force("collide", d3.forceCollide(25))
	.on("tick", ticked);

const nodeGroup = svg.append("g").attr("id", "nodes");
const linkGroup = svg.append("g").attr("id", "links");
const graphElements = {
	nodes,
	links,
};

render();

function render() {
	const links = svg
		.append("g")
		.selectAll("g")
		.data(graph.links)

		.enter()
		.append("g")
		.call((d) => {
			graphElements.links = d;
		})
		.classed("link", true)
		.append("line")

		.exit()
		.remove();

	const nodes = svg
		.append("g")
		.selectAll("g")
		.data(graph.nodes)

		.enter()
		.append("g")
		.call((d) => {
			graphElements.nodes = d;
		})
		.classed("node", true)
		.append("circle")
		.attr("r", (d) => d.value)
		.call(drag)

		.exit()
		.remove();
}

function dragstarted(e, d) {
	simulation.alphaTarget(0.3).restart();
	d.fx = e.x;
	d.fy = e.y;
}

function dragged(e, d) {
	console.log(e);
	d.fx = e.x;
	d.fy = e.y;
}

function dragended(e, d) {
	simulation.alphaTarget(0);
	d.fx = null;
	d.fy = null;
}

fetch("./graph.json")
	.then((data) => data.json())
	.then((data) => (graph = data.graph))
	.then(render);
