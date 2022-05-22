---
title: Link Event API
lang: en-US
---

# Link Event API

Graphly-D3 provides a number of event handlers for `link` related actions.
They are called when a `link` is manipulated by the user.  
The events are members of the `ForceSimulation` class and can be registered on an instance of it.

---

**Table of Contents**

[[toc]]

---

## New Link

The `onNewEdge` event gets called when a new link is dragged from one node to another.
This happens by holding the `alt` or `option` key while dragging.

::: tip
You probably want to create some kind of modal or menu to show the user the options for a new link.
:::

```js
simulation.onNewEdge((source, target) => {
	// source and target provide the reguarding node data objects
	// they can be used to create a new edge
	// and render the simulation
});
```

## Click

The `onEdgeClick` event gets called when a link is clicked by the user.

```js
simulation.onEdgeClick((e, d) => {
	// e carries the event data
	// d provides the data object of the clicked edge
});
```

## Double Click

The `onEdgeDoubleClick` event gets called when a link is double clicked by the user.

```js
simulation.onEdgeDoubleClick((e, d) => {
	// e carries the event data
	// d provides the data object of the clicked edge
});
```

## Context Click

The `onEdgeContextClick` event gets called when a link is right clicked by the user.

```js
simulation.onEdgeContextClick((e, d) => {
	// e carries the event data
	// d provides the data object of the clicked edge
});
```
