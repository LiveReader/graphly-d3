import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";

export default defineConfig({
	plugins: [vue()],
	resolve: {
		alias: {
			"@": resolve(__dirname, "src"),
		},
	},
	build: {
		lib: {
			entry: resolve(__dirname, "src/index.ts"),
			name: "Graphly D3 Vue",
			fileName: (format) => `graphly-d3-vue.${format}.js`,
		},
		rollupOptions: {
			external: ["vue", "@livereader/graphly-d3"],
			output: {
				globals: {
					vue: "vue",
					"@livereader/graphly-d3": "@livereader/graphly-d3",
				},
			},
		},
	},
});
