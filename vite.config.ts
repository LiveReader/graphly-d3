import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";

export default defineConfig({
	plugins: [vue()],
	resolve: {
		alias: {
			"@": resolve(__dirname, "lib"),
		},
	},
	build: {
		lib: {
			entry: {
				main: resolve(__dirname, "lib/main.ts"),
				"component-vue3": resolve(__dirname, "components/vue3/index.ts"),
			},
			name: "Graphly D3",
			fileName: (format, name) => `${name}.${format}.js`,
		},
		minify: false,
		rollupOptions: {
			external: ["d3", "ajv", "vue"],
			output: {
				globals: {
					d3: "d3",
					ajv: "ajv",
					vue: "vue",
				},
			},
		},
	},
});
