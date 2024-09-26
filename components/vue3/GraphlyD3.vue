<template>
	<div class="gly-container" style="width: 100%; height: 100%;">
		<svg ref="svg" style="width: 100%; height: 100%" :class="{ dark: props.dark }"></svg>
	</div>
</template>

<script setup lang="ts">
import { ref, Ref, onMounted, watch } from "vue";
import { Event, ForceSimulation, Node, Link } from "../../lib/main";
import "../../lib/styles/style.scss";

let svg = ref<SVGSVGElement>();
let simulation: Ref<ForceSimulation | null> = ref(null);

const props = defineProps({
	dark: {
		type: Boolean,
		default: false,
	},
	remoteOrigin: {
		type: String,
		default: "",
	},
	selectedNodes: {
		type: Array<string>,
		default: () => [],
	},
	envGravity: {
		type: Number,
		default: -10_000,
	},
	linkDistance: {
		type: Number,
		default: 400,
	},
	animationDuration: {
		type: Number,
		default: 300,
	},
	draggableNodes: {
		type: Boolean,
		default: true,
	},
	zoomEnabled: {
		type: Boolean,
		default: true,
	},
	zoomScaleExtent: {
		type: Array<number>,
		default: () => [0.1, 3],
	},
});

const emit = defineEmits([
	"node-click",
	"node-double-click",
	"node-context-menu",
	"node-drag-start",
	"node-drag-move",
	"node-drag-end",

	"link-click",
	"link-double-click",
	"link-context-menu",
	"link-drag-start",
	"link-drag-move",
	"link-drag-end",

	"environment-click",
	"environment-double-click",
	"environment-context-menu",
	"environment-move",
	"theme-change",

	"simulation-tick",
	"simulation-tick-end",
]);

defineExpose({
	simulation: simulation,
});

onMounted(() => {
	if (!svg.value) return;
	simulation.value = new ForceSimulation(svg.value);

	simulation.value.templateStore.remoteOrigin = props.remoteOrigin;
	simulation.value.selectedNodes = props.selectedNodes;
	simulation.value.envGravity = props.envGravity;
	simulation.value.linkDistance = props.linkDistance;
	simulation.value.animationDuration = props.animationDuration;
	simulation.value.draggableNodes = props.draggableNodes;
	simulation.value.zoomEnabled = props.zoomEnabled;
	simulation.value.zoomScaleExtent = [props.zoomScaleExtent[0], props.zoomScaleExtent[1]];

	simulation.value.on(Event.NodeClick, (e: any, node: Node) => emit("node-click", e, node));
	simulation.value.on(Event.NodeDoubleClick, (e: any, node: Node) => emit("node-double-click", e, node));
	simulation.value.on(Event.NodeContextMenu, (e: any, node: Node) => emit("node-context-menu", e, node));
	simulation.value.on(Event.NodeDragStart, (e: any, node: Node, position: { x: number; y: number }) =>
		emit("node-drag-start", e, node, position)
	);
	simulation.value.on(Event.NodeDragMove, (e: any, node: Node, position: { x: number; y: number }) =>
		emit("node-drag-move", e, node, position)
	);
	simulation.value.on(Event.NodeDragEnd, (e: any, node: Node, position: { x: number; y: number }) =>
		emit("node-drag-end", e, node, position)
	);

	simulation.value.on(Event.LinkClick, (e: any, link: Link) => emit("link-click", e, link));
	simulation.value.on(Event.LinkDoubleClick, (e: any, link: Link) => emit("link-double-click", e, link));
	simulation.value.on(Event.LinkContextMenu, (e: any, link: Link) => emit("link-context-menu", e, link));
	simulation.value.on(Event.LinkDragStart, (e: any, sourceNode: Node, position: { x: number; y: number }) =>
		emit("link-drag-start", e, sourceNode, position)
	);
	simulation.value.on(Event.LinkDragMove, (e: any, sourceNode: Node, position: { x: number; y: number }) =>
		emit("link-drag-move", e, sourceNode, position)
	);
	simulation.value.on(
		Event.LinkDragEnd,
		(e: any, sourceNode: Node, targetNode: Node, position: { x: number; y: number }) =>
			emit("link-drag-end", e, sourceNode, targetNode, position)
	);

	simulation.value.on(Event.EnvironmentClick, (e: any, position: { x: number; y: number }) =>
		emit("environment-click", e, position)
	);
	simulation.value.on(Event.EnvironmentDoubleClick, (e: any, position: { x: number; y: number }) =>
		emit("environment-double-click", e, position)
	);
	simulation.value.on(Event.EnvironmentContextMenu, (e: any, position: { x: number; y: number }) =>
		emit("environment-context-menu", e, position)
	);
	simulation.value.on(Event.EnvironmentMove, (transform: { x: number; y: number; k: number }) =>
		emit("environment-move", transform)
	);
	simulation.value.on(Event.ThemeChange, (theme: "light" | "dark") => emit("theme-change", theme))

	simulation.value.on(Event.SimulationTick, () => emit("simulation-tick"));
	simulation.value.on(Event.SimulationTickEnd, () => emit("simulation-tick-end"));
});

watch(
	() => props.remoteOrigin,
	() => {
		if (!simulation.value) return;
		simulation.value.templateStore.remoteOrigin = props.remoteOrigin;
	}
);
watch(
	() => props.selectedNodes,
	() => {
		if (!simulation.value) return;
		simulation.value.selectedNodes = props.selectedNodes;
	}
);
watch(
	() => props.envGravity,
	() => {
		if (!simulation.value) return;
		simulation.value.envGravity = props.envGravity;
	}
);
watch(
	() => props.linkDistance,
	() => {
		if (!simulation.value) return;
		simulation.value.linkDistance = props.linkDistance;
	}
);
watch(
	() => props.animationDuration,
	() => {
		if (!simulation.value) return;
		simulation.value.animationDuration = props.animationDuration;
	}
);
watch(
	() => props.draggableNodes,
	() => {
		if (!simulation.value) return;
		simulation.value.draggableNodes = props.draggableNodes;
	}
);
watch(
	() => props.zoomEnabled,
	() => {
		if (!simulation.value) return;
		simulation.value.zoomEnabled = props.zoomEnabled;
	}
);
watch(
	() => props.zoomScaleExtent,
	() => {
		if (!simulation.value) return;
		simulation.value.zoomScaleExtent = [props.zoomScaleExtent[0], props.zoomScaleExtent[1]];
	}
);
</script>
