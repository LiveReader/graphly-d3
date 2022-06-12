import { defineConfig } from "vite";
import monacoEditorPlugin from "vite-plugin-monaco-editor";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		// https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vite-plugin
		monacoEditorPlugin(),
	],
	define: { "process.env": {} },
	// resolve: {
	// 	alias: {
	// 		"@": path.resolve(__dirname, "src"),
	// 	},
	// },
	/* remove the need to specify .vue files https://vitejs.dev/config/#resolve-extensions
  resolve: {
    extensions: [
      '.js',
      '.json',
      '.jsx',
      '.mjs',
      '.ts',
      '.tsx',
      '.vue',
    ]
  },
  */
});
