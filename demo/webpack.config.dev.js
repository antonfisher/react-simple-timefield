const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

const outputPath = path.join(__dirname, 'build-dev');

module.exports = {
  mode: 'development',
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
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      hash: true,
      inject: true,
      template: 'index.html'
    })
  ],
  devtool: 'inline-source-map',
  devServer: {
    contentBase: outputPath
  }
};
