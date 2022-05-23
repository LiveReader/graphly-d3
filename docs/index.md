---
title: Introduction
lang: en-US
---

<img src="/assets/img/graphly-d3-icon-dark.svg" style="border-radius: 50%; width: 50%; margin: 2em; margin-left: 25%;">
<h1 style="text-align: center;">Graphly D3</h1>
<h2 style="text-align: center;">a graph visualization library</h2>

# Introduction

::: warning
Please keep in mind that this library is still in development and API changes may occur.
There are also a few minor features still to come.

Version 1.0 target release data: **20th of June 2022**
:::

Graphly D3 is an [open source](https://github.com/livereader/graphly-d3) frontend library for creating conplex and interactive graph visualizations.
It is built on top of [D3.js](https://d3js.org/) and empowers developers to use svg to display any data in a simple and intuitive way.

This is accomplished by providing a shape template system that allows to develop any required node visualization and simply using it by refering to it in the input graph data.

The graph visualization itself is implemented as a force-directed graph.
Each `node` object in the input data contains a `shape` property with a `type` to determine which shape template to use to display the node data.
Every part of the graph is rendered as svg element, which allows to create complex shapes while keeping perfect quality and minimal file size.

Templates can be delivered from any (possibly distributed) source and are imported on demand.
This combines the possibility for as many different shape types as needed while keeping the load time as low as possible.

<Graphly :graph="graph" style="height: 25em; border-radius: 1em; background-color: var(--c-divider-light);"/>

## Getting Started

To use Graphly D3 in your project, you need to install the package.

```bash
npm install @livereader/graphly-d3
```

To use the `ForceSimulation` your DOM needs to have a `<svg>` element you can pass as `d3 selection` to the constructor.

The `ForceSimulation` needs to know where to load the templates from. This can be specified with the `setTemplateOrigin()` method.
(Here we choose a local folder, but you can also use a remote url.)

To render a graph you need to pass a `graph` object to the `render()` method.

::: details HTML

```html
<!-- index.html -->
<html>
	<head></head>
	<body>
		<svg id="mySVG"></svg>
		<style>
			#mySVG {
				width: 100%;
				height: 100%;
			}
		</style>
		<script src="./app.js"></script>
	</body>
</html>
```

:::

::: details JavaScript

```js
// app.js
import { ForceSimulation } from "@livereader/graphly-d3";
import * as d3 from "d3";

const svg = d3.select("#mySVG");
const simulation = new ForceSimulation(svg);
simulation.setTemplateOrigin("http://" + document.location.host + "/templates/");

const graph = {
	nodes: [
		{
			id: "node1",
			shape: {
				type: "myShape",
				scale: 1,
			},
		},
	],
	links: [],
};
simulation.render(graph);
```

:::

This setup should be enough to get you started and embed Graphly D3 into your project.

::: info
Without any templates this example should display a simple red circle in the center of the `svg` element.

Take a look at the [Tutorial](/tutorial/) to learn more about how to use Graphly D3 or dig deeper into the documentation on the [Simulation API](/simulation-api/) and [Template API](/template-api/).
:::

<script setup>
import { ref, onMounted } from "vue";
import Graphly from "./components/Graphly.vue";
let graph = ref({
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
	hasUpdate: false,
});
onMounted(() => {
	graph.value.hasUpdate = true;
})
</script>
