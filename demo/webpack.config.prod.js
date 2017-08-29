const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
//const CleanWebpackPlugin = require('clean-webpack-plugin');

const outputPath = path.resolve(__dirname, '..', 'docs');

module.exports = {
  context: __dirname,
  entry: './index.js',
  output: {
    path: outputPath,
    publicPath: '',
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        use: ['babel-loader'],
        exclude: /node_modules/
      }
    ]
  },
  devtool: 'cheap-module-source-map',
  plugins: [
    //new CleanWebpackPlugin(outputPath),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false
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
