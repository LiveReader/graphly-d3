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
A simple example for a link object with all possible properties. Check the sub-sections for more details.

```js
const link = {
	source: "node1",
	target: "node2",
	type: "solid",
	directed: true,
	label: "links to",
	strength: "strong",
	padding: 10,
};
```

:::

## Interface

```ts
interface Link {
	source: string | Node;
	target: string | Node;
	type?: LinkType;
	directed?: boolean;
	label?: string;
	strength?: number | LinkStrength;
	padding?: number;
}
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
	padding: 10,
};
```

## Playground

Give it a try and see how the different properties influence the appearance and behavior of links.
You can also try to set multiple links.

::: info
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
		},
		{
			id: "node2",
			shape: {
				type: "hexagon",
				scale: 1,
			},
			x: 150,
			y: -30,
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
