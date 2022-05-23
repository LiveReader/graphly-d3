<template>
	<Layout>
		<template #navbar-search>
			<ThemeSwitcher />
		</template>
		<template #page-bottom>
			<Footer />
		</template>
	</Layout>
</template>

<script setup>
import DefaultTheme from "vitepress/theme";
import ThemeSwitcher from "./ThemeSwitcher.vue";
import Footer from "./Footer.vue";
const { Layout } = DefaultTheme;
</script>
