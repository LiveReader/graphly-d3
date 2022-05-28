import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
	resolve: {
		alias: {
			"@": resolve(__dirname, "lib"),
		},
	},
	build: {
		lib: {
			entry: resolve(__dirname, "lib/main.ts"),
			name: "Graphly D3",
			fileName: (format) => `main.${format}.js`,
		},
		rollupOptions: {
			external: ["d3"],
			output: {
				globals: {
					d3: "d3",
				},
			},
		},
	},
});
