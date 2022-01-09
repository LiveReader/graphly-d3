const svg = d3.select("svg");
let graph = {
	nodes: [],
	links: [],
};

const simulation = new ForceSimulation(svg);
simulation.render(graph);

fetch("/graph.json")
	.then((response) => response.json())
	.then((data) => {
		graph = data.graph;
		simulation.render(graph);
	});

function resize() {
	const width = window.innerWidth;
	const height = window.innerHeight;
	svg.attr("width", width).attr("height", height);
}

window.onload = resize;
window.onresize = resize;
