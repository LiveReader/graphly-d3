const path = require("path");

module.exports = {
	mode: "production",
	entry: "./src/ForceSimulation.js",
	output: {
		path: path.resolve("src"),
		filename: "ForceSimulation.js",
		libraryTarget: "commonjs2",
	},
	module: {
		rules: [
			{
				test: /\.js?$/,
				exclude: /(node_modules)/,
				use: "babel-loader",
			},
		],
	},
	resolve: {
		extensions: [".js", ".css"],
	},
};
