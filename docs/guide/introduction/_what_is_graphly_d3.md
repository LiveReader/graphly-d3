---
title: What is Graphly D3
lang: en-US
---

# What is Graphly D3

Graphly D3 is an [open source](https://github.com/livereader/graphly-d3) frontend library to create outstanding graph visualizations with ease.
It is built on top of [D3.js](https://d3js.org/) and empowers developers to use svg to display any data in a simple and intuitive way.

This is accomplished by providing a shape template system that allows to develop any required node visualization and simply using it in a data-driven manner.

## Motivation

The development of Graphly D3 was motivated by the need to visualize rather complex knowledge graphs.
This required the ability to visualize nodes in a way that was easy to understand and interact with.
The solution was to develop a shape template system that would allow developers to create and use any node visualization by simply pointing to it in a node's data.

During the development of the project, we decided to release Graphly D3 as open source and put it under the [GPLv3 license](https://github.com/LiveReader/graphly-d3/blob/main/LICENSE).
Now it can be easily installed in your project via npm, providing you with a simple yet powerful way to visualize your graph data.

<Graphly :graph="graph" style="height: 25em; border-radius: 1em; background-color: var(--vp-c-divider-light);"/>

## Features

The graph visualization itself is implemented as a force-directed graph.
Each `node` object in the input data contains a `shape` property with a `type` to determine which shape template to use to display the node data.
Every part of the graph is rendered as svg element, which allows to create complex shapes while keeping perfect quality and minimal file size.

Templates can be delivered from any (possibly distributed) source and are imported on demand.
This combines the possibility for as many different shape types as needed while keeping the load time as low as possible.

<script setup>
import { ref, onMounted } from "vue";
import Graphly from "../../.vitepress/components/Graphly.vue";
let graph = ref({
	nodes: [
		{
			id: "node1",
			shape: {
				type: "hexagon",
				scale: 1,
				url: "https://cdn.graphly.dev/@jason-rietzke/demo-hexagon/latest",
			},
			x: -150,
			y: 30,
			payload: {
				title: "",
				color: "#9575cd"
			}
		},
		{
			id: "node2",
			shape: {
				type: "hexagon",
				scale: 1,
				url: "https://cdn.graphly.dev/@jason-rietzke/demo-hexagon/latest",
			},
			x: 150,
			y: -30,
			payload: {
				title: "",
				color: "#9575cd"
			}
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
