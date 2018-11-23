const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const outputPath = path.resolve(__dirname, '..', 'docs');

module.exports = {
  mode: 'production',
  context: __dirname,
  entry: './index.js',
  output: {
    publicPath: '',
    path: outputPath,
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ['babel-loader'],
        exclude: /node_modules/
      }
    ]
  },
  devtool: 'cheap-module-source-map',
  plugins: [
    new UglifyJsPlugin({
      parallel: true,
      extractComments: true,
      uglifyOptions: {
        // breaks uglifyjs-webpack-plugin@2.1.7 if isn't set
        compress: {
          inline: true
        }
      }
    }),
    new HtmlWebpackPlugin({
      hash: true,
      inject: true,
      template: 'index.html',
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true
      }
    })
  ]
};
