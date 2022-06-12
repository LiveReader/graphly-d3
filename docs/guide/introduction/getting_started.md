---
title: Getting Started
lang: en-US
---

# Getting Started

Getting started with Graphly D3 is easy.

## Step 1: Create a new project

The first step is to create a new web project with the tooling you want to use.
You just need to install the npm package for `graphly-d3`.

```bash
npm install @livereader/graphly-d3
```

Your DOM has to contain a `<svg>` element that will be used to render the force-directed graph.

```html
<svg id="mySVG" width="100%" height="100%"></svg>
```

## Step 2: Embed Graphly D3

In your script you need to import the `ForceSimulation` class from `graphly-d3`.
Instantiate a new `ForceSimulation` and pass it the `<svg>` element you want to render the graph in.

You will also want to import the `style.css` file from the `graphly-d3` package.
This provides the necessary styles for the graph visualization.

```js
import { ForceSimulation } from "@livereader/graphly-d3";
import "@livereader/graphly-d3/style.css";

const mySVG = document.getElementById("mySVG");
const simulation = new ForceSimulation(mySVG);
```

## Step 3: Create a graph

Now create a graph object that contains the nodes and links following the [required format](../../data-structure/).
To render this graph you need to call the `render()` method of the `ForceSimulation` instance and pass the graph object as an argument.

```js
const graph = {
	nodes: [
		{
			id: "node1",
			shape: {
				type: "hexagon",
				scale: 1,
				url: "https://graphly-d3.livereader.com/templates/hexagon.js",
			},
			x: -150,
			y: 30,
		},
		{
			id: "node2",
			shape: {
				type: "hexagon",
				scale: 1,
				url: "https://graphly-d3.livereader.com/templates/hexagon.js",
			},
			x: 150,
			y: -30,
		},
	],
	links: [
		{
			source: "node1",
			target: "node2",
			directed: true,
			strength: "weak",
		},
	],
};

simulation.render(graph);
```

That's it! This should render a graph with two nodes and a link between them.

## Full Example

```html
<!-- index.html -->
<html>
	<head>
		<title>Graphly D3</title>
	</head>
	<body>
		<svg id="mySVG" width="100%" height="100%"></svg>
		<script src="./app.js" type="module"></script>
	</body>
</html>
```

```js
// app.js
import { ForceSimulation } from "@livereader/graphly-d3";
import "@livereader/graphly-d3/style.css";

const mySVG = document.getElementById("mySVG");
const simulation = new ForceSimulation(mySVG);

const graph = {
	nodes: [
		{
			id: "node1",
			shape: {
				type: "hexagon",
				scale: 1,
				url: "https://graphly-d3.livereader.com/templates/hexagon.js",
			},
			x: -150,
			y: 30,
		},
		{
			id: "node2",
			shape: {
				type: "hexagon",
				scale: 1,
				url: "https://graphly-d3.livereader.com/templates/hexagon.js",
			},
			x: 150,
			y: -30,
		},
	],
	links: [
		{
			source: "node1",
			target: "node2",
			directed: true,
			strength: "weak",
		},
	],
};

simulation.render(graph);
```

## Expected Result

After you are done with these simple steps, your result should look something like this:

<svg id="mySVG" style="width: 100%; height: 25em; border-radius: 1em; background-color: var(--vp-c-divider-light);"></svg>

::: info
Take a look at the [Tutorial](../tutorials/) to learn more about how to use Graphly D3 or dig deeper into the documentation on the [Data Structure](/data-structure/), [Simulation API](/simulation-api/) and [Template API](/template-api/).
:::

<script setup>
	import { onMounted } from "vue";
	import "@livereader/graphly-d3/style.css";

	const graph = {
		nodes: [
			{
				id: "node1",
				shape: {
					type: "hexagon",
					scale: 1,
				},
				x: -150,
				y: 30,
			},
			{
				id: "node2",
				shape: {
					type: "hexagon",
					scale: 1,
				},
				x: 150,
				y: -30,
			},
		],
		links: [
			{
				source: "node1",
				target: "node2",
				directed: true,
				strength: "weak",
			},
		],
	}

	onMounted(() => {
		import("@livereader/graphly-d3").then(({ ForceSimulation }) => {
			const mySVG = document.getElementById("mySVG");
			const simulation = new ForceSimulation(mySVG);
			simulation.linkDistance = 250;
			simulation.envGravity = -5000;
			simulation.templateStore.remoteOrigin = window.location.protocol + "//" + window.location.host + "/templates/";
			simulation.render(graph);
		});
	})
</script>
