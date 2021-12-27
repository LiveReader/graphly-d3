const svg = d3.select("svg");
const graph = {
	nodes: [
		{
			id: "n0",
			shape: {
				type: 1,
				scale: 0.5,
			},
			status: "minor",
			name: {
				first: "Luisa",
				last: "Schmidt",
			},
			tags: ["unter Schock", "unverletzt", "Puls normal"],
			countdown: 60.5,
		},
		{
			id: "n1",
			shape: {
				type: 1,
				scale: 1,
			},
			status: "delayed",
			name: {
				first: "Jason",
				last: "Rietzke",
			},
			tags: ["Knochenbruch: Arm", "atmend", "Schnittwunde: Fuß"],
			countdown: 100,
		},
		{
			id: "n2",
			shape: {
				type: 1,
				scale: 1,
			},
			status: "immediate",
			name: {
				first: "Eric",
				last: "Rietzke",
			},
			tags: ["bewusstlos", "Diabetes", "atmend", "Puls schwach", "Verletzung: Kopf"],
			countdown: 2,
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
