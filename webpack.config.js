/* eslint-disable no-console */
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { spawn } = require("child_process");

const SRC_DIR = path.resolve(__dirname, "src");

const OUTPUT_DIR = path.resolve(__dirname, "build");

module.exports = {
	target: "electron-renderer",

	entry: path.join(SRC_DIR, "/client/main.jsx"),

	output: {
		path: OUTPUT_DIR,
		filename: "bundle.js",
	},

	devServer: {
		contentBase: OUTPUT_DIR,
		stats: {
			colors: true,
			chunks: false,
			children: false,
		},
		before () {
			spawn("electron", [path.join("build", "main_process.js")], {
				shell: true,
				env: process.env,
				stdio: "inherit",
			})
				.on("close", () => process.exit(0))
				.on("error", console.error);
		},
	},

	plugins: [
		new HtmlWebpackPlugin({
			template: "./src/index.html",
			inject: "body",
		}),
	],

	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader",
				},
			},
			{
				test: /\.(css|scss)$/,
				use: [
					{
						loader: "style-loader",
					},
					{
						loader: "css-loader",
						options: {
							modules: false,
							importLoaders: 1,
							sourceMap: true,
							minimize: true,
						},
					},
					{ loader: "sass-loader" },
				],
			},
			{
				test: /\.(?:png|jpg|svg)$/,
				loader: "url-loader",
			},
		],
	},
};
