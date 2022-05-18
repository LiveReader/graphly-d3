<template>
	<div class="monacoEditor"></div>
</template>

<script setup>
import { ref, watch, onMounted, defineProps, defineEmits } from "vue";
import * as monaco from "monaco-editor";

const props = defineProps({
	editorLanguage: {
		type: String,
		default: "javascript"
	},
	editorContent: {
		type: String,
		default: ""
	}
});

const emits = defineEmits(["editorContentChange"]);

let theme = ref("dark");
const editorLightTheme = {
	base: "vs",
	inherit: true,
	rules: [],
	colors: {
		"editor.background": "#00000000",
		"minimap.background": "#00000010"
	}
};
const editorDarkTheme = {
	base: "vs-dark",
	inherit: true,
	rules: [],
	colors: {
		"editor.background": "#00000000",
		"minimap.background": "#00000010"
	}
};

onMounted(() => {
	monaco.editor.defineTheme("light", editorLightTheme);
	monaco.editor.defineTheme("dark", editorDarkTheme);

	const editor = monaco.editor.create(document.getElementsByClassName("monacoEditor")[0], {
		value: props.editorContent,
		language: props.editorLanguage,
		automaticLayout: true,
		theme: theme.value,
	});

	editor.onDidChangeModelContent(() => {
		emits("editorContentChange", editor.getValue());
	});

	const themeObserver = new MutationObserver(() => {
		theme.value = document.getElementsByTagName("html")[0].getAttribute("color-mode");
		monaco.editor.setTheme(theme.value);
	});
	themeObserver.observe(document.getElementsByTagName("html")[0], { attributes: true });
});

watch(
	() => props.editorContent,
	newValue => {
		editor.setValue(newValue);
	}
);
watch(
	() => props.editorLanguage,
	newValue => {
		editor.setModel(monaco.editor.createModel(props.editorContent, newValue));
	}
);
</script>

<style scoped>
.monacoEditor {
	width: 100%;
	height: 100%;
}
</style>
