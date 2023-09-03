import fs from "fs";
import path from "path";
import { defineConfig, type Plugin } from "vite";
import vue from "@vitejs/plugin-vue";
import dts from "vite-plugin-dts";

export default defineConfig({
	plugins: [vue(), dts({ insertTypesEntry: true, rollupTypes: true }), mdts()],
	build: {
		lib: {
			entry: {
				main: path.resolve(__dirname, "lib/main.ts"),
				"component-vue3": path.resolve(__dirname, "components/vue3/index.ts"),
			},
			name: "Graphly D3",
			formats: ["es", "cjs"]
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

function mdts(): Plugin {
	let distPath: string;
	return {
		name: "vite:dmts",
		configResolved(getResolvedConfig) {
			const resolvedConfig = getResolvedConfig;
			distPath = path.join(resolvedConfig.root, resolvedConfig.build.outDir, resolvedConfig.base);
		},
		writeBundle() {
			const files = fs.readdirSync(distPath);
			for (const file of files) {
				if (file.endsWith(".d.ts")) {
					const filePath = path.join(distPath, file);
					const content = fs.readFileSync(filePath, "utf-8");
					fs.writeFileSync(filePath.replace(".d.ts", ".d.mts"), content);
				}
			}
		},
	};
}
