import fs from "fs";

module.exports = {
	lang: "en-US",
	title: "Graphly D3 Docs",
	description: "Documentation for the Graphly D3 library",
	themeConfig: {
		repo: "livereader/graphly-d3-docs",
		docsDir: "docs",
		docsBranch: "main",
		editLinks: true,
		editLinkText: "Edit this page on GitHub",
		lastUpdated: "Last Updated",

		nav: [
			{ text: "Introduction", link: "/" },
			{ text: "Tutorial", link: "/tutorial/" },
			{ text: "Data Structure", link: "/data-structure/" },
			{ text: "Simulation API", link: "/simulation-api/" },
			{ text: "Template API", link: "/template-api/" },
		],
		sidebar: {
			"/tutorial/": sidebarItem("Tutorial", "/tutorial/"),
			"/data-structure/": sidebarItem("Data Structure", "/data-structure/"),
			"/simulation-api/": sidebarItem("Simulation API", "/simulation-api/"),
			"/template-api/": sidebarItem("Template API", "/template-api/"),
			"/": sidebarItem("Introduction", "/"),
		},
	},
};

function sidebarItem(title, route) {
	const path = __dirname + "/.." + route;
	const files = fs.readdirSync(path);

	const children = [];
	for (const file of files) {
		if (fs.statSync(path + "/" + file).isDirectory() || !file.endsWith(".md")) return;
		const fileName = file.split(".")[0];
		const index = fileName === "index" ? -1 : 0;
		const words = file.split(".")[0].split("_");
		const title = words.map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
		children.push({
			index: index,
			text: fileName === "index" ? "Introduction" : title,
			link: route + (fileName === "index" ? "" : fileName),
		});
	}
	children.sort((a, b) => a.index - b.index);

	return [
		{
			text: title,
			children: children,
		},
	];
}
