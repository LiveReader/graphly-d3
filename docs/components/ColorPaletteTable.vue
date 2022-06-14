<script setup>
import ColorPalette from "./ColorPalette.vue";

const props = defineProps({
	palettes: {
		type: Array,
		default: () => [],
		validator: (value) => value["title"] && value["primaryColor"] && value["colors"],
	},
});
</script>

<template>
	<!-- all colorPalettes next to each other -->
	<div class="color-palettes">
		<ColorPalette
			v-for="(item, index) in palettes"
			:key="index"
			:title="item.title"
			:primaryColor="item.primaryColor"
			:colors="item.colors"
		/>
	</div>
</template>

<style>
.color-palettes {
	display: flex;
	align-items: center;
}
</style>
