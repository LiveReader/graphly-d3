<template>
	<svg ref="graphlyEL" id="graphly" height="100%" width="100%"></svg>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, onMounted, ref, watch } from "vue";
import "@livereader/graphly-d3/style.css";
import { ForceSimulation, Graph, Node } from "@livereader/graphly-d3";

let theme = ref("dark");
let graphlyEL = ref(null);
let simulation: ForceSimulation;

const props = defineProps({
	graph: {
		type: Object,
		default: () => ({ nodes: [], links: [], hasUpdate: false }),
		validator(value: any) {
			return value.nodes && value.links;
		},
	},
});
onMounted(async () => {
	theme.value = document.getElementsByTagName("html")[0].classList.contains("dark") ? "dark" : "light";
	simulation = new ForceSimulation(graphlyEL.value);
	simulation.templateStore.remoteOrigin = window.location.protocol + "//" + window.location.host + "/templates/";
	simulation.envGravity = -5000;
	simulation.linkDistance = 250;
	simulation.render(props.graph as Graph);

	const themeObserver = new MutationObserver(() => {
		theme.value = document.getElementsByTagName("html")[0].classList.contains("dark") ? "dark" : "light";
	});
	if (!graphlyEL.value) return;
	(graphlyEL.value as HTMLElement).classList.toggle("dark", theme.value === "dark");
	themeObserver.observe(document.getElementsByTagName("html")[0], { attributes: true });
});
watch(
	() => props.graph,
	() => {
		if (props.graph.hasUpdate) {
			simulation.render(props.graph as Graph);
			// eslint-disable-next-line vue/no-mutating-props
			props.graph.hasUpdate = false;
		}
	},
	{
		deep: true,
	}
);
</script>

<style scoped></style>
