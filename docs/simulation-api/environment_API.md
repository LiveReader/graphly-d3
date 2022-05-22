---
title: Environment API
lang: en-US
---

# Environment API

Graphly-D3 provides a number of methods for setting up the environment.  
They are members of the `ForceSimulation` class and can be registered on an instance of it.

---

**Table of Contents**

[[toc]]

---

## Render

The `render` method renders (or re-renders) the nodes and links of the graph.
It requires the graph `data` as first input but also provides a optional second input to set the alpha value of the simulation.
It's default is `0.1` and lets proceed the force simulation.

```js
const alpha = 0.1; // optional
simulation.render(data, alpha);
```

## Template Origin

The `setTemplateOrigin` method sets the url from which the templates will be imported dynamically during the rendering process.

```js
simulation.setTemplateOrigin("http://" + document.location.host + "/templates/");
```

## Gravity

The `setGravity` method configures the gravitational force the nodes apply to each other.
The default value is `-10000`.

::: tip
Usually a negative value to counteract the pulling force of links.
:::

```js
simulation.setGravity(-5000);
```

## Link Distance

The `setLinkDistance` method configures the minimum distance all links strive to. The default value is `400`.
The distance is measured from the center point of either node, so the node size has to be considered.

```js
simulation.setLinkDistance(250);
```

## Select Nodes

The `selectNodes` method takes a array of node `ids` as input and renders them as selected.

```js
simulation.selectNodes(["node1", "node2"]);
```

## Zoom Boundaries

The `setZoomBoundaries` method takes the arguments `min` and `max` to set the zoom boundaries of the svg world.
Default values are `min = 0.1` and `max = 3`.

```js
simulation.setZoomBoundaries(0.1, 3);
```

## Draggable Nodes

The `draggableNodes` method sets a flag that enables or disables the dragging functionality of nodes.

```js
simulation.draggableNodes(true);
```

---

## On Move

The `onMove` method registers a callback function that is called when any `zoom` or `pan` event occurs on the svg world.
It takes an callback method that receives the current `transform` object.

```js
simulation.onMove((transform) => {
	// transform carries k as the zoom factor
	// and x, y as the position values
});
```

## On Background Click

The `onBackground` method registers a callback function that is called when any `click` event occurs on the background and not on a node or link.

```js
simulation.onBackground((e, pos) => {
	// e carries the event data
	// pos provides the relative position of the svg world coordinates (x, y)
});
```
