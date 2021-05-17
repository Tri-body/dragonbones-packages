'use strict'
const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const portfinder = require('portfinder')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')

const devWebpackConfig = merge(baseWebpackConfig, {
  mode: 'development',
  entry: './src/index',
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: '[name].js',
    chunkFilename: '[name].js',
    publicPath: '/'
  },
  // cheap-module-eval-source-map is faster for development
  devtool: '#@source-map',

  // these devServer options should be customized in /config/index.js
  devServer: {
    clientLogLevel: 'warning',
    historyApiFallback: true,
    hot: true,
    compress: true,
    host: process.env.HOST || '0.0.0.0',
    port: process.env.PORT || 8000,
    open: true,
    overlay: {
      warnings: false,
      errors: true,
    },
    publicPath: '/',
    // proxy: ,
    quiet: true, // necessary for FriendlyErrorsPlugin
    watchOptions: {
      poll: false,
    }
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
    new webpack.NoEmitOnErrorsPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(__dirname, '../index.html'),
      chunksSortMode: 'dependency',
      inject: true
    }),
    new CaseSensitivePathsPlugin()
  ]
})

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = process.env.PORT || 8000
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      // add port to devServer config
      devWebpackConfig.devServer.port = port

      // Add FriendlyErrorsPlugin
      devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
        compilationSuccessInfo: {
          messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`],
        },
        onErrors: function () {
          const notifier = require('node-notifier')
          return (severity, errors) => {
            if (severity !== 'error') {
              return
            }
            const error = errors[0]
            const filename = error.file && error.file.split('!').pop()
            notifier.notify({
              title: pkg.name,
              message: severity + ': ' + error.name,
              subtitle: filename || '',
              // icon: path.join(__dirname, 'logo.png')
            })
          }
        }
      }))

      resolve(devWebpackConfig)
    }
  })
})