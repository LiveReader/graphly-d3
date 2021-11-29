const svg = d3.select("svg");
const graph = {
	nodes: [
		{
			id: "n0",
		},
		{
			id: "n1",
		},
		{
			id: "n2",
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

const simulation = new ForceSimulation(svg, graph);

function resize() {
	const width = window.innerWidth;
	const height = window.innerHeight;
	svg.attr("width", width).attr("height", height);
}

window.onload = resize;
window.onresize = resize;
