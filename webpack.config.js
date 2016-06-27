const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = [
	{
		entry: {
			"wysiwyg-text-input": __dirname + "/dist/js/wysiwyg-text-input.es6"
		},
		output: {
			path: __dirname + "/bin/",
			filename: "[name].js"
		},
		module: {
			loaders: [
				{
					test: /\.es6$/,
					loader: "babel-loader",
					exclude: /node_modules/,
					query: {
						presets: ["es2015", "stage-0"]
					}
				}
			]
		}
	},
	{
		entry: {
			"wysiwyg-text-input": __dirname + "/dist/sass/wysiwyg-text-input.scss"
		},
		output: {
			path: __dirname + "/bin/",
			filename: "[name].css"
		},
		module: {
			loaders: [
				{
					test: /\.css$/,
					loader: ExtractTextPlugin.extract("style-loader", "css-loader")
				},
				{
					test: /\.scss$/,
					loader: ExtractTextPlugin.extract("style-loader", "css-loader!sass-loader")
				}
			]
		},
		plugins: [
			new ExtractTextPlugin("[name].css")
		]
	}
];