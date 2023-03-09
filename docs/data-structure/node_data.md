---
title: Node Data
lang: en-US
---

# Node Data

The original `node` object only requires an `id` property so d3 can identify the node.
Graphly D3 extends this data structure quite a bit to provide additional properties to describe appearance and behavior of any node.

::: info
Using Graphly D3, nodes are rendered using a shape template.
More about defining them on the [Template API](/template-api/) documenation.
:::

::: details Example
A simple example for a node object with most possible properties. Check the sub-sections for more details.

```js
const node = {
	id: "node1",
	x: 150,
	y: -30,
	shape: {
		type: "myShape",
		scale: 1,
	},
	gravity: -5000,
	spawn: {
		source: "node2",
		angle: 45,
		distance: 600,
	},
	anchor: {
		type: "soft",
		x: 300,
		y: 100,
	},
	satellite: {
		source: "node2",
		angle: 45,
		distance: 600,
	},
	payload: {
		// put your custom data here
	},
};
```

:::

## Interface

```ts
interface Node {
	id: string;
	x?: number;
	y?: number;
	shape: Shape;
	gravity?: number;
	spawn?: Spawn;
	anchor?: Anchor;
	satellite?: Satellite;
	payload?: any;
}
```

## Id & Position

The node `id` property is a string to uniquely identify a node in the graph.  
The node `x` and `y` properties are optional and define the position of the node.
If not defined the simulation will place them at `0,0` by default except [spawn](#spawn), [anchor](#anchor) or [satellite](#satellite) properties are set.

::: info
Those is the only property by the vanilla d3 force-simulation data structure.
:::

```js
const node = {
	id: "node1",
	x: 150,
	y: -30,
};
```

## Shape

The node `shape` object property defines the appearance of the node.
It requires a `type` and a `scale` property to tell Graphly D3 how to render the node.

```ts
interface Shape {
	type: string;
	scale: number;
	url?: string;
	bodyResolution?: number;
}
```

| Property          | Description                                                                                                                                                                      |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `type`            | defines which template to use to render the node ([Template API](/template-api/))                                                                                                |
| `scale`           | defines the relative scale of the node (`1` by default)                                                                                                                          |
| `url?`            | can be used to define a custom remote origin for this specific shape type                                                                                                        |
| `bodyResolution?` | can be used to define the resolution of the [gly-body](/template-api/index#graphly-body) path and how detailed collisions and link distances can be calculated (default is `32`) |

::: warning
bodyResolution is only available since version 1.1.0
:::

::: tip
You can use the `scale` property to create a visual hierachy of nodes by decreasing the size of less important nodes.
:::

```js
const node = {
	id: "node1",
	shape: {
		type: "myShape",
		scale: 1,
	},
};
```

## Gravity

The node `gravity` property is optional and defines the gravitational force this node applies to other nodes.
If not set the `envGravity` of the force simulation is used.

::: tip
This proeprty is handy to fine-tune the forces within the simulation.
Otherwise, the default value will suffice and you can just ignore it.

In most cases you want to use a negative value to make the nodes push away from each other since this counteracts the link pulling forces.
:::

```js
const node = {
	id: "node1",
	gravity: -5000,
};
```

## Spawn

The node `spawn` object property is optional and describes how the node should be placed when it is created the first time.
This property is used when no position are defined yet and the node should be spawned in relative position to another node.

```ts
interface Spawn {
	source: string;
	angle: number;
	distance: number;
}
```

| Property   | Description                                                           |
| ---------- | --------------------------------------------------------------------- |
| `source`   | `id` of the source node to spawn the new node in relative position to |
| `angle`    | angle in degrees. Rotation is clockwise. `0` is above the source node |
| `distance` | distance between the centers of the source node and the new node      |

::: info
This property only gets applied on `render()` when the node object does not have `x`, `y` or `fx`, `fy` properties set.
:::

```js
const node = {
	id: "node1",
	spawn: {
		source: "node2",
		angle: 45,
		distance: 600,
	},
};
```

## Anchor

The node `anchor` object property is optional and describes the position to which the node is constantly heading towards.

```ts
enum AnchorType {
	Soft = "soft",
	Hard = "hard",
}
interface Anchor {
	type: AnchorType;
	x: number;
	y: number;
}
```

| Property | Description                                                                   |
| -------- | ----------------------------------------------------------------------------- |
| `type`   | defines whether the node moves softly towards the position or is locked to it |
| `x`      | the x position of the anchor                                                  |
| `y`      | the y position of the anchor                                                  |

::: info
`soft` anchors are only heading towards the anchor position and will be affected by the other forces applied to the node.

`hard` anchors are fixing the node to the anchor position and will not be affected by any other forces.
(This will set `fx` and `fy` properties on the node object)
:::

```js
const node = {
	id: "node1",
	anchor: {
		type: "soft",
		x: 300,
		y: 100,
	},
};
```

```ts
import { AnchorType } from "@livereader/graphly-d3";
const node = {
	id: "node1",
	anchor: {
		type: AnchorType.Soft,
		x: 300,
		y: 100,
	},
};
```

## Satellite

The node `satellite` object property is optional and can be used to bind one node to another.
It will keep a relative position to the source node at all times.

```ts
enum SatelliteType {
	Soft = "soft",
	Hard = "hard",
}

interface Satellite {
	source: string;
	angle: number;
	distance: number;
	type?: SatelliteType;
}
```

| Property   |  Description                                                                                     |
| ---------- | ------------------------------------------------------------------------------------------------ |
| `source`   | `id` of the source node to spawn the new node in relative position to                            |
| `angle`    | angle in degrees. Rotation is clockwise. `0` is above the source node                            |
| `distance` | distance between the centers of the source node and the new node                                 |
| `type?`    | defines whether the node moves softly towards the position or is locked to it. `soft` by default |

::: warning
type is only available since version 1.4.0
:::

::: info
By default the satellite nodes will be of `type` `soft` and therefore affected by the other forces like (e.g. gravity or collision) but strive towards the computed position simmilar to a `soft anchor`.  
In case of multiple satellites with a similar target position, the satellites will all strive towards their target position and collide with each other.

Using `type` `hard` will fix the node to the computed relative position and will not be affected by any other forces. Multiple satellites with `type` `hard` will not collide with each other either.
:::

```js
const node = {
	id: "node1",
	satellite: {
		source: "node2",
		angle: 45,
		distance: 600,
		type: "soft",
	},
};
```

## Payload

Put all your custom data behind the `payload` object property and use this data in a [template](/template-api/) to render the node in the desired way.

::: info
To encapsulate and efficiently monitor data changes to perform the necessary re-rendering of nodes, the node `payload` is optional.
:::

```js
const node = {
	payload: {
		// put your custom data here
	},
};
```

## Playground

Give it a try and see how the different properties influence the appearance and behavior of nodes.

::: warning
Dont change the `nodes` array name since the playground context depends on it.
:::

<CodePreview height="40em" :graph="graph" editor-language="javascript" :editor-content="editorContent" @editorContentChange="editorContentChange" />

::: info
This template uses data about `title` and `color` to render the node.

```js
payload: {
	title: "Hello\nWorld",
	color: "teal",
}
```

:::

<script setup>
import { ref, onMounted } from "vue";
import CodePreview from "../.vitepress/components/CodePreview.vue";
let graph = ref({
	nodes: [],
	links: [
		{
			source: "node1",
			target: "node2",
			type: "solid",
			directed: true,
			label: "",
			strength: "weak",
			padding: 10,
		},
	],
	hasUpdate: false,
});

let editorContent = [
	'const nodes = [',
	'	{',
	'		id: "node1",',
	'		shape: {',
	'			type: "hexagon",',
	'			scale: 1,',
	'		},',
	'		x: -150,',
	'		y: 30,',
	'		payload: {',
	'			title: "Hello\\nWorld",',
	'			color: "teal",',
	'		},',
	'	},',
	'	{',
	'		id: "node2",',
	'		shape: {',
	'			type: "hexagon",',
	'			scale: 1,',
	'		},',
	'		x: 150,',
	'		y: -30,',
	'		payload: {',
	'			title: "",',
	'			color: "#9575cd",',
	'		},',
	'	},',
	'];',
].join("\n");

function editorContentChange(value) {
	const n = parseNodes(value);
	newNodes = n;
	lastChange = Date.now();
	changes = true;
}

function parseNodes(code) {
	var constructorCode = code + "\nnodes;";
	const value = eval(constructorCode);
	return value;
}

let changes = false;
let lastChange = Date.now();
let newNodes = [];
function updateGraph(n) {
	graph.value.nodes = n;
	graph.value.links.forEach((l) => {
		typeof l.source == "string" ? {} : l.source = l.source.id;
		typeof l.target == "string" ? {} : l.target = l.target.id;
	})
	graph.value.hasUpdate = true;
}

onMounted(() => {
	const n = parseNodes(editorContent);
	updateGraph(n);
	setInterval(() => {
		if (changes && Date.now() - lastChange > 1000) {
			updateGraph(newNodes);
			changes = false;
		}
	}, 100);
})
</script>
