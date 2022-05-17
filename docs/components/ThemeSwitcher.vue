<template>
	<img
		class="theme-icon"
		:src="themeSelection == 'light' ? lightTheme : themeSelection == 'dark' ? darkTheme : deviceTheme"
		style="padding-left: 16px"
		@click="switchTheme"
	/>
</template>

<script setup>
import { ref, onMounted } from "vue";
import deviceTheme from "../assets/icons/theme-light-dark.svg";
import lightTheme from "../assets/icons/white-balance-sunny.svg";
import darkTheme from "../assets/icons/weather-night.svg";

let themeSelection = ref("device");
let theme = ref("light");

function switchTheme() {
	switch (themeSelection.value) {
		case "light":
			themeSelection.value = "dark";
			break;
		case "dark":
			themeSelection.value = "device";
			break;
		case "device":
			themeSelection.value = "light";
			break;
		default:
			themeSelection.value = "device";
			break;
	}
	localStorage.setItem("themeSelection", themeSelection.value);
	setTheme();
}

function setTheme() {
	switch (themeSelection.value) {
		case "light":
			theme.value = "light";
			break;
		case "dark":
			theme.value = "dark";
			break;
		default:
			theme.value = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
			break;
	}
	document.documentElement.setAttribute("color-mode", theme.value);
}

onMounted(() => {
	themeSelection.value = localStorage.themeSelection || "device";
	window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (event) => {
		if (themeSelection.value === "device") {
			setTheme();
		}
	});
	setTheme();
});
</script>

<style lang="scss" scoped>
:root[color-mode="dark"] .theme-icon {
	filter: invert(100%);
}
</style>
