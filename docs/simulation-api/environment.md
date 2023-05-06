---
title: Environment
lang: en-US
---

# Environment

The `ForceSimulation` class provides a number of methods for setting up and manipulating the environment.

## SVG Element

The `ForceSimulation` class requires a `<svg>` element as constructor input to render the graph.
But it also exposes the `svgElement` member which allows you to change the SVG element later which will automatically re-render the graph with the new SVG element.

```ts
simulation.svgElement = document.getElementById("myNewSVG");
```

## Render

The `ForceSimulation`s `render()` method is called to render the given graph input in the SVG element.
The render method also takes two optional arguments: the `alpha` value that represents the initial simulation alpha and the `forced` flag that can be set to `true` to force the whole graph to be re-rendered.

| Property | Type    | Description                                                   |
| -------- | ------- | ------------------------------------------------------------- |
| graph    | Graph   | the graph data to render (contains nodes and links)           |
| alpha?   | number  | the alpha value to use for the simulation (`0.05` by default) |
| forced?  | boolean | if set to `true` the whole graph will be re-rendered          |

```ts
const graph = {
	nodes: [...],
	links: [...],
}
simulation.render(graph);
```

::: warning

```ts
simulation.render(graph, 0.05, true);
```

The `forced` flag is only to be used if you have reason to believe that the automatic data-change detection did not work as intended.
Besides that, it would harm the optimized performance of the simulation.
:::

## Snapshot

::: warning available since version 1.5.0
:::

The `ForceSimulation`s `snapshot()` method is called to render a snapshot of the force simulation and returns a static SVGElement DOM node.

```ts
const snapshow = simulation.snapshot();
```

::: tip
This is useful to render a static version of the graphly graph to use it as a preview or thumbnail for example.
:::

## Template Store

The `ForceSimulation` class contains and exposes the `templateStore` module which is used to store the shape templates that are used to render the nodes.
This module contains two functionalities that are interesting for you.

### Remote Origin

The `remoteOrigin` member of the `templateStore` module can be used to set the url from which the templates will be imported dynamically during the rendering process.

```ts
simulation.templateStore.remoteOrigin = "https://distributed-template-server/";
```

::: tip
This is handy if you want to provite a remote template server from where you can manage your templates.
That's especially useful if you have a large scale application.
:::

### Add Template

The `add()` method of the `templateStore` module is used to add a template to the store under a given `type`.

```ts
import MyTemplate from "./templates/myTemplate";
simulation.templateStore.add("myTemplate", MyTemplate);
```

::: info
More about how to develop your own templates can be found in the [Template API](/template-api/).
:::

## Export Graph

The `ForceSimulation` class provides a `exportGraph()` method that is strongly recommended to be used to get a version of the graph data that can be used for further processing by you.

```ts
const graph = simulation.exportGraph();
```

::: tip
This data object contains a cleaned version of the graph data that is used to render and process the graph data internally.
It's strongly recommended to use this method to get a version of the graph that can be used further by you (e.g. for persisting it).
:::

## Selected Nodes

The `ForceSimulation` class exposes a `selectedNodes` member that holds an array of the `ids` of all nodes that are currently to be rendered as selected.

```ts
simulation.selectedNodes = ["node1", "node2"];
```

## Env Gravity

The `ForceSimulation` class exposes a `envGravity` setter that can be used to set the default gravitational force of nodes to be applied to each other.
It is set to `-10000` by default.

```ts
simulation.envGravity = -5000;
```

::: tip
Usually a negative value to counteract the pulling force of links.
:::

## Link Distance

The `ForceSimulation` class exposes a `linkDistance` setter that can be used to set the minimum distance all links strive to.
The default value is `400`. The distance is measured from the center point of either node, so the node size has to be considered.

```ts
simulation.linkDistance = 250;
```

## Animation Duration

The `ForceSimulation` class exposes a `animationDuration` member that can be used to set the duration of the animation in milliseconds.
The default value is `300`.

```ts
simulation.animationDuration = 500;
```

## Draggable Nodes

The `ForceSimulation` class exposes a `draggableNodes` member that can be used to set whether or not nodes can be dragged by the user.
The default value is `true`.

```ts
simulation.draggableNodes = false;
```

## Debug

::: warning available since version 1.1.0
:::

The `ForceSimulation` debug object can be used to enable certain additional debug features.
It supports displaying the calculated [`gly-body`](/template-api/index#graphly-body) points of the nodes.

Just enable debug mode with `simulation.debug.enabled = true;`

```js
simulation.debug = {
	enabled: false,
	bodyPoints: {
		enabled: true,
		color: "#00ffff",
	},
};
```

::: tip
This is useful if you want to check if the template is configured correctly to support the [`gly-body`](/template-api/index#graphly-body) feature.
:::
