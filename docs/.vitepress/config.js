import fs from "fs";

module.exports = {
	lang: "en-US",
	title: "Graphly D3 Docs",
	description: "Documentation for the Graphly D3 library",
	themeConfig: {
		siteTitle: "Graphly D3",
		logo: "/icons/graphly-d3-icon-dark-round.svg",
		nav: [
			{ text: "Introduction", link: "/" },
			{ text: "Tutorial", link: "/tutorial/" },
			{ text: "Data Structure", link: "/data-structure/" },
			{ text: "Simulation API", link: "/simulation-api/" },
			{ text: "Template API", link: "/template-api/" },
			{
				text: "LiveReader",
				items: [
					{
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
			{ icon: "twitter", link: "https://twitter.com/LiveReaderCom" },
			{ icon: "linkedin", link: "https://www.linkedin.com/company/livereader-gmbh" },
			{ icon: "github", link: "https://github.com/livereader/graphly-d3" },
		],
		sidebar: {
			"/tutorial/": sidebarItem("Tutorial", "/tutorial/"),
			"/data-structure/": sidebarItem("Data Structure", "/data-structure/"),
			"/simulation-api/": sidebarItem("Simulation API", "/simulation-api/"),
			"/template-api/": sidebarItem("Template API", "/template-api/"),
		},
		footer: {
			message: "Graphly D3 Documentation",
			copyright: `Copyright © ${new Date().getFullYear()} LiveReader GmbH`,
		},
	},
};

function sidebarItem(title, route) {
	const path = __dirname + "/.." + route;
	const files = fs.readdirSync(path);
	const items = [];
	for (const file of files) {
		if (fs.statSync(path + "/" + file).isDirectory() || !file.endsWith(".md")) return;
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
