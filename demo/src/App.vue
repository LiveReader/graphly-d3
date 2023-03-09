<template>
	<div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0">
		<GraphlyD3
			ref="graphly"
			:dark="theme == 'dark'"
			:env-gravity="0"
			@environment-click="envClick"
			@node-click="nodeClick"
			@node-double-click="nodeDoubleClick"
			@link-drag-end="linkDragEnd"
			@theme-change="themeChange"
		/>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { Event, ForceSimulation, Graph, Node } from "@livereader/graphly-d3";
import GraphlyD3 from "@livereader/graphly-d3/component/vue3";
import "@livereader/graphly-d3/style.css";

import demoData from "./demo-data.json";
import DemoTemplate from "./templates/demo_template";

const graphly = ref<any>(null);
const simulation = computed<ForceSimulation>(() => graphly.value.simulation);
let graph: Graph = {
	nodes: [],
	links: [],
};
onMounted(() => {
	simulation.value.templateStore.add("demo_template", DemoTemplate as any);
	graph = demoData.graph as unknown as Graph;
	simulation.value.render(graph);

	simulation.value.on("template:demo_template:age-click", (data, event, age) => {
		console.log(age);
		event.stopPropagation();
	});
	simulation.value.on(Event.NodeDragStart, (e, d, pos) => {
		// create a new link when holding the alt key down
		if (e.sourceEvent.altKey) return "newlink";
	});
});

function envClick() {
	simulation.value.selectedNodes = [];
}
function nodeClick(e: any, d: Node) {
	simulation.value.selectedNodes = [d.id];
}
function nodeDoubleClick(e: any, d: Node) {
	graph.nodes = graph.nodes.filter((n) => n.id !== d.id);
	simulation.value.render(graph);
}
function linkDragEnd(e: any, source: Node, target: Node, pos: { x: number; y: number }) {
	if (target) {
		const link = {
			source: source.id,
			target: target.id,
		};
		graph.links.push(link);
		simulation.value.render(graph);
	}
}
function themeChange(theme: "light" | "dark") {
	console.log(theme);
}

</script>
