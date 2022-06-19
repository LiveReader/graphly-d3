<p align="center">
  <img src="https://graphly-d3.livereader.com/icons/graphly-d3-icon.png" width="30%">
</p>

# Graphly D3 Vue

This is a Vue component library implementing a wrapper component around [Graphly D3](https://graphly-d3.livereader.com) for an easy way to utilize it in a Vue application.

## How to use

1. install the component library with `npm install graphly-d3-vue` in your Vue project.

```shell
npm install @livereader/graphly-d3-vue
```

2. import the `GraphlyD3` component and style from the library.

```js
import { GraphlyD3 } from "@livereader/graphly-d3-vue";
import "@livereader/graphly-d3-vue/style.css";
```

3. embed the component in your Vue file with the `<GraphlyD3 />` tag.

```html
<GraphlyD3 ref="graphly" />
```

4. access the ref to the Graphly D3 ForceSimulation instance and use it to control the simulation.

```js
<template>
  <GraphlyD3 ref="graphly" />
</template>

<script setup>
	import { onMounted } from "vue";
	import { GraphlyD3 } from "@livereader/graphly-d3-vue";
	import "@livereader/graphly-d3-vue/style.css";

	const graphly = ref(null);

	onMounted(() => {
		const simulation = graphly.value.simulation;
		simulation.render({
			nodes: [],
			links: [],
		})
	});
</script>
```

To learn more about the `simulation` reference, take a look at the [Graphly D3](https://graphly-d3.livereader.com/simulation-api/#setup) documentation and learn which methods and properties are available.

## GraphlyD3 Props

The `GraphlyD3` Vue component accepts the following properties:

| Property          | Type           | Description                                     | Reference                                                                                     |
| ----------------- | -------------- | ----------------------------------------------- | --------------------------------------------------------------------------------------------- |
| dark              | `Boolean`      | whether to use the dark theme                   | [Docs](https://graphly-d3.livereader.com/template-api/template_styles.html#dark-mode)         |
| remoteOrigin      | `String`       | the remote origin from where to fetch templates | [Docs](https://graphly-d3.livereader.com/simulation-api/environment.html#remote-origin)       |
| selectedNodes     | `Array<sring>` | the selected nodes                              | [Docs](https://graphly-d3.livereader.com/simulation-api/environment.html#selected-nodes)      |
| envGravity        | `Number`       | the gravity of the environment                  | [Docs](https://graphly-d3.livereader.com/simulation-api/environment.html#env-gravity)         |
| linkDistance      | `Number`       | the minimum distance of links                   | [Docs](https://graphly-d3.livereader.com/simulation-api/environment.html#link-distance)       |
| animationDuration | `Number`       | the duration of animations                      | [Docs](https://graphly-d3.livereader.com/simulation-api/environment.html#animation-duration)  |
| draggableNodes    | `Boolean`      | whether nodes can be dragged                    | [Docs](https://graphly-d3.livereader.com/simulation-api/environment.html#draggable-nodes)     |
| zoomEnabled       | `Boolean`      | whether the zoom is enabled                     | [Docs](https://graphly-d3.livereader.com/simulation-api/move_and_zoom.html#zoom-enabled)      |
| zoomScaleExtent   | `Array<nmber>` | the zoom scale extent                           | [Docs](https://graphly-d3.livereader.com/simulation-api/move_and_zoom.html#zoom-scale-extent) |

Example:

```html
<GraphlyD3 ref="graphly" :dark="true" />
```

## GraphlyD3 Emits

The `GraphlyD3` Vue component also emits all [Event API](https://graphly-d3.livereader.com/simulation-api/event_api.html#event-api) events.

| Emit                   | Description                                  | Reference                                                                                        |
| ---------------------- | -------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| nodeClick              | user click on node shape                     | [Docs](https://graphly-d3.livereader.com/simulation-api/event_api.html#node-click)               |
| nodeDoubleClick        | user double click on node shape              | [Docs](https://graphly-d3.livereader.com/simulation-api/event_api.html#node-double-click)        |
| nodeContextMenu        | user right click on node shape               | [Docs](https://graphly-d3.livereader.com/simulation-api/event_api.html#node-context-menu)        |
| nodeDragStart          | user started dragging a node shape           | [Docs](https://graphly-d3.livereader.com/simulation-api/event_api.html#node-drag-start)          |
| nodeDragMove           | user dragging a node shape                   | [Docs](https://graphly-d3.livereader.com/simulation-api/event_api.html#node-drag-move)           |
| nodeDragEnd            | user released dragging a node shape          | [Docs](https://graphly-d3.livereader.com/simulation-api/event_api.html#node-drag-end)            |
|                        |                                              |                                                                                                  |
| linkClick              | user click on link shape                     | [Docs](https://graphly-d3.livereader.com/simulation-api/event_api.html#link-click)               |
| linkDoubleClick        | user double click on link shape              | [Docs](https://graphly-d3.livereader.com/simulation-api/event_api.html#link-double-click)        |
| linkContextMenu        | user right click on link shape               | [Docs](https://graphly-d3.livereader.com/simulation-api/event_api.html#link-context-menu)        |
| linkDragStart          | user started dragging a link shape           | [Docs](https://graphly-d3.livereader.com/simulation-api/event_api.html#link-drag-start)          |
| linkDragMove           | user dragging a link shape                   | [Docs](https://graphly-d3.livereader.com/simulation-api/event_api.html#link-drag-move)           |
| linkDragEnd            | user released dragging a link shape          | [Docs](https://graphly-d3.livereader.com/simulation-api/event_api.html#link-drag-end)            |
|                        |                                              |                                                                                                  |
| environmentClick       | user click on svg background                 | [Docs](https://graphly-d3.livereader.com/simulation-api/event_api.html#environment-click)        |
| environmentDoubleClick | user double click on svg background          | [Docs](https://graphly-d3.livereader.com/simulation-api/event_api.html#environment-double-click) |
| environmentContextMenu | user right click on svg background           | [Docs](https://graphly-d3.livereader.com/simulation-api/event_api.html#environment-context-menu) |
| environmentMove        | svg world moved by user or moveTo method     | [Docs](https://graphly-d3.livereader.com/simulation-api/event_api.html#environment-move)         |
|                        |                                              |                                                                                                  |
| simulationTick         | simulation ticked one simulation step        | [Docs](https://graphly-d3.livereader.com/simulation-api/event_api.html#simulation-tick)          |
| simulationTickEnd      | simulation finished ticking simulation steps | [Docs](https://graphly-d3.livereader.com/simulation-api/event_api.html#simulation-tick-end)      |

Example

```html
<GraphlyD3 ref="graphly" @node-click="(e, d) => console.log(d.id)" />
```
