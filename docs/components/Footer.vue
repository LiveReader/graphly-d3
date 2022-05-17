<template>
	<div style="margin-top: 2em; margin-bottom: 1em">
		<div style="margin-top: 7vh; text-align: center">
			<span justify="center" no-gutters>
				<button
					v-for="item in navigationItems"
					:key="item.path"
					flat
					:ripple="false"
					variant="plain"
					class="button"
					style="margin: 1em; background-color: transparent; color: var(--c-text-light-1); font-size: 1em"
					@click="nav(item)"
				>
					{{ item.name }}
				</button>
				<div>&copy; {{ new Date().getFullYear() }} — <strong>LiveReader</strong></div>
			</span>
		</div>
	</div>
</template>

<script setup>
const navigationItems = [
	{
		name: "Home Page",
		url: "http://livereader.com",
	},
	{
		name: "Legal Notice",
		url: "http://livereader.com/legal-notice",
	},
];

function nav(item) {
	window.location.href = item.url;
}
</script>

<style lang="scss" scoped>
footer {
	transition-duration: 0.28s;
	transition-property: box-shadow, opacity, background;
	transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
.button {
	border-radius: 0;
	border-bottom: 2px solid;
	border-color: transparent;
	padding: 4px;
	&:hover {
		border-bottom: 2px solid var(--c-brand);
	}
}
</style>
