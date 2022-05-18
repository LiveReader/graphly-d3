---
title: Data Structure
lang: en-US
---

# Introduction

Graphly D3 uses the Force Simulation of d3 and builds on top of it to make shape templates possible.
To enable those additional features, Graphly takes the data structure of the force simulation and adds a number of further data properties to it.

The data structure extensions are described in more detail on the following pages.

## Baseline Data Structure

The data required by the vanilla d3 force simulation is an array of `nodes` and an array of `links` with very rudimentary properties.

Each `node` object requires only an `id` property to identify it.  
Each `link` object takes a `source` and `target` property to know the `ids` of the nodes it connects.

```js
const graph = {
	nodes: [{ id: "node1" }, { id: "node2" }],
	links: [{ source: "node1", target: "node2" }],
};
```

::: info
D3 changes certain properties while processing the data.  
E.g. a links `source` and `target` properties get changed from the `id` string to a reference to the respective node object.
:::

## Runtime Additions

When the data is rendered to display a force-directed graph, the `node` objects are populated with additional properties.
They represent the position and velocity of the node.

| Property | Type   | Description                |
| -------- | ------ | -------------------------- |
| `x`      | number | The x position of the node |
| `y`      | number | The y position of the node |
| `vx`     | number | The x velocity of the node |
| `vy`     | number | The y velocity of the node |

::: tip
Since the additional properties are now part of the data structure, they can be manipulated as well.
This is especially useful when there is a need for custom behavior.
:::
