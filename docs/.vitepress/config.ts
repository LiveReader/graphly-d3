import fs from "fs";

const title = "Graphly D3";
const description = "Open source library to create outstanding graph visualizations with ease.";
const socialImgURL = "https://docs.graphly.dev/social-banner.png";
const tiwtterImgURL = "https://docs.graphly.dev/twitter-banner.png";

export default {
	lang: "en-US",
	title: "Graphly D3 Docs",
	description: "Documentation for the Graphly D3 library",
	head: [
		["meta", { name: "author", content: "Jason Rietzke – LiveReader" }],
		[
			"meta",
			{
				name: "keywords",
				content:
					"visualization, graphly-d3, d3, svg, graph, data-driven-design, d3-visualization, vue, vue-component",
			},
		],
		["meta", { property: "og:title", content: title }],
		["meta", { property: "og:description", content: description }],
		["meta", { property: "og:url", content: "https://docs.graphly.dev/" }],
		["meta", { property: "og:image", content: socialImgURL }],
		["meta", { name: "twitter:title", content: title }],
		["meta", { name: "twitter:description", content: description }],
		["meta", { name: "twitter:image", content: tiwtterImgURL }],
		["meta", { name: "twitter:card", content: "summary_large_image" }],
	],
	lastUpdated: true,
	themeConfig: {
		siteTitle: "Graphly D3",
		logo: "/icons/graphly-d3-icon.svg",
		nav: [
			{ text: "Guide", link: "/guide/introduction/_what_is_graphly_d3", activeMatch: "/guide/" },
			{ text: "Data Structure", link: "/data-structure/", activeMatch: "/data-structure/" },
			{ text: "Simulation API", link: "/simulation-api/", activeMatch: "/simulation-api/" },
			{ text: "Template API", link: "/template-api/", activeMatch: "/template-api/" },
			{ text: "Components", link: "/components/vue3/", activeMatch: "/components/" },
			{
				text: "More",
				items: [
					{
						items: [
							{ text: "Changelog", link: "/CHANGELOG", activeMatch: "/CHANGELOG" },
							{ text: "Render Template", link: "/render-template/", activeMatch: "/render-template" },
							{ text: "Troubleshooting", link: "/troubleshooting/", activeMatch: "/troubleshooting" },
						],
					},
					{
						text: "LiveReader",
						items: [
							{ text: "Home Page", link: "https://livereader.com/" },
							{ text: "Legal Notice", link: "https://livereader.com/legal-notice" },
							{ text: "Privacy Policy", link: "https://livereader.com/privacy-policy" },
						],
					},
				],
			},
		],
		socialLinks: [
			{ icon: "discord", link: "https://discord.gg/NdtkFFRuXa" },
			{ icon: "twitter", link: "https://twitter.com/LiveReaderCom" },
			{ icon: "linkedin", link: "https://www.linkedin.com/company/livereader-gmbh" },
			{ icon: "github", link: "https://github.com/livereader/graphly-d3" },
		],
		sidebar: {
			"/guide/": [
				sidebarItem("Introduction", "/guide/introduction/")![0],
				sidebarItem("Tutorials", "/guide/tutorials/")![0],
			],
			"/data-structure/": sidebarItem("Data Structure", "/data-structure/"),
			"/simulation-api/": sidebarItem("Simulation API", "/simulation-api/"),
			"/template-api/": sidebarItem("Template API", "/template-api/"),
			"/components/": [sidebarItem("Vue 3", "/components/vue3/")![0]],
		},
		footer: {
			message: "Graphly D3 Documentation",
			copyright: `Copyright © ${new Date().getFullYear()} LiveReader GmbH`,
		},
	},
};

function sidebarItem(title: string, route: string) {
	const filesPath = __dirname + "/.." + route;
	const files = fs.readdirSync(filesPath);
	const items: { index: number; text: string; link: string }[] = [];
	for (const file of files) {
		if (fs.statSync(filesPath + "/" + file).isDirectory() || !file.endsWith(".md")) return;
		const fileName = file.split(".")[0];
		const index = fileName === "index" ? -1 : 0;
		const words = file.split(".")[0].split("_");
		const title = words.map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
		items.push({
			index,
			text: fileName === "index" ? "Introduction" : title,
			link: route + (fileName === "index" ? "" : fileName),
		});
	}
	items.sort((a, b) => a.index - b.index);
	return [
		{
			text: title,
			items: items,
		},
	];
}
