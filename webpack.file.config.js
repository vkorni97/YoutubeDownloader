const path = require('path');
const webpack = require('webpack');

let common_config = {
	node: {
		__dirname: false
	},
	mode: 'production',
	target: 'node',
	resolve: {
		extensions: [ '.js' ]
	},
	plugins: [
		new webpack.DefinePlugin({
			'process.env.FLUENTFFMPEG_COV': false
		})
	]
};

module.exports = [
	Object.assign({}, common_config, {
		entry: './scripts/modules.js',
		output: {
			filename: 'modules.js',
			path: path.resolve(__dirname, 'src', 'scripts')
		}
	})
];
