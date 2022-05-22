---
title: Node Event API
lang: en-US
---

# Node Event API

Graphly-D3 provides a number of event handlers for `node` related actions.
They are called when a `node` is manipulated by the user.  
The events are members of the `ForceSimulation` class and can be registered on an instance of it.

---

**Table of Contents**

[[toc]]

---

## Click

The `onClick` event gets called when a node is clicked by the user.

```js
simulation.onClick((e, d) => {
	// e carries the event data
	// d provides the data object of the clicked node
});
```

## Double Click

The `onDoubleClick` event gets called when a node is double clicked by the user.

```js
simulation.onDoubleClick((e, d) => {
	// e carries the event data
	// d provides the data object of the clicked node
});
```

## Context Click

The `onContextClick` event gets called when a node is right clicked by the user.

```js
simulation.onContextClick((e, d) => {
	// e carries the event data
	// d provides the data object of the clicked node
});
```

## Drag Start

The `onDragStart` event gets called when a node starts to be dragged by the user.

```js
simulation.onDragStart((e, d, pos) => {
	// e carries the event data
	// d provides the data object of the dragged node
	// pos provides the relative position of the svg world coordinates (x, y)
});
```

## Drag

The `onDragged` event gets called while a node is dragged by the user.

```js
simulation.onDragged((e, d) => {
	// e carries the event data
	// d provides the data object of the dragged node
});
```

## Drag End

The `onDragEnd` event gets called when a node is released after being dragged by the user.

```js
simulation.onDragEnd((e, d, pos) => {
	// e carries the event data
	// d provides the data object of the dragged node
	// pos provides the relative position of the svg world coordinates (x, y)
});
```
