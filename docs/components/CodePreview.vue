<template>
	<div class="codePreview">
		<Graphly class="graphly" :graph="props.graph" />
		<MonacoEditor class="monaco-editor" />
	</div>
</template>

<script setup>
import { ref, onMounted, defineProps, defineEmits } from "vue";
import Graphly from "../components/Graphly.vue";
import MonacoEditor from "../components/MonacoEditor.vue";

const props = defineProps({
	graph: {
		type: Object,
		default: () => ({
			nodes: [],
			links: [],
			hasUpdate: false,
		}),
	},
});
</script>

<style scoped>
.codePreview {
	height: 75vh;
	border-radius: 1em;
	background-color: var(--c-divider-light);
}
.codePreview .graphly {
	border-top-right-radius: 1em;
	border-top-left-radius: 1em;
	height: 50%;
}
.codePreview .monaco-editor {
	border-bottom-right-radius: 1em;
	border-bottom-left-radius: 1em;
	height: 50%;
}
</style>
