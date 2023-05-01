---
title: Playground
lang: en-US
---

# Playground

Give it a try and see how the different properties influence the appearance and behavior of graph.

::: tip
Add, change or remove nodes and links to immediately see the changes in the preview.
:::

<CodePreview :graph="graph" editor-language="javascript" :editor-content="editorContent" @editorContentChange="editorContentChange" />

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
import CodePreview from "../../.vitepress/components/CodePreview.vue";
let graph = ref({
	nodes: [],
	links: [],
	hasUpdate: false,
});

let editorContent = [
	'let graph = {',
	'	nodes: [',
	'		{',
	'			id: "node1",',
	'			shape: {',
	'				type: "hexagon",',
	'				scale: 1,',
	'				url: "https://cdn.graphly.dev/@jason-rietzke/demo-hexagon/1.0.0",',
	'			},',
	'			x: -150,',
	'			y: 30,',
	'			anchor: {',
	'				type: "soft",',
	'				x: -150,',
	'				y: 30,',
	'			},',
	'			payload: {',
	'				title: "Hello\\nWorld",',
	'				color: "teal",',
	'			},',
	'		},',
	'		{',
	'			id: "node2",',
	'			shape: {',
	'				type: "hexagon",',
	'				scale: 1,',
	'				url: "https://cdn.graphly.dev/@jason-rietzke/demo-hexagon/1.0.0",',
	'			},',
	'			x: 150,',
	'			y: -30,',
	'			payload: {',
	'				title: "",',
	'				color: "#9575cd",',
	'			},',
	'		},',
	'	],',
	'	links: [',
	'		{',
	'			source: "node1",',
	'			target: "node2",',
	'			type: "solid",',
	'			directed: true,',
	'			label: "",',
	'			strength: "weak",',
	'		},',
	'	],',
	'}',
].join("\n");

function editorContentChange(value) {
	const g = parseGraph(value);
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
	const g = parseGraph(editorContent);
	updateGraph(g);
	setInterval(() => {
		if (changes && Date.now() - lastChange > 1000) {
			updateGraph(newGraph);
			changes = false;
		}
	}, 100);
})
</script>
