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
// app.js
import { ForceSimulation } from "@livereader/graphly-d3";
import "@livereader/graphly-d3/style.css";

const mySVG = document.getElementById("mySVG");
const simulation = new ForceSimulation(mySVG);
```

## Step 3: Create a template

Now create a new file containing your template code and add it to the `ForceSimulation` `templateStore`.

```js
// app.js
import Hexagon from "./hexagon";

simulation.templateStore.add("hexagon", Hexagon);
```

```js
// hexagon.js
export default {
	shapeSize: 120,
	shapeBuilder: shapeBuilder,
};

function shapeBuilder(data, TemplateAPI) {
	const { ShapeStyle, SVGShape, TextCollection, CollectionStyle } = TemplateAPI;

	const shape = SVGShape(`
		<g transform="matrix(1,0,0,1,-101.915,-40.1924)">
			<g transform="matrix(8.33117e-17,-1.36058,1.36058,8.33117e-17,9.05891,870.52)">
				<path id="path" d="M384.617,88.155C406.11,75.826 432.531,75.826 454.023,88.155C488.394,107.873 540.748,137.906 575.236,157.69C596.908,170.123 610.273,193.199 610.273,218.184L610.273,356.483C610.273,381.468 596.908,404.544 575.236,416.977C540.748,436.761 488.394,466.794 454.023,486.512C432.531,498.841 406.11,498.841 384.617,486.512C350.246,466.794 297.892,436.761 263.405,416.977C241.733,404.544 228.367,381.468 228.367,356.483L228.367,218.184C228.367,193.199 241.733,170.123 263.405,157.69C297.892,137.906 350.246,107.873 384.617,88.155Z" />
			</g>
		</g>
	`);
	shape.select("path").style("fill", data.payload?.color ?? "#9575cd");

	const titleShape = TextCollection(data.payload?.title ?? "", CollectionStyle(200, 240, 30, 100, 10, 10, 2), [
		ShapeStyle("class", "gly_text.light"),
		ShapeStyle("font-size", "5em"),
	]);
	shape.append(() => titleShape.node());

	return shape;
}
```

## Step 4: Create a graph

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
import Hexagon from "./hexagon";

const mySVG = document.getElementById("mySVG");
const simulation = new ForceSimulation(mySVG);
simulation.templateStore.add("hexagon", Hexagon);

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
};

simulation.render(graph);
```

```js
// hexagon.js
export default {
	shapeSize: 120,
	shapeBuilder: shapeBuilder,
};

function shapeBuilder(data, TemplateAPI) {
	const { ShapeStyle, SVGShape, TextCollection, CollectionStyle } = TemplateAPI;

	const shape = SVGShape(`
		<g transform="matrix(1,0,0,1,-101.915,-40.1924)">
			<g transform="matrix(8.33117e-17,-1.36058,1.36058,8.33117e-17,9.05891,870.52)">
				<path id="path" d="M384.617,88.155C406.11,75.826 432.531,75.826 454.023,88.155C488.394,107.873 540.748,137.906 575.236,157.69C596.908,170.123 610.273,193.199 610.273,218.184L610.273,356.483C610.273,381.468 596.908,404.544 575.236,416.977C540.748,436.761 488.394,466.794 454.023,486.512C432.531,498.841 406.11,498.841 384.617,486.512C350.246,466.794 297.892,436.761 263.405,416.977C241.733,404.544 228.367,381.468 228.367,356.483L228.367,218.184C228.367,193.199 241.733,170.123 263.405,157.69C297.892,137.906 350.246,107.873 384.617,88.155Z" />
			</g>
		</g>
	`);
	shape.select("path").style("fill", data.payload?.color ?? "#9575cd");

	const titleShape = TextCollection(data.payload?.title ?? "", CollectionStyle(200, 240, 30, 100, 10, 10, 2), [
		ShapeStyle("class", "gly_text.light"),
		ShapeStyle("font-size", "5em"),
	]);
	shape.append(() => titleShape.node());

	return shape;
}
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
			mySVG.innerHTML = "";
			const simulation = new ForceSimulation(mySVG);
			simulation.linkDistance = 250;
			simulation.envGravity = -5000;
			simulation.templateStore.remoteOrigin = window.location.protocol + "//" + window.location.host + "/templates/";
			simulation.render(graph);
		});
	})
</script>
