<template>
	<svg id="graphly" height="100%" width="100%"></svg>
</template>

<script setup>
import { defineProps, defineEmits, onMounted, ref, watch } from "vue";

import "@livereader/graphly-d3/style.css";

let d3 = ref(null);
let ForceSimulation = ref(null);
let simulation = ref(null);

function init() {
	const svg = props.svg ? d3.value.select(props.svg) : d3.value.select("#graphly");
	simulation.value = new ForceSimulation.value(svg);
	simulation.value.setTemplateOrigin(window.location.protocol + "//" + window.location.host + "/templates/");
	simulation.value.setWorldBoundaries(props.worldBoundaries.height, props.worldBoundaries.width);
	simulation.value.setLinkDistance(props.linkDistance);
	simulation.value.setGravity(props.gravity);
	simulation.value.draggableNodes(props.draggableNodes);
	simulation.value.onNewEdge((source, target) => {
		emits("new-edge", source, target);
	});
	simulation.value.onEdgeClick((e, d) => {
		emits("edge-click", e, d);
	});
	simulation.value.onBackground((e, pos) => {
		emits("background", e, pos);
	});
	simulation.value.onClick((e, d) => {
		emits("click", e, d);
	});
	simulation.value.onDoubleClick((e, d) => {
		emits("double-click", e, d);
	});
	simulation.value.onContextClick((e, d) => {
		emits("context-click", e, d);
	});
	simulation.value.onDragStart((e, d, pos) => {
		emits("drag-start", e, d, pos);
	});
	simulation.value.onDragged((e, d) => {
		emits("dragged", e, d);
	});
	simulation.value.onDragEnd((e, d, pos) => {
		emits("drag-end", e, d, pos);
	});
	simulation.value.onMove((transform) => {
		emits("move", transform);
	});
	simulation.value.render(props.graph);
	// eslint-disable-next-line vue/no-mutating-props
	props.graph.hasUpdate = false;
}

const props = defineProps({
	graph: {
		type: Object,
		default: () => ({ nodes: [], links: [], hasUpdate: false }),
		validator(value) {
			return value.nodes && value.links;
		},
	},
	worldBoundaries: {
		type: Object,
		default: () => ({}),
	},
	gravity: {
		type: Number,
		default: -5000,
	},
	linkDistance: {
		type: Number,
		default: 250,
	},
	zoomBoundaries: {
		type: Array,
		default: () => [0.1, 3],
	},
	draggableNodes: {
		type: Boolean,
		default: true,
	},
	selected: {
		type: Array,
		default: () => [],
	},
	svg: {
		type: Object,
		default: () => null,
	},
});
const emits = defineEmits([
	"new-edge",
	"edge-click",
	"background",
	"click",
	"double-click",
	"context-click",
	"drag-start",
	"dragged",
	"drag-end",
	"move",
]);
onMounted(async () => {
	d3.value = await import("d3");
	const GraphlyAPI = await import("@livereader/graphly-d3");
	ForceSimulation.value = GraphlyAPI.ForceSimulation;
});
watch(
	() => d3,
	() => {
		if (d3.value != null && ForceSimulation.value != null) {
			init();
		}
	}
);
watch(
	() => ForceSimulation.value,
	() => {
		if (d3.value != null && ForceSimulation.value != null) {
			init();
		}
	}
);
watch(
	() => props.graph,
	() => {
		if (d3.value == null || ForceSimulation.value == null) return;
		if (props.graph.hasUpdate) {
			simulation.value.render(props.graph);
			// eslint-disable-next-line vue/no-mutating-props
			props.graph.hasUpdate = false;
		}
	},
	{
		deep: true,
	}
);
watch(
	() => props.worldBoundaries,
	() => {
		if (d3.value == null || ForceSimulation.value == null) return;
		simulation.value.setWorldBoundaries(props.worldBoundaries.height, props.worldBoundaries.width);
	}
);
watch(
	() => props.selected,
	() => {
		if (d3.value == null || ForceSimulation.value == null) return;
		for (let i = 0; i < props.graph.nodes.length; i++) {
			simulation.value.selectNode(props.graph.nodes[i].id, false);
		}
		for (let i = 0; i < props.selected.length; i++) {
			simulation.value.selectNode(props.selected[i]);
		}
	}
);
watch(
	() => props.gravity,
	() => {
		if (d3.value == null || ForceSimulation.value == null) return;
		simulation.value.setGravity(props.gravity);
	}
);
watch(
	() => props.linkDistance,
	() => {
		if (d3.value == null || ForceSimulation.value == null) return;
		simulation.value.setLinkDistance(props.linkDistance);
	}
);
watch(
	() => props.zoomBoundaries,
	() => {
		if (d3.value == null || ForceSimulation.value == null) return;
		simulation.value.setZoomBoundaries(props.zoomBoundaries[0], props.zoomBoundaries[1]);
	}
);
watch(
	() => props.draggableNodes,
	() => {
		if (d3.value == null || ForceSimulation.value == null) return;
		simulation.value.draggableNodes(props.draggableNodes);
	}
);
</script>

<style scoped></style>
