const path = require('path')
const Dotenv = require('dotenv-webpack')

module.exports = {
	plugins: [
		new Dotenv()
	],
	entry: "./build/src/server.js",
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'build'),
	},
	resolve: {
		extensions: ['.webpack.js', '.web.js', '.ts', '.js'],
		fallback: {
			"fs": false,
			"tls": false,
			"net": false,
			"path": false,
			"zlib": false,
			"http": false,
			"https": false,
			"stream": false,
			"crypto": false,
			"constants": false,
			"child_process": false,
			"os": require.resolve("os-browserify/browser") 
		}
	},
	module: {
		rules: [{
			test: /\.ts$/, 
			loader: 'ts-loader'
		}]
	},
}
