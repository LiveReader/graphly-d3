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

simulation.onContextClick((e, d) => {
	console.log("context", d.id);
});

simulation.onBackground((e, d) => {
	console.log("background");
});

simulation.onNewEdge((source, target) => {
	const link = {
		source: source.id,
		target: target.id,
		type: "solid",
		directed: true,
		label: "",
	};
	graph.links.push(link);
	simulation.render(graph);
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
