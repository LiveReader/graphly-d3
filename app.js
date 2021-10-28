let container = d3.select("#list_data");

const svg = d3.select("svg");
let width = window.innerWidth;
let height = window.innerHeight;

let graph = {
	nodes: [],
	links: [],
};

const drag = d3.drag().on("start", dragstarted).on("drag", dragged).on("end", dragended);
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

const simulation = d3
	.forceSimulation()
	.force(
		"link",
		d3.forceLink().id((d) => d.id)
	)
	.force("change", d3.forceManyBody().strength(-5000))
	.force("center", d3.forceCenter(width / 2, height / 2))
	.force("collide", d3.forceCollide(80))
	.on("tick", ticked);

const linkGroup = svg.append("g").attr("id", "links");
const nodeGroup = svg.append("g").attr("id", "nodes");
const graphElements = {
	nodes: null,
	links: null,
};

render();

function ticked() {
	// console.log(graphElements);
	if (!graphElements.links || !graphElements.nodes) return;

	graphElements.links
		.select("line")
		.attr("x1", (d) => {
			return d.source.x;
		})
		.attr("y1", (d) => d.source.y)
		.attr("x2", (d) => d.target.x)
		.attr("y2", (d) => d.target.y);

	graphElements.nodes.attr("transform", (d) => {
		return `translate(${d.x}, ${d.y})`;
	});
}

function render() {
	simulation.nodes(graph.nodes);
	simulation.force("link").links(graph.links);
	simulation.alpha(0.5).restart();

	nodeGroup.selectAll("*").remove();
	linkGroup.selectAll("*").remove();

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
		.classed("node", true);

	nodes.append("circle").attr("r", (d) => d.value);
	nodes
		.append("text")
		.attr("text-anchor", "middle")
		.attr("dy", "0.35em")
		.text((d) => d.label);

	nodes.exit().remove();
}

function loadData() {
	fetch("./graph.json")
		.then((data) => data.json())
		.then((data) => (graph = data.graph))
		.then(render)
		.then(() => {
			setTimeout(() => {
				graph.nodes.push({
					id: graph.nodes.length,
					value: 50,
					label: "FUCK YOU",
				});
				graph.links.push({
					source: 0,
					target: graph.nodes.length - 1,
				});
				render();
			}, 1000);
		});
}

function resize() {
	width = window.innerWidth;
	height = window.innerHeight;
	svg.attr("width", width).attr("height", height);
	simulation.force("center", d3.forceCenter(width / 2, height / 2));
	simulation.alpha(0.1).restart();
}

window.onload = () => {
	resize();
	loadData();
};
window.onresize = resize;
