import { ForceSimulation, Event } from "../lib/main";

const svg = document.getElementsByTagName("svg")[0];
const themeButton = document.getElementById("theme-button");

const transformX = document.getElementById("transform-x");
const transformY = document.getElementById("transform-y");
const transformK = document.getElementById("transform-k");
const transformBtn = document.getElementById("transform-btn");

const boundsX = document.getElementById("bounds-x");
const boundsY = document.getElementById("bounds-y");
const boundsWidth = document.getElementById("bounds-width");
const boundsHeight = document.getElementById("bounds-height");
const boundsBtn = document.getElementById("bounds-btn");

const showNodesBtn = document.getElementById("show-nodes-btn");
const includeNodesBtn = document.getElementById("include-nodes-btn");

resize();
let graph = {
	nodes: [],
	links: [],
};

const simulation = new ForceSimulation(svg);
simulation.templateStore.remoteOrigin = "http://" + document.location.host + "/demo/templates/";

simulation.on("template:demo_template:age-click", (data, event, age) => {
	console.log(age);
	event.stopPropagation();
});
simulation.on(Event.EnvironmentClick, (e) => {
	simulation.selectedNodes = [];
});
simulation.on(Event.NodeClick, (e, d) => {
	simulation.selectedNodes = [d.id];
});
simulation.on(Event.NodeDragStart, (e, d, pos) => {
	// create a new link when holding the alt key down
	if (e.sourceEvent.altKey) return "newlink";
});
simulation.on(Event.LinkDragEnd, (e, source, target, pos) => {
	if (target) {
		const link = {
			source: source.id,
			target: target.id,
		};
		graph.links.push(link);
		simulation.render(graph);
	}
});

let theme = "light";
themeButton.onclick = toggleTheme;
function toggleTheme() {
	if (theme === "light") {
		theme = "dark";
	} else {
		theme = "light";
	}
	svg.classList.toggle("dark");
	simulation.render(graph);
}

transformBtn.onclick = () => {
	const x = parseFloat(transformX.value);
	const y = parseFloat(transformY.value);
	const k = parseFloat(transformK.value);
	simulation.moveTo({
		transform: { x, y, k },
	});
};
boundsBtn.onclick = () => {
	const x = parseFloat(boundsX.value);
	const y = parseFloat(boundsY.value);
	const w = parseFloat(boundsWidth.value);
	const h = parseFloat(boundsHeight.value);
	simulation.moveTo({
		boundaries: [{ x, y, width: w, height: h }],
	});
};
showNodesBtn.onclick = () => {
	simulation.moveTo({
		nodes: graph.nodes,
	});
};
includeNodesBtn.onclick = () => {
	simulation.moveTo({
		boundaries: [simulation.worldBounds],
		nodes: graph.nodes,
	});
};

fetch("./demo-data.json")
	.then((response) => response.json())
	.then((data) => {
		graph = data.graph;
		simulation.render(graph);
	});

function resize() {
	const width = window.innerWidth;
	const height = window.innerHeight;
	svg.setAttribute("width", width.toString());
	svg.setAttribute("height", height.toString());
}

window.onresize = resize;
