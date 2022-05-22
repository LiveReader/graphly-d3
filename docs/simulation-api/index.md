---
title: Simulation API
lang: en-US
---

# Introduction

The `ForceSimulation` class is the main entry point for Graphly D3.
It provides the d3 force simulation as well as an enhanced API to interact with the graph.

More detailed information can be found on the next pages.

## Setup

To use the force simulation within a project you need to import the `ForceSimulation` class.
It creates the directed-force graph and requires a d3 selection of the svg element as initial parameter.

The `ForceSimulation` needs to know where to load the templates from.
This can be specified with the `.setTemplateOrigin()` method. (Here we choose a local folder that gets exposed, but you can also use a remote url.)

To display the data as a graph the `.render()` method is used.
It takes the data as input and renders the proper nodes and links.

```js
import * as d3 from "d3";
import { ForceSimulation } from "@livereader/graphly-d3";

const graph = {
	nodes: [],
	links: [],
};
const svg = d3.select("svg");

const simulation = new ForceSimulation(svg);
simulation.setTemplateOrigin("http://" + document.location.host + "/templates/");
simulation.render(graph);
```
