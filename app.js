import ForceSimulation from "./lib/main.js";

const svg = d3.select("svg");
resize();
let graph = {
	nodes: [],
	links: [],
};

const simulation = new ForceSimulation(svg);
simulation.setWorldBoundaries(window.innerHeight * 2, window.innerWidth * 2);
simulation.setTemplateOrigin("http://" + document.location.host + "/templates/");

simulation.onClick((e, d) => {
	graph.nodes.forEach((node) => {
		node.selected = node.id == d.id;
	});
	simulation.render(graph);
});

simulation.onContextClick((e, d) => {
	// remove the node
	graph.nodes = graph.nodes.filter((node) => node.id != d.id);
	graph.links = graph.links.filter((link) => link.source.id != d.id && link.target.id != d.id);
	simulation.render(graph);
});

simulation.onBackground((e, pos) => {
	graph.nodes.forEach((node) => {
		node.selected = false;
	});
	// add new node
	graph.nodes.push({
		id: `n${graph.nodes.length}`,
		shape: {
			type: "shape_01",
			scale: 1,
		},
		status: "minor",
		name: {
			first: "Joe",
			last: "Doe",
		},
		tags: ["tag1", "tag2", "tag3", "tag4", "tag5", "tag6", "tag7", "tag8", "tag9", "tag10"],
		x: pos.x,
		y: pos.y,
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
