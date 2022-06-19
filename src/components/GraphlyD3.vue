<template>
	<div class="gly-container">
		<svg ref="svg" :class="{ dark: props.dark }"></svg>
		<slot></slot>
	</div>
</template>

<script setup lang="ts">
import { ref, Ref, onMounted, watch } from "vue";
import { Event, ForceSimulation, Node, Link } from "@livereader/graphly-d3";
import "@livereader/graphly-d3/style.css";

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
	"nodeClick",
	"nodeDoubleClick",
	"nodeContextMenu",
	"nodeDragStart",
	"nodeDragMove",
	"nodeDragEnd",

	"linkClick",
	"linkDoubleClick",
	"linkContextMenu",
	"linkDragStart",
	"linkDragMove",
	"linkDragEnd",

	"environmentClick",
	"environmentDoubleClick",
	"environmentContextMenu",
	"environmentMove",

	"simulationTick",
	"simulationTickEnd",
]);

defineExpose({
	simulation: simulation,
});

onMounted(() => {
	simulation.value = new ForceSimulation(svg.value);

	simulation.value.templateStore.remoteOrigin = props.remoteOrigin;
	simulation.value.selectedNodes = props.selectedNodes;
	simulation.value.envGravity = props.envGravity;
	simulation.value.linkDistance = props.linkDistance;
	simulation.value.animationDuration = props.animationDuration;
	simulation.value.draggableNodes = props.draggableNodes;
	simulation.value.zoomEnabled = props.zoomEnabled;
	simulation.value.zoomScaleExtent = [props.zoomScaleExtent[0], props.zoomScaleExtent[1]];

	simulation.value.on(Event.NodeClick, (e: any, node: Node) => emit("nodeClick", e, node));
	simulation.value.on(Event.NodeDoubleClick, (e: any, node: Node) => emit("nodeDoubleClick", e, node));
	simulation.value.on(Event.NodeContextMenu, (e: any, node: Node) => emit("nodeContextMenu", e, node));
	simulation.value.on(Event.NodeDragStart, (e: any, node: Node, position: { x: number; y: number }) =>
		emit("nodeDragStart", e, node, position)
	);
	simulation.value.on(Event.NodeDragMove, (e: any, node: Node, position: { x: number; y: number }) =>
		emit("nodeDragMove", e, node, position)
	);
	simulation.value.on(Event.NodeDragEnd, (e: any, node: Node, position: { x: number; y: number }) =>
		emit("nodeDragEnd", e, node, position)
	);

	simulation.value.on(Event.LinkClick, (e: any, link: Link) => emit("linkClick", e, link));
	simulation.value.on(Event.LinkDoubleClick, (e: any, link: Link) => emit("linkDoubleClick", e, link));
	simulation.value.on(Event.LinkContextMenu, (e: any, link: Link) => emit("linkContextMenu", e, link));
	simulation.value.on(Event.LinkDragStart, (e: any, sourceNode: Node, position: { x: number; y: number }) =>
		emit("linkDragStart", e, sourceNode, position)
	);
	simulation.value.on(Event.LinkDragMove, (e: any, sourceNode: Node, position: { x: number; y: number }) =>
		emit("linkDragMove", e, sourceNode, position)
	);
	simulation.value.on(
		Event.LinkDragEnd,
		(e: any, sourceNode: Node, targetNode: Node, position: { x: number; y: number }) =>
			emit("linkDragEnd", e, sourceNode, targetNode, position)
	);

	simulation.value.on(Event.EnvironmentClick, (e: any, position: { x: number; y: number }) =>
		emit("environmentClick", e, position)
	);
	simulation.value.on(Event.EnvironmentDoubleClick, (e: any, position: { x: number; y: number }) =>
		emit("environmentDoubleClick", e, position)
	);
	simulation.value.on(Event.EnvironmentContextMenu, (e: any, position: { x: number; y: number }) =>
		emit("environmentContextMenu", e, position)
	);
	simulation.value.on(Event.EnvironmentMove, (transform: { x: number; y: number; k: number }) =>
		emit("environmentMove", transform)
	);

	simulation.value.on(Event.SimulationTick, () => emit("simulationTick"));
	simulation.value.on(Event.SimulationTickEnd, () => emit("simulationTickEnd"));
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

<style scoped lang="scss">
.gly-container {
	width: 100%;
	height: 100%;
	svg {
		width: 100%;
		height: 100%;
	}
}
</style>
