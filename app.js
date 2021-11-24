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

const simulation = new ForceSimulation(svg, graph);

function resize() {
	const width = window.innerWidth;
	const height = window.innerHeight;
	svg.attr("width", width).attr("height", height);
}

window.onload = resize;
window.onresize = resize;
