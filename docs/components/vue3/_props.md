---
title: Vue 3 Component
lang: en-US
---

# Props

To make the component easier to work with there are a few `props` that wrap the `simulation` properties and methods.

## Available Properties

| Property          | Type           | Description                                     | Docs                                                         |
| ----------------- | -------------- | ----------------------------------------------- | ------------------------------------------------------------ |
| dark              | `Boolean`      | whether to use the dark theme                   | [Docs](/template-api/template_styles.html#dark-mode)         |
| remoteOrigin      | `String`       | the remote origin from where to fetch templates | [Docs](/simulation-api/environment.html#remote-origin)       |
| selectedNodes     | `Array<sring>` | the selected nodes                              | [Docs](/simulation-api/environment.html#selected-nodes)      |
| envGravity        | `Number`       | the gravity of the environment                  | [Docs](/simulation-api/environment.html#env-gravity)         |
| linkDistance      | `Number`       | the minimum distance of links                   | [Docs](/simulation-api/environment.html#link-distance)       |
| animationDuration | `Number`       | the duration of animations                      | [Docs](/simulation-api/environment.html#animation-duration)  |
| draggableNodes    | `Boolean`      | whether nodes can be dragged                    | [Docs](/simulation-api/environment.html#draggable-nodes)     |
| zoomEnabled       | `Boolean`      | whether the zoom is enabled                     | [Docs](/simulation-api/move_and_zoom.html#zoom-enabled)      |
| zoomScaleExtent   | `Array<nmber>` | the zoom scale extent                           | [Docs](/simulation-api/move_and_zoom.html#zoom-scale-extent) |

## Example

```vue
<template>
	<GraphlyD3
		ref="graphly"
		:dark="true"
		remoteOrigin="/templates"
		:selectedNodes="['node-1', 'node-2']"
		:envGravity="-5000"
		:linkDistance="100"
		:animationDuration="500"
		:draggableNodes="true"
		:zoomEnabled="true"
		:zoomScaleExtent="[0.1, 10]"
	/>
</template>
```
