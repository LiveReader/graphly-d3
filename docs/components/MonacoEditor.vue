<template>
	<div class="monacoEditor"></div>
</template>

<script setup>
import { ref, watch, onMounted, defineProps, defineEmits } from "vue";

let monaco = null;

async function init() {
	monaco.editor.defineTheme("light", editorLightTheme);
	monaco.editor.defineTheme("dark", editorDarkTheme);

	self.MonacoEnvironment = {
		getWorkerUrl: function(moduleId, label) {
			if (label === "json") {
				return "/monacoeditorwork/json.worker.bundle.js";
			}
			if (label === "css") {
				return "/monacoeditorwork/css.worker.bundle.js";
			}
			if (label === "html") {
				return "/monacoeditorwork/html.worker.bundle.js";
			}
			if (label === "typescript" || label === "javascript") {
				return "/monacoeditorwork/ts.worker.bundle.js";
			}
			return "/monacoeditorwork/editor.worker.bundle.js";
		}
	};

	const editor = monaco.editor.create(document.getElementsByClassName("monacoEditor")[0], {
		value: props.editorContent,
		language: props.editorLanguage,
		automaticLayout: true,
		theme: theme.value
	});

	editor.onDidChangeModelContent(() => {
		emits("editorContentChange", editor.getValue());
	});

	const themeObserver = new MutationObserver(() => {
		theme.value = document.getElementsByTagName("html")[0].getAttribute("color-mode");
		monaco.editor.setTheme(theme.value);
	});
	themeObserver.observe(document.getElementsByTagName("html")[0], { attributes: true });
}

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

onMounted(async () => {
	theme.value = document.getElementsByTagName("html")[0].getAttribute("color-mode");
	if (!monaco) {
		monaco = await import("monaco-editor");
		setTimeout(async () => {
			init();
		}, 100);
	} else {
		init();
	}
});

watch(
	() => props.editorContent,
	newValue => {
		if (monaco == null) return;
		editor.setValue(newValue);
	}
);
watch(
	() => props.editorLanguage,
	newValue => {
		if (monaco == null) return;
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
