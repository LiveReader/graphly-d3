const svg = d3.select("svg");
const graph = {
	nodes: [
		{
			id: "n0",
			shape: {
				type: PersonHexagonFactory,
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
				type: PersonHexagonFactory,
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
				type: PersonHexagonFactory,
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
		{
			id: "n3",
			shape: {
				type: VehicleHexagonFactory,
				scale: 0.5,
			},
			status: "4",
			label: "RTW",
		},
		{
			id: "n4",
			shape: {
				type: VehicleHexagonFactory,
				scale: 0.5,
			},
			status: "3",
			label: "RTW",
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
		{
			source: "n2",
			target: "n3",
		},
		{
			source: "n2",
			target: "n4",
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
