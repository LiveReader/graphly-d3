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
	.forceSimulation()
	.force(
		"link",
		d3.forceLink().id((d) => d.id)
	)
	.force("change", d3.forceManyBody().strength(-100))
	.force("center", d3.forceCenter(width / 2, height / 2))
	.force("collide", d3.forceCollide(25))
	.on("tick", ticked);

const nodeGroup = svg.append("g").attr("id", "nodes");
const linkGroup = svg.append("g").attr("id", "links");
const graphElements = {
	nodes: null,
	links: null,
};

render();

function ticked() {
	// console.log(graphElements);
	if (!graphElements.links || !graphElements.nodes) return;

	graphElements.links
		// .select("line")
		.attr("x1", (d) => {
			return d.from.x;
		})
		.attr("y1", (d) => d.from.y)
		.attr("x2", (d) => d.to.x)
		.attr("y2", (d) => d.to.y);

	graphElements.nodes.attr("transform", (d) => {
		return `translate(${d.x}, ${d.y})`;
	});
}

function render() {
	simulation.nodes(graph.nodes);
	// simulation.force("link").links(graph.links);
	simulation.alpha(1).restart();

	const links = linkGroup
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

	const nodes = nodeGroup
		.selectAll("g")
		.data(graph.nodes)

		.enter()
		.append("g")
		.call(drag)
		.call((d) => {
			graphElements.nodes = d;
		})
		.classed("node", true)
		.append("circle")
		.attr("r", (d) => d.value)

		.exit()
		.remove();
}

function dragstarted(e, d) {
	simulation.alphaTarget(0.3).restart();
	d.fx = e.x;
	d.fy = e.y;
}
function dragged(e, d) {
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
	.then(render)
	.then(() => {
		// setTimeout(() => {
		// 	graph.nodes.push({
		// 		id: graph.nodes.length,
		// 		value: 50,
		// 		label: "FUCK YOU",
		// 	});
		// 	render();
		// }, 100);
	});
