const svg = d3.select("svg");
resize();
let graph = {
	nodes: [],
	links: [],
};

const simulation = new ForceSimulation(svg);
simulation.render(graph);

simulation.onClick((e, d) => {
	console.log(d);
});
simulation.onMouseOver((e, d) => {
	console.log(`over ${d.id}`);
});
simulation.onMouseOut((e, d) => {
	console.log(`left ${d.id}`);
});

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

window.onresize = resize;
