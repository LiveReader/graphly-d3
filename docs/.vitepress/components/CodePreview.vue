<template>
	<div class="codePreview" :style="{ height: props.height }">
		<Graphly class="graphly" :graph="props.graph" />
		<MonacoEditor
			class="monaco-editor"
			:editor-language="props.editorLanguage"
			:editor-content="props.editorContent"
			@editorContentChange="(value) => emits('editorContentChange', value)"
		/>
	</div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from "vue";
import Graphly from "../components/Graphly.vue";
import MonacoEditor from "../components/MonacoEditor.vue";

const props = defineProps({
	height: {
		type: String,
		default: "75vh",
	},
	graph: {
		type: Object,
		default: () => ({
			nodes: [],
			links: [],
			hasUpdate: false,
		}),
	},
	editorLanguage: {
		type: String,
		default: "javascript",
	},
	editorContent: {
		type: String,
		default: "function a(t) { console.log(t) }",
	},
});

const emits = defineEmits(["editorContentChange"]);
</script>

<style scoped>
.codePreview {
	border-radius: 1em;
	background-color: var(--vp-custom-block-info-bg);
}
.codePreview .graphly {
	margin: 0;
	border-top-right-radius: 1em;
	border-top-left-radius: 1em;
	height: 50%;
	background-color: unset !important;
	border-bottom: 2px solid var(--vp-custom-block-info-border) !important;
	border-bottom-left-radius: 0;
	border-bottom-right-radius: 0;
}
.codePreview .monaco-editor {
	border-bottom-right-radius: 1em;
	border-bottom-left-radius: 1em;
	height: 50%;
}
</style>
