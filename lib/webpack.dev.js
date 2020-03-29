const merge = require('webpack-merge')
const baseConfig = require('./webpack.base')

const devConfig = merge(baseConfig, {
  mode: 'development',
  devtool: 'source-map',
  devServer: {
    contentBase: './dist',
    stats: 'errors-only'
  }
})

module.exports = devConfig
