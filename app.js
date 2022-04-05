import { ForceSimulation } from "./lib/main.js";
import * as d3 from "d3";

const svg = d3.select("svg");
resize();
let graph = {
	nodes: [],
	links: [],
};

const simulation = new ForceSimulation(svg);
// simulation.setWorldBoundaries(window.innerHeight, window.innerWidth);
simulation.setTemplateOrigin("http://" + document.location.host + "/templates/");

simulation.onClick((e, d) => {
	if (e.altKey) {
		// remove the node
		graph.nodes = graph.nodes.filter((node) => node.id != d.id);
		graph.links = graph.links.filter((link) => link.source.id != d.id && link.target.id != d.id);
	} else {
		// select node
		graph.nodes.forEach((node) => {
			node.selected = node.id == d.id;
		});
	}
	simulation.render(graph);
});

simulation.onEdgeClick((e, d) => {
	graph.links = graph.links.filter((l) => l !== d);
	simulation.render(graph);
});

simulation.onContextClick((e, d) => {
	if (e.altKey) {
		// toggle shape scale
		d.shape.scale = d.shape.scale == 1 ? 0.5 : 1;
	} else {
		// toggle disabled
		d.disabled = !d.disabled;
	}
	simulation.render(graph);
});

simulation.onBackground((e, pos) => {
	graph.nodes.forEach((node) => {
		node.selected = false;
	});
	if (e.altKey) {
		// add new node
		graph.nodes.push({
			id: `n${graph.nodes.length}`,
			shape: {
				type: "demo_template",
				scale: 1,
			},
			payload: {
				status: "",
				name: {
					first: "",
					last: "",
				},
				sex: "",
				age: "",
				accessibility: "",
				tags: [],
			},
			x: pos.x,
			y: pos.y,
		});
	}
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

simulation.onDragEnd((e, d, pos) => {
	// change satellite angle
	if (d.satellite) {
		const position = { x: d.x, y: d.y };
		const sourcePos = { x: d.satellite.source.x, y: d.satellite.source.y };
		const angle = Math.atan2(position.y - sourcePos.y, position.x - sourcePos.x);
		const degrees = angle * (180 / Math.PI) + 90;
		d.satellite.angle = degrees;
	}

	// set anchor
	if (!d.anchor) d.anchor = {};
	d.anchor.type = "soft";
	d.anchor.x = pos.x;
	d.anchor.y = pos.y;
	simulation.render(graph);
});

simulation.onMove((t) => {
	console.log(t);
});

simulation.setZoomBoundaries(0.1, 3);

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
