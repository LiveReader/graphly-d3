---
title: Shape Payload
lang: en-US
---

# Shape Payload

::: warning available since version 1.3.0
:::

```ts
export default {
	shapeSize: 300,
	shapePayload: schema, // [!code focus]
	shapeBuilder: shapeBuilder,
}
```

The `shapePayload` is a optional property of a template definition that can be used to define what the payload for a template should look like.

This is done by defining a [JSON schema](https://json-schema.org/) that will be used to validate the payload of a node (using [AJV](https://ajv.js.org/)) before the shape is rendered.
Take a look at the [ajv documentation](https://ajv.js.org/json-schema.html#json-data-type) for more information on how to define a schema.

## Example

```ts{19}
const schema = { // [!code ++]
	type: "object", // [!code ++]
	properties: { // [!code ++]
		title: { type: "string" }, // [!code ++]
		color: { type: "string" }, // [!code ++]
		tags: { type: "array", items: { type: "string" } }, // [!code ++]
		category: { enum: ["A", "B", "C"] }, // [!code ++]
	}, // [!code ++]
	required: ["title", "color"], // [!code ++]
}; // [!code ++]

export default {
	shapeSize: 300,
	shapePayload: schema, // [!code ++]
	shapeBuilder: shapeBuilder,
}

function shapeBuilder(data, Template) {
	// ...
}
```

This schema would require the node payload to have a `name` and `color` property and optionally a `tags` and `category` property.
A valid payload would look like this:

```json
{
	"title": "My Node",
	"color": "#9575cd",
	"tags": ["tag1", "tag2"],
	"category": "A"
}
```

## Playground

<CodePreview :graph="graph" editor-language="javascript" :editor-content="editorContent" @editorContentChange="editorContentChange" />

<script setup>
import { ref, onMounted } from "vue";
import CodePreview from "../.vitepress/components/CodePreview.vue";
let graph = ref({
	nodes: [],
	links: [],
	hasUpdate: false,
});

let editorContent = [
	'payload: {',
	'	title: "Hello\\nWorld",',
	'	color: "teal",',
	'},',
].join("\n");

let codeContent = (p) => {
	return [
		'let graph = {',
		'	nodes: [',
		'		{',
		'			id: "node1",',
		'			shape: {',
		'				type: "hexagon",',
		'				scale: 1,',
		'			},',
		'			anchor: {',
		'				type: "soft",',
		'				x: 0,',
		'				y: 0,',
		'			},'
	].join("\n") + 
	p + 
	[
		'		},',
		'	],',
		'	links: []',
		'}',
	].join("\n");
}

function editorContentChange(value) {
	const g = parseGraph(codeContent(value));
	newGraph = g;
	lastChange = Date.now();
	changes = true;
}

function parseGraph(code) {
	var constructorCode = code + "\ngraph;";
	const value = eval(constructorCode);
	return value;
}

let changes = false;
let lastChange = Date.now();
let newGraph = { nodes: [], links: [] };
function updateGraph(g) {
	graph.value.nodes = g.nodes;
	graph.value.links = g.links;
	graph.value.hasUpdate = true;
}

onMounted(() => {
	const g = parseGraph(codeContent(editorContent));
	updateGraph(g);
	setInterval(() => {
		if (changes && Date.now() - lastChange > 1000) {
			updateGraph(newGraph);
			changes = false;
		}
	}, 100);
})
</script>
