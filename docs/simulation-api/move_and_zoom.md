---
title: Move and Zoom
lang: en-US
---

# Move and Zoom

The `ForceSimulation` class provides a number of interfaces to interact with the capability to zoom and pan the graph as well as to move to coordinates.

## Zoom Enabled

The `ForceSimulation` class has a public `zoomEnabled` member setter that can be set to `true` or `false`.
This enables or disables the zooming functionality affecting panning, pinching and zooming.

By default, the zooming is enabled.

```ts
simulation.zoomEnabled = true;
```

## Zoom Scale Extent

The `ForceSimulation` class has a public `zoomScaleExtent` member setter that can be set to an array of two numbers.
They define the minimum and maximum zoom scale values a user can zoom in and out by pinching or zooming.

`zoomScaleExtent` is set to `[0.1, 3]` by default.

```ts
simulation.zoomScaleExtent = [0.1, 3];
```

## World Transform

The `ForceSimulation` class has a public `transform` member that can holds the current transform of the svg world.

`transform` is set to `{ k: 1, x: 0, y: 0 }` at the beginning.

```ts
const transform = simulation.worldTransform;
```

## World Bounds

The `ForceSimulation` class has a public `worldBounds` getter that returns the current bounds that the svg element is showing.
This depends on the worldTransform and the svg element dimensions.

```ts
const bounds = simulation.worldBounds;
```

## Move To

The `ForceSimulation` exposes a powerful `moveTo()` method that can be used to move the svg world to a specific coordinate or to display certain bounds.
It takes an `MoveOptions` object as input.

```ts
interface MoveOptions {
	transform?: Transform;
	boundaries?: Boundary[];
	nodes?: Node[];
	duration?: number;
	padding?: number;
}
```

| Parameter    | Description                                                                                                                    |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| `transform`  | If set the world will be moved to the given coordinates and scale. This position will be the center of the svg element.        |
| `boundaries` | If set the world will be moved to ensure that all given boundaries are visible. This is combinable with the `nodes` parameter. |
| `nodes`      | If set the world will be moved to ensure that all given nodes are visible. This is combinable with the `boundaries` parameter. |
| `duration`   | The duration of the animation in milliseconds.                                                                                 |
| `padding`    | The padding in pixels that will be added to the boundaries. (No effect if using `transform`)                                   |

```ts
simulation.moveTo({
	transform: { k: 1, x: 0, y: 0 },
	duration: 1000,
});
```

::: info
This method is not restricted by the `zoomScaleExtent` or `zoomEnabled` properties.
If `transform` is set it is the most significant parameter and `boundaries` and `nodes` are ignored.
:::

::: tip
Here the `worldBounds` can be handy.
If you add a node but it is not visible, you can use `moveTo` to expand the view to show everything currently visible plus the new node.

```ts
const newNode = {
	id: "newNode",
	shape: {
		type: "myShape",
		scale: 1,
	},
	x: 1000,
	y: 500,
};
simulation.render(newNode);
simulation.moveTo({
	boundaries: [simulation.worldBounds],
	nodes: [newNode],
	padding: 50,
});
```

:::
