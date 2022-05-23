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

function setMetaTag(name, content) {
	if (document.querySelector(`meta[name="${name}"]`)) {
		document.querySelector(`meta[name="${name}"]`).setAttribute("content", content);
	} else {
		const meta = document.createElement("meta");
		meta.setAttribute("name", name);
		meta.setAttribute("content", content);
		document.head.appendChild(meta);
	}
}

setMetaTag("twitter:card", "summary_large_image");
setMetaTag("twitter:title", "Graphly D3 Docs – a graph visualization library");
setMetaTag(
	"twitter:description",
	"Graphly D3 is an open source frontend library for creating conplex and interactive graph visualizations. It is built on top of D3.js and empowers developers to use svg to display any data in a simple and intuitive way."
);
setMetaTag("twitter:image", "https://graphly-d3.livereader.com/graphly-d3-icon-dark.png");

setMetaTag("og:url", "https://graphly-d3.livereader.com/");
setMetaTag("og:title", "Graphly D3 Docs – a graph visualization library");
setMetaTag(
	"og:description",
	"Graphly D3 is an open source frontend library for creating conplex and interactive graph visualizations. It is built on top of D3.js and empowers developers to use svg to display any data in a simple and intuitive way."
);
setMetaTag("og:image", "https://graphly-d3.livereader.com/graphly-d3-icon-dark.png");
</script>
