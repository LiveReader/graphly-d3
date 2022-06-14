<template>
	<div className="graphlyContainer">
		<svg ref="graphlyElement" className="graphly" height="100%" width="100%"></svg>
		<button ref="graphlyMoveTo" className="graphlyMoveTo">
			<span>Show Nodes</span>
			<svg style="width: 24px; height: 24px" viewBox="0 0 24 24">
				<path
					fill="currentColor"
					d="M19,3H15V5H19V9H21V5C21,3.89 20.1,3 19,3M19,19H15V21H19A2,2 0 0,0 21,19V15H19M5,15H3V19A2,2 0 0,0 5,21H9V19H5M3,5V9H5V5H9V3H5A2,2 0 0,0 3,5Z"
				/>
			</svg>
		</button>
	</div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, onMounted, Ref, ref, watch } from "vue";
import "@livereader/graphly-d3/style.css";

let theme = ref("dark");
let graphlyElement: Ref<SVGSVGElement> = ref({} as SVGSVGElement);
let graphlyMoveTo: Ref<HTMLElement> = ref({} as HTMLElement);
let simulation: any;

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
	import("@livereader/graphly-d3").then(({ ForceSimulation }) => {
		theme.value = document.getElementsByTagName("html")[0].classList.contains("dark") ? "dark" : "light";
		simulation = new ForceSimulation(graphlyElement.value);
		simulation.templateStore.remoteOrigin = window.location.protocol + "//" + window.location.host + "/templates/";
		simulation.envGravity = -5000;
		simulation.linkDistance = 250;
		simulation.render(props.graph);

		const themeObserver = new MutationObserver(() => {
			theme.value = document.getElementsByTagName("html")[0].classList.contains("dark") ? "dark" : "light";
			if (!graphlyElement.value) return;
			graphlyElement.value.classList.toggle("dark", theme.value === "dark");
		});
		themeObserver.observe(document.getElementsByTagName("html")[0], { attributes: true });
		if (!graphlyElement.value) return;
		graphlyElement.value.classList.toggle("dark", theme.value === "dark");

		graphlyMoveTo.value.addEventListener("click", () => {
			simulation.moveTo({
				nodes: props.graph.nodes,
				padding: 50,
			});
		});
	});
});
watch(
	() => props.graph,
	() => {
		if (!simulation) return;
		if (props.graph.hasUpdate) {
			simulation.render(props.graph);
			// eslint-disable-next-line vue/no-mutating-props
			props.graph.hasUpdate = false;
		}
	},
	{
		deep: true,
	}
);
</script>

<style scoped>
.graphly {
	position: relative;
	height: 100%;
	width: 100%;
}
.graphlyContainer {
	position: relative;
}
.graphlyMoveTo {
	position: absolute;
	top: 0;
	right: 0;
	padding: 0.3em;
	margin: 0.3em;
	border-radius: 0.6em;
	background-color: var(--vp-c-bg);
	transition: all 0.1s ease-in-out;
}
.graphlyMoveTo span {
	margin: 0 0.3em;
	display: none;
}
.graphlyMoveTo svg {
	display: inline-block;
}
.graphlyMoveTo:hover {
	color: var(--vp-c-white-mute);
	background-color: var(--vp-c-brand);
}
.graphlyMoveTo:hover span {
	margin-right: 0.5em;
	display: inline-block;
}
</style>
