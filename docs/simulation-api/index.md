---
title: Simulation API
lang: en-US
---

# Introduction

The `ForceSimulation` class is the heart of the force-directed graph simulation.
It is responsible for rendering and updated the visualization of nodes and links.
To achieve this, it uses d3's force-simulation under the hood and appends further features and an enhanced API.

More detailed infromation about the specific features are available on the following pages.

## Setup

To use the force simulation within a project you need to import the `ForceSimulation` class from `graphly-d3`.
Instantiate a new `ForceSimulation` and pass it the `<svg>` DOM element you want to render the graph in.

You will also want to import the `style.css` from the `graphly-d3` package.
This provides the necessary styles for the graph visualization.

To render a graph you need to call the `render()` method of the `ForceSimulation` instance and pass the graph object as an argument.
The graph needs to meed the [required format](/data-structure/) with nodes and links.

```js
import { ForceSimulation } from "@livereader/graphly-d3";
import "@livereader/graphly-d3/style.css";

const graph = {
	nodes: [...],
	links: [...],
};

const svg = document.getElementById("mySVG");
const simulation = new ForceSimulation(svg);

simulation.render(graph);
```
