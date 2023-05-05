<template>
	<div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0">
		<GraphlyD3
			v-show="rendering == 'simulation'"
			ref="graphly"
			:dark="theme == 'dark'"
			:env-gravity="0"
			@environment-click="envClick"
			@node-click="nodeClick"
			@node-double-click="nodeDoubleClick"
			@link-drag-end="linkDragEnd"
			@theme-change="themeChange"
		/>
		<svg v-show="rendering == 'render'" :class="theme" style="width: 100%; height: 100%">
			<g id="render-template"></g>
		</svg>
	</div>
	<div v-if="showConfig" class="config" :class="{ dark: theme == 'dark' }">
		<svg-icon
			style="cursor: pointer; display: block; margin: auto; margin-right: 0"
			type="mdi"
			:path="mdiThemeLightDark"
			:color="theme == 'dark' ? 'white' : 'black'"
			:size="24"
			@click="theme = theme == 'dark' ? 'light' : 'dark'"
		/>
		<div class="group">
			<h3>Rendering</h3>
			<button @click="() => (rendering = 'simulation')">Simulation</button>
			<button @click="() => (rendering = 'render')">Render Template</button>
		</div>
		<div class="group">
			<h3>Settings</h3>
			<input v-model="padding" type="number" placeholder="padding" />
			<input v-model="duration" type="number" placeholder="duration (ms)" />
		</div>
		<div class="group">
			<h3>Move</h3>
			<input v-model="transformX" type="number" placeholder="x" class="third" />
			<input v-model="transformY" type="number" placeholder="y" class="third" />
			<input v-model="transformK" type="number" placeholder="k" class="third" />
			<button @click="moveToTransform">Move</button>
		</div>
		<div class="group">
			<h3>Bounds</h3>
			<input v-model="boundsX" type="number" placeholder="x" class="half" />
			<input v-model="boundsY" type="number" placeholder="y" class="half" />
			<input v-model="boundsW" type="number" placeholder="width" class="half" />
			<input v-model="boundsH" type="number" placeholder="height" class="half" />
			<button @click="moveToBounds">Move</button>
		</div>
		<div class="group">
			<h3>Utils</h3>
			<button @click="showNodes">Show Nodes</button>
			<button @click="includeNodes">Include Nodes</button>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import SvgIcon from "@jamescoyle/vue-icon";
import { mdiThemeLightDark } from "@mdi/js";
import { Event, ForceSimulation, renderTemplate, Graph, Node } from "@livereader/graphly-d3";
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
const rendering = ref("simulation");
const showConfig = ref(false);
const theme = ref("dark");
const padding = ref(0);
const duration = ref(1000);

const transformX = ref(0);
const transformY = ref(0);
const transformK = ref(1);

const boundsX = ref(0);
const boundsY = ref(0);
const boundsW = ref(0);
const boundsH = ref(0);

onMounted(async () => {
	const render = await renderTemplate(
		DemoTemplate,
		{
			id: "n0",
			shape: {
				type: "demo_template",
				scale: 1,
			},
			anchor: {
				type: "soft",
				x: 0,
				y: 0,
			},
			payload: {
				status: "immediate",
				name: {
					first: "Emily",
					last: "Hardy",
				},
				sex: "female",
				age: 23,
				accessibility: "freely accessibile",
				tags: ["unconscious", "diabetes", "breathing", "pulse weak", "injury: head"],
			},
		},
		{ theme: "light", scale: 1 }
	);
	document.getElementById("render-template")!.appendChild(render);
	document.getElementById("render-template")!.setAttribute("transform", "translate(500, 400) scale(1)");

	showConfig.value = true;
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

function moveToTransform() {
	simulation.value.moveTo({
		padding: padding.value,
		duration: duration.value,
		transform: {
			x: transformX.value,
			y: transformY.value,
			k: transformK.value,
		},
	});
}
function moveToBounds() {
	simulation.value.moveTo({
		padding: padding.value,
		duration: duration.value,
		boundaries: [
			{
				x: boundsX.value,
				y: boundsY.value,
				width: boundsW.value,
				height: boundsH.value,
			},
		],
	});
}
function showNodes() {
	simulation.value.moveTo({
		padding: padding.value,
		duration: duration.value,
		nodes: graph.nodes,
	});
}
function includeNodes() {
	simulation.value.moveTo({
		padding: padding.value,
		duration: duration.value,
		boundaries: [simulation.value.worldBounds],
		nodes: graph.nodes,
	});
}
</script>
