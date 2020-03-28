const webpack = require('webpack')
const merge = require('webpack-merge')
const baseConfig = require('./webpack.base')

const devConfig = merge(baseConfig, {
  mode: 'development',
  devtool: 'source-map',
  devServer: {
    contentBase: './dist',
    hot: true,
    stats: 'errors-only'
  },
  plugins: [new webpack.HotModuleReplacementPlugin()]
})

module.exports = devConfig
