const path = require('path');

let common_config = {
	node: {
		__dirname: false
	},
	module: {
		rules: [ { test: /\.node$/, loader: 'node-loader' } ]
	},
	mode: 'production',
	target: 'node',
	resolve: {
		extensions: [ '.js' ]
	}
};

module.exports = [
	Object.assign({}, common_config, {
		target: 'electron-main',
		entry: './main.js',
		output: {
			filename: 'main.js',
			path: path.resolve(__dirname, 'frontend')
		}
	})
];
