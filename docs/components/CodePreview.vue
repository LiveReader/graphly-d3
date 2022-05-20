<template>
	<div class="codePreview">
		<Graphly class="graphly" :graph="props.graph" />
		<MonacoEditor
			class="monaco-editor"
			:editor-language="props.editorLanguage"
			:editor-content="props.editorContent"
			@editorContentChange="(value) => emits('editorContentChange', value)"
		/>
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
