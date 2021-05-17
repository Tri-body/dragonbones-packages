'use strict'
const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')

let webpackConfig = merge(baseWebpackConfig, {
  mode: 'production',
  devtool: '#source-map',
  entry: './src/index',
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'static/js/[name].[chunkhash:8].js',
    chunkFilename: 'static/js/[id].[chunkhash:8].js',
    publicPath: ''
  },
  optimization: {
    runtimeChunk: 'single',
    concatenateModules: true,
    minimize: true,
  },
  plugins: [
    new CleanWebpackPlugin([
      path.resolve(__dirname, '../dist'),

    ], {
      root: path.resolve(__dirname, '../'),
    }),
    // keep module.id stable when vender modules does not change
    new webpack.HashedModuleIdsPlugin(),
    new webpack.NamedChunksPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(__dirname, '../index.html'),
      chunksSortMode: 'dependency',
      inject: true
    }),
    new CaseSensitivePathsPlugin()
  ]
})

if (process.env.npm_config_report) {
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  webpackConfig.plugins.push(new BundleAnalyzerPlugin({
    analyzerMode: 'static',
    openAnalyzer: false,
    generateStatsFile: false,
    reportFilename: '../dist/report.html'
  }))
}

module.exports = webpackConfig