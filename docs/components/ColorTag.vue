<template>
	<div
		style="padding: 10px; border-radius: 16px; width=100%; text-align: center;"
		:style="{ backgroundColor: bgcolor, color: color }"
	>
		{{ text }}
	</div>
</template>

<script setup>
const props = defineProps({
	bgcolor: { type: String, default: "#ffffff" },
	color: { type: String, default: "#101213" },
	text: { type: String, default: "" },
});
</script>
