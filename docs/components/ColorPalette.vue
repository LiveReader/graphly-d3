<script setup>
import Hexagon from "./Hexagon.vue";
import ColorTag from "./ColorTag.vue";

const props = defineProps({
	title: { type: String, default: "" },
	primaryColor: { type: String, default: "#000000" },
	colors: { type: Array, default: () => [], validator: (value) => value["color"] && value["name"] },
});
</script>

<template>
	<div class="color-palette">
		<Hexagon :color="primaryColor" :title="title" />
		<div v-for="(item, index) in colors" :key="index" style="width=100%; margin: 10px;">
			<ColorTag :bgcolor="item.color" :color="item.textColor" :text="item.name" />
		</div>
	</div>
</template>

<style>
.color-palette {
	align-items: center;
	margin: 10px;
	font-family: "roboto", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans",
		"Helvetica Neue", sans-serif;
}
</style>
