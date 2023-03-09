---
title: Event API
lang: en-US
---

# Event API

The event API can be accessed by registering a callback function with the `on()` method of the `ForceSimulation` instance.
It takes the event identifier string as first argument and the callback function as second argument.

```ts
simulation.on("", (...args) => {
	// do something
});
```

Using the `Event` enum from the `graphly-d3` package you can easily register to the available default events.

```ts
enum Event {
	NodeClick = "node:click",
	NodeDoubleClick = "node:doubleclick",
	NodeContextMenu = "node:contextmenu",
	NodeDragStart = "node:dragstart",
	NodeDragMove = "node:dragmove",
	NodeDragEnd = "node:dragend",

	LinkClick = "link:click",
	LinkDoubleClick = "link:doubleclick",
	LinkContextMenu = "link:contextmenu",
	LinkDragStart = "link:dragstart",
	LinkDragMove = "link:dragmove",
	LinkDragEnd = "link:dragend",

	EnvironmentClick = "environment:click",
	EnvironmentDoubleClick = "environment:doubleclick",
	EnvironmentContextMenu = "environment:contextmenu",
	EnvironmentMove = "environment:move",

	SimulationTick = "simulation:tick",
	SimulationTickEnd = "simulation:tickend",

	ThemeChange = "theme:change", // available since v1.4.0
}
```

## Node Click

The `"node:click"` event is triggered when a node shape is clicked by the user.
It provides arguments about the `event` and the [`node`](/data-structure/node_data.html#interface) object that was clicked.

```ts
import { Event } from "@livereader/graphly-d3";
simulation.on(Event.NodeClick, (event, node) => {
	// do something
});
```

## Node Double Click

The `"node:doubleclick"` event is triggered when a node shape is double clicked by the user.
It provides arguments about the `event` and the [`node`](/data-structure/node_data.html#interface) object that was double clicked.

```ts
import { Event } from "@livereader/graphly-d3";
simulation.on(Event.NodeDoubleClick, (event, node) => {
	// do something
});
```

## Node Context Menu

The `"node:contextmenu"` event is triggered when a node shape is right clicked by the user.
It provides arguments about the `event` and the [`node`](/data-structure/node_data.html#interface) object that was right clicked.

```ts
import { Event } from "@livereader/graphly-d3";
simulation.on(Event.NodeContextMenu, (event, node) => {
	// do something
});
```

## Node Drag Start

The `"node:dragstart"` event is triggered when a node shape is started to be dragged by the user.
It provides arguments about the `event`, the [`node`](/data-structure/node_data.html#interface) object and the position the node was dragged from.
`position` contains `x` and `y` coordinates.

```ts
import { Event } from "@livereader/graphly-d3";
simulation.on(Event.NodeDragStart, (event, node, position) => {
	// do something
});
```

If you return the string `"newlink"` within the callback, the `"link:dragstart"` event will be triggered and the node dragging process will be interrupted.

::: tip
This can be very handy if you want to drag a new link from this node to another node under certain conditions. E.g. if the `alt` key is pressed.

```ts
import { Event } from "@livereader/graphly-d3";
simulation.on(Event.NodeDragStart, (event, node, position) => {
	if (event.sourceEvent.altKey) {
		return "newlink";
	}
	// else do something
});
```

:::

## Node Drag Move

The `"node:dragmove"` event is triggered when a node shape is dragged by the user.
It provides arguments about the `event`, the [`node`](/data-structure/node_data.html#interface) object and the position the node was dragged to.
`position` contains `x` and `y` coordinates.

```ts
import { Event } from "@livereader/graphly-d3";
simulation.on(Event.NodeDragMove, (event, node, position) => {
	// do something
});
```

## Node Drag End

The `"node:dragend"` event is triggered when a node shape is dragged by the user and released.
It provides arguments about the `event`, the [`node`](/data-structure/node_data.html#interface) object and the position the node was dragged to.
`position` contains `x` and `y` coordinates.

```ts
import { Event } from "@livereader/graphly-d3";
simulation.on(Event.NodeDragEnd, (event, node, position) => {
	// do something
});
```

## Link Click

The `"link:click"` event is triggered when a link between two nodes is clicked by the user.
It provides arguments about the `event` and the [`link`](/data-structure/link_data.html#interface) object that was clicked.

```ts
import { Event } from "@livereader/graphly-d3";
simulation.on(Event.LinkClick, (event, link) => {
	// do something
});
```

## Link Double Click

The `"link:doubleclick"` event is triggered when a link between two nodes is double clicked by the user.
It provides arguments about the `event` and the [`link`](/data-structure/link_data.html#interface) object that was double clicked.

```ts
import { Event } from "@livereader/graphly-d3";
simulation.on(Event.LinkDoubleClick, (event, link) => {
	// do something
});
```

## Link Context Menu

The `"link:contextmenu"` event is triggered when a link between two nodes is right clicked by the user.
It provides arguments about the `event` and the [`link`](/data-structure/link_data.html#interface) object that was right clicked.

```ts
import { Event } from "@livereader/graphly-d3";
simulation.on(Event.LinkContextMenu, (event, link) => {
	// do something
});
```

## Link Drag Start

The `"link:dragstart"` event is triggered when a link is started to be dragged from one node (source).
It provides arguments about the `event`, the source [`node`](/data-structure/node_data.html#interface) object and the position the link was dragged from.
`position` contains `x` and `y` coordinates.

```ts
import { Event } from "@livereader/graphly-d3";
simulation.on(Event.LinkDragStart, (event, sourceNode, position) => {
	// do something
});
```

## Link Drag Move

The `"link:dragmove"` event is triggered when a link is being dragged.
It provides arguments about the `event`, the source [`node`](/data-structure/node_data.html#interface) object and the position the link was dragged to.
`position` contains `x` and `y` coordinates.

```ts
import { Event } from "@livereader/graphly-d3";
simulation.on(Event.LinkDragMove, (event, sourceNode, position) => {
	// do something
});
```

## Link Drag End

The `"link:dragend"` event is triggered when a link is dragged and released.
It provides arguments about the `event`, the source [`node`](/data-structure/node_data.html#interface) object, the target [`node`](/data-structure/node_data.html#interface) object and the position the link was dragged to.
`position` contains `x` and `y` coordinates.

```ts
import { Event } from "@livereader/graphly-d3";
simulation.on(Event.LinkDragEnd, (event, sourceNode, targetNode, position) => {
	// do something
});
```

The `targetNode` is only set if the link is released over another node then the source node.

::: tip
This can be used as a way to create a new link between two nodes.
It also allows you to interrupt the process and show a modal dialog to further configure the link or just create a new link direclty.

```ts
simulation.on(Event.LinkDragEnd, (event, sourceNode, targetNode, pos) => {
	if (targetNode) {
		const link = {
			source: sourceNode.id,
			target: targetNode.id,
		};
		graph.links.push(link);
		simulation.render(graph);
	}
});
```

:::

## Environment Click

The `"environment:click"` event is triggered when the user clicks on the svg element.
It provides arguments about the `event` and the `position` of the click within the svg world.
`position` contains `x` and `y` coordinates.

```ts
import { Event } from "@livereader/graphly-d3";
simulation.on(Event.EnvironmentClick, (event, position) => {
	// do something
});
```

## Environment Double Click

The `"environment:doubleclick"` event is triggered when the user double clicks on the svg element.
It provides arguments about the `event` and the `position` of the click within the svg world.
`position` contains `x` and `y` coordinates.

```ts
import { Event } from "@livereader/graphly-d3";
simulation.on(Event.EnvironmentDoubleClick, (event, position) => {
	// do something
});
```

## Environment Context Menu

The `"environment:contextmenu"` event is triggered when the user right clicks on the svg element.
It provides arguments about the `event` and the `position` of the click within the svg world.
`position` contains `x` and `y` coordinates.

```ts
import { Event } from "@livereader/graphly-d3";
simulation.on(Event.EnvironmentContextMenu, (event, position) => {
	// do something
});
```

## Environment Move

The `"environment:move"` event is triggered when the user moves the svg world by dragging the background.
It provides the argument about the current `transform` of the svg world.
`transform` contains `x` and `y` coordinates and the `k` scale factor.

```ts
import { Event } from "@livereader/graphly-d3";
simulation.on(Event.EnvironmentMove, (transform) => {
	// do something
});
```

## Simulation Tick

The `"simulation:tick"` event is triggered on each step of the simulation.

```ts
import { Event } from "@livereader/graphly-d3";
simulation.on(Event.SimulationTick, () => {
	// do something
});
```

## Simulation Tick End

The `"simulation:tickend"` event is triggered when the simulation is finished and the node movement is finished.

```ts
import { Event } from "@livereader/graphly-d3";
simulation.on(Event.SimulationTickEnd, () => {
	// do something
});
```

## Theme Change

::: warning available since version 1.4.0
:::

The `"theme:change"` event is triggered when the theme of the simulation is changed.
It provides the argument about the current `theme` of the simulation. (either `"light"` or `"dark"`)

```ts
import { Event } from "@livereader/graphly-d3";
simulation.on(Event.ThemeChange, (theme) => {
	// do something
});
```

## Custom Template Events

The template events are special events that can be triggered by shape templates.
More detailed information about how to fire these events can be found in the [EmitEvent](/template-api/events#emit-event) section of the [Template API](/template-api/).

You can also listen to these events by using the `on` method and using a special event name pattern: `"template:<template-name>:<event-name>"`.

It always provides the arguments about the ['node'](/data-structure/node_data.html#interface) data object and the `event` object.
Any further arguments are specified by the EventEmitter of the template.

```ts
simulation.on("template:myShape:myCustomEvent", (node, event, ...args) => {
	// do something
});
```

::: tip
If you want to prevent that the `node:click` event is also fired, you can use the `.stopPropagation()` method of the `event` object.

```ts
simulation.on("template:myShape:myCustomEvent", (node, event) => {
	event.stopPropagation();
});
```

This allows you to better differentiate between custom buttons for example and the normal node click event.
:::
