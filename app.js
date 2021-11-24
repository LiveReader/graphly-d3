const svg = d3.select("svg");

const graph = {
	nodes: [
		{
			id: "n0",
			r: 50,
		},
		{
			id: "n1",
			r: 70,
		},
		{
			id: "n2",
			r: 30,
		},
	],
	links: [
		{
			source: "n0",
			target: "n1",
		},
		{
			source: "n1",
			target: "n2",
		},
	],
};

const simulation = d3
	.forceSimulation()
	.force(
		"link",
		d3.forceLink().id((d) => d.id)
	)
	.force("change", d3.forceManyBody().strength(-10000))
	.force("center", d3.forceCenter(window.innerWidth / 2, window.innerHeight / 2))
	.force(
		"collide",
		d3.forceCollide(50).radius((d) => d.r)
	)
	.on("tick", ticked);

simulation.nodes(graph.nodes);
simulation.force("link").links(graph.links);
simulation.alpha(1).restart();

const link = svg.append("g").attr("id", "links");
const node = svg.append("g").attr("id", "nodes");

node.selectAll("circle")
	.data(graph.nodes)
	.enter()
	.append("circle")
	.attr("r", (d) => d.r)
	.classed("node", true);

link.selectAll("line").data(graph.links).enter().append("line").classed("link", true);

function ticked() {
	node.selectAll("circle")
		.attr("cx", (d) => d.x)
		.attr("cy", (d) => d.y);

	link.selectAll("line")
		.attr("x1", (d) => d.source.x)
		.attr("y1", (d) => d.source.y)
		.attr("x2", (d) => d.target.x)
		.attr("y2", (d) => d.target.y);
}

function resize() {
	const width = window.innerWidth;
	const height = window.innerHeight;
	svg.attr("width", width).attr("height", height);
}

window.onload = resize;
window.onresize = resize;
