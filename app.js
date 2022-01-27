import { ForceSimulation } from "./lib/main.js";

const svg = d3.select("svg");
resize();
let graph = {
	nodes: [],
	links: [],
};

const simulation = new ForceSimulation(svg);
simulation.render(graph);

simulation.onClick((e, d) => {
	graph.nodes.forEach((node) => {
		node.selected = node.id == d.id;
	});
	simulation.render(graph);
});

simulation.onContextClick((e, d) => {
	console.log("context", d.id);
});

simulation.onBackground((e, d) => {
	graph.nodes.forEach((node) => {
		node.selected = false;
	});
	simulation.render(graph);
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

fetch("./demo-data.json")
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
