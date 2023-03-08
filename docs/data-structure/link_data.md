---
title: Link Data
lang: en-US
---

# Link Data

The original `link` properties are only required by d3 to calculate the respective forces that are applied to the nodes.
Graphly D3 extends this data structure with properties to further describe appearance and force behavior of any link.

::: info
Links are rendered as a clockwise curved line from the `source` to `target` node.
If there are multiple links between two nodes, the curvature of the line is incremented for each additional link.
:::

::: details Example
A simple example for a link object with most possible properties. Check the sub-sections for more details.

```js
const link = {
	id: "link1",
	source: "node1",
	target: "node2",
	type: "solid",
	directed: true,
	label: "links to",
	strength: "strong",
	padding: 10,
	width: 3,
	curvature: 0.1,
	color: "#a6a6a6",
	payload: {
		// put your custom data here
	},
};
```

:::

## Interface

```ts
interface Link {
	id?: string;
	source: string | Node;
	target: string | Node;
	type?: LinkType;
	directed?: boolean;
	label?: string;
	strength?: number | LinkStrength;
	padding?: number;
	width?: number;
	curvature?: number;
	color?: string;
	payload?: any;
}
```

## Id

::: warning available since version 1.1.0
:::

The `id` property is optional but recommended. It is used to identify the link in the graph and it can be used to easily search for a link in custom processing steps.

::: info
If no id property is set, the link will be assigned a random id in the first render loop.
:::

```js
const link = {
	id: "link1",
	source: "node1",
	target: "node2",
};
```

## Source & Target

The `source` and `target` properties are strings containing the `id` of the respective node this link connects.

::: info
Both properties are from the vanilla d3 data structure and get transformed to references to the respective node objects.
:::

```js
const link = {
	source: "node1",
	target: "node2",
};
```

## Type

The link `type` property defines the appearance of the link. It takes a string value and can be one of the following:

```ts
enum LinkType {
	Solid = "solid",
	Dashed = "dashed",
	Dotted = "dotted",
	Hidden = "hidden",
}
```

-   `solid`: A solid path with rounded ends.
-   `dashed`: A dashed path.
-   `dotted`: A dotted path.
-   `hidden`: The entire link is invisible. (including the [label](#label) and [arrow](#directed))

::: info
If not set or specified with a falsy value, the `solid` type is used as fallback.
:::

```js
const link = {
	source: "node1",
	target: "node2",
	type: "solid",
};
```

```ts
import { LinkType } from "@livereader/graphly-d3";
const link = {
	source: "node1",
	target: "node2",
	type: LinkType.Solid,
};
```

## Directed

The link `directed` property takes a boolean value and defines whether the link represents a directed relationship.
Default is `false`. If `true`, an arrow gets drawn at the head of the line, directed towards the `target` node.

```js
const link = {
	source: "node1",
	target: "node2",
	directed: true,
};
```

::: tip MORE FEATURES

> ::: warning available since version 1.4.0
> :::

Since version 1.4.0, the `directed` property can also be one of the string values `head`, `tail` or `both`.
This allows for more fine-grained control over the direction of the arrow and makes it possible to draw arrows at both ends of the link.

```js
const link = {
	source: "node1",
	target: "node2",
	directed: "both", // or "head" or "tail"
};
```

:::

## Label

The link `label` property is optional and takes a string value that can be used to display a label at the center of the link.
The text position takes the curvature of the line into account to be placed at the correct position.

```js
const link = {
	source: "node1",
	target: "node2",
	label: "links to",
};
```

## Strength

The link `strength` property is used to control the force that the link applies to its nodes.
It can be a numeric value to define the strength or one of the following predefinitions as string value:

```ts
enum LinkStrength {
	Strong = "strong",
	Weak = "weak",
	Loose = "loose",
}
```

-   `strong`: Predefinition for the strength `0.5`.
-   `weak`: Predefinition for the strength `0.3`.
-   `loose`: Predefinition for the strength `0`.

::: info
If not set or specified with a falsy value, the `weak` strength is used as default.  
Negative values drive the nodes apart and positive values pull the nodes towards each other.
`loose` or `0` will not apply any force to the nodes.
:::

```js
const link = {
	source: "node1",
	target: "node2",
	strength: "strong",
};
```

```ts
import { LinkStrength } from "@livereader/graphly-d3";
const link = {
	source: "node1",
	target: "node2",
	strength: LinkStrength.Strong,
};
```

## Padding

The link `padding` property is an optional number value that defines the space between the link and the nodes it connects.
The default value is `10`.

::: tip
This can be handy to fine-tune the appearance of your graph.
Otherwise, the default value will suffice and you can just ignore it.
:::

```js
const link = {
	source: "node1",
	target: "node2",
	padding: 10,
};
```

## Width

::: warning available since version 1.1.0
:::

The link `width` property is an optional number value that defines the width of the link and arrow paths.
The default value is `2`.

```js
const link = {
	source: "node1",
	target: "node2",
	width: 2,
};
```

## Curvature

::: warning available since version 1.1.0
:::

The link `curvature` property is an optional number value that defines the curvature of the link.
It can be handy to fine-tune the appearance of your graph but it is strongly recommended to leave this value unset since it is automatically calculated.

```js
const link = {
	source: "node1",
	target: "node2",
	curvature: 0.1,
};
```

::: tip
By not setting the curvature, the calculation takes the number of links between the two nodes into account and increases the curvature accordingly.
:::

## Color

::: warning available since version 1.4.0
:::

The link `color` property is an optional string value that defines the color of the link, arrow and label.
It can be handy to fine-tune the appearance of your graph and enables you to define a color for each link individually.  
By leaving this value unset, the color of the link is defined by the style sheet.

```js
const link = {
	source: "node1",
	target: "node2",
	color: "#4db6ac",
};
```

## Payload

::: warning available since version 1.1.0
:::

The link `payload` property is an optional object that can be used to store custom data and use it in custom processing steps.
It has no effect on the graph visualization.

```js
const link = {
	source: "node1",
	target: "node2",
	payload: {
		// put your custom data here
	},
};
```

## Playground

Give it a try and see how the different properties influence the appearance and behavior of links.
You can also try to set multiple links.

::: warning
Dont change the `links` array name since the playground context depends on it.
:::

<CodePreview height="40em" :graph="graph" editor-language="javascript" :editor-content="editorContent" @editorContentChange="editorContentChange" />

<script setup>
import { ref, onMounted } from "vue";
import CodePreview from "../components/CodePreview.vue";
let graph = ref({
	nodes: [
		{
			id: "node1",
			shape: {
				type: "hexagon",
				scale: 1,
			},
			x: -150,
			y: 30,
			payload: {
				title: "",
				color: "#9575cd"
			}
		},
		{
			id: "node2",
			shape: {
				type: "hexagon",
				scale: 1,
			},
			x: 150,
			y: -30,
			payload: {
				title: "",
				color: "#9575cd"
			}
		},
	],
	links: [],
	hasUpdate: false,
});

let editorContent = [
	'const links = [',
	'	{',
	'		source: "node1",',
	'		target: "node2",',
	'		type: "solid",',
	'		directed: true,',
	'		label: "links to",',
	'		strength: "strong",',
	'		padding: 10,',
	'	},',
	'];',
].join("\n");

function editorContentChange(value) {
	const l = parseLinks(value);
	newLinks = l;
	lastChange = Date.now();
	changes = true;
}

function parseLinks(code) {
	var constructorCode = code + "\nlinks;";
	const value = eval(constructorCode);
	return value;
}

let changes = false;
let lastChange = Date.now();
let newLinks = [];
function updateGraph(l) {
	graph.value.links = l;
	graph.value.hasUpdate = true;
}

onMounted(() => {
	const l = parseLinks(editorContent);
	updateGraph(l);
	setInterval(() => {
		if (changes && Date.now() - lastChange > 1000) {
			updateGraph(newLinks);
			changes = false;
		}
	}, 100);
})
</script>
