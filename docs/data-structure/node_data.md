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
A simple example for a node object with all possible properties. Check the sub-sections for more details.

```js
const node = {
	id: "node1",
	shape: {
		type: "myShape",
		scale: 1,
	},
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

---

**Table of Contents**

[[toc]]

---

## Id

The node `id` property is a string to uniquely identify a node in the graph.

::: info
This is the only property required by the vanilla d3 force-simulation data structure.
:::

```js
const node = {
	id: "node1",
};
```

## Shape

The node `shape` object property defines the appearance of the node.
It requires a `type` and a `scale` property to tell Graphly D3 how to render the node.
`template` refers to the shape template (see [Template API](/template-api/)) and `scale` is a number that defines the relative scale of the node (`1` by default).

::: tip
You can use the `scale` property to create a visual hierachy of nodes by decreasing the size of less important nodes.
:::

```js
const node = {
	shape: {
		type: "myShape",
		scale: 1,
	},
};
```

## Spawn

The node `spawn` object property is optional and describes how the node should be placed when it is created the first time.
This property is used when no coordinates are defined yet and the node should be spawned in relative position to another node.

This data object requires the following properties:

| Property   | Type   | Description                                                                      |
| ---------- | ------ | -------------------------------------------------------------------------------- |
| `source`   | string | The `id` of the source node to spawn the new node in relative position to        |
| `angle`    | number | The angle in degrees. Rotation is clockwise with `0` being above the source node |
| `distance` | number | The distance between the center of the source node and the new node's center     |

::: info
This property only gets applied on `render()` when the node object does not have a `x`, `y` or `fx`, `fy` property.
:::

```js
const node = {
	spawn: {
		source: "node2",
		angle: 45,
		distance: 600,
	},
};
```

## Anchor

The node `anchor` object property is optional and describes the position to which the node is heading.
This data object requires the following properties:

| Property | Type   | Description                                 |
| -------- | ------ | ------------------------------------------- |
| `type`   | string | The type of anchor. Can be `soft` or `hard` |
| `x`      | number | The x position of the anchor                |
| `y`      | number | The y position of the anchor                |

::: info
`soft` anchors are only heading towards the anchor position and will be affected by the other forces applied to the node.  
`hard` anchors are fixing the node to the anchor position and will not be affected by any other forces.
(This will set `fx` and `fy` properties on the node object)
:::

```js
const node = {
	anchor: {
		type: "soft",
		x: 300,
		y: 100,
	},
};
```

## Satellite

The node `satellite` object property is optional and can be used to bind a node to another node.
It will keep a relative position to the source node at all times.
This data object requires the following properties:

| Property   | Type   |  Description                                                                     |
| ---------- | ------ | -------------------------------------------------------------------------------- |
| `source`   | string | The `id` of the source node to bind the new node to                              |
| `angle`    | number | The angle in degrees. Rotation is clockwise with `0` being above the source node |
| `distance` | number | The distance between the center of the source node and the new node's center     |

::: info
The satellite nodes will be affected by the other forces like (e.g. gravity or collision) but strive towards the computed position simmilar to a `soft` `anchor`.
In case of multiple satellites with a similar target position, the satellites will all strive towards their target position and collide with each other.
:::

```js
const node = {
	satellite: {
		source: "node2",
		angle: 45,
		distance: 600,
	},
};
```

## Payload

It is considered best practice to encapsulate your custom data in the `payload` object.
This makes it easy to read and write your data to the node object.
This also prevents name collisions with other data properties and avoids side effects.

::: info
Technically it is not required and the data could be placed directly in the node object but we strongly recommend to use some kind of encapsulation to avoid naming conflicts.
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

::: info
Dont change the `nodes` array name since the playground context depends on it.
:::

<CodePreview height="40em" :graph="graph" editor-language="javascript" :editor-content="editorContent" @editorContentChange="editorContentChange" />

<script setup>
import { ref, onMounted } from "vue";
import CodePreview from "../components/CodePreview.vue";
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
	'	},',
	'	{',
	'		id: "node2",',
	'		shape: {',
	'			type: "hexagon",',
	'			scale: 1,',
	'		},',
	'		x: 150,',
	'		y: -30,',
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
