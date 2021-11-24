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

const drag = d3.drag().on("start", dragstarted).on("drag", dragged).on("end", dragended);
function dragstarted(e, d) {
	simulation.alphaTarget(0.1).restart();
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

const simulation = d3.forceSimulation();
simulation
	.force(
		"link",
		d3.forceLink().id((d) => d.id)
	)
	.force("gravity", d3.forceManyBody().strength(-10000))
	.force("center", d3.forceCenter(window.innerWidth / 2, window.innerHeight / 2))
	.force(
		"collide",
		d3.forceCollide().radius((d) => d.r)
	)
	.on("tick", ticked);

simulation.nodes(graph.nodes);
simulation.force("link").links(graph.links);
simulation.alpha(1).restart();

const world = svg.append("g").attr("id", "world");
const linkGroup = world.append("g").attr("id", "links");
const nodeGroup = world.append("g").attr("id", "nodes");

// zooming behavior
svg.call(
	d3
		.zoom()
		.extent([
			[-100, -100],
			[window.innerWidth + 100, window.innerHeight + 100],
		])
		.scaleExtent([0.1, 5])
		.on("zoom", ({ transform }) => {
			world.attr("transform", transform);
		})
);

nodeGroup
	.selectAll("circle")
	.data(graph.nodes)
	.enter()
	.append("circle")
	.attr("r", (d) => d.r)
	.classed("node", true)
	.call(drag);

linkGroup.selectAll("line").data(graph.links).enter().append("line").classed("link", true);

function ticked() {
	nodeGroup
		.selectAll("circle")
		.attr("cx", (d) => d.x)
		.attr("cy", (d) => d.y);

	linkGroup
		.selectAll("line")
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
