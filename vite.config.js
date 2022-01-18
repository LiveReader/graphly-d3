import { defineConfig } from "vite";
import { resolve } from "path";

module.exports = defineConfig({
	build: {
		lib: {
			entry: resolve(__dirname, "lib/main.js"),
			name: "Graphly D3",
			fileName: (format) => `main.${format}.js`,
		},
	},
});
