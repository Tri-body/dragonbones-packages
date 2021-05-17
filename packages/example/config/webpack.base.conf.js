'use strict'
const path = require('path')

module.exports = {
  target: 'web',
  context: path.resolve(__dirname, '../'),
  resolve: {
    extensions: ['.ts', '.js', '.json']
  },
  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              // transpileOnly: true
            }
          }
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10,
          name: 'static/img/[name].[hash:8].[ext]'
        }
      },
      {
        test: /\.xml$/,
        loader: 'url-loader',
        options: {
          limit: 10,
          name: 'static/data/[name].[hash:8].[ext]'
        }
      },
      {
        test: /\.zip$/,
        loader: 'url-loader',
        options: {
          limit: 10,
          name: 'static/bin/[name].[hash:8].[ext]'
        }
      }
    ]
  }
}
