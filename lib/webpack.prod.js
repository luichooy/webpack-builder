const merge = require('webpack-merge')
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const cssnano = require('cssnano')
const SpeedMeasureWebpackPlugin = require('speed-measure-webpack-plugin')
const baseConfig = require('./webpack.base')

const smp = new SpeedMeasureWebpackPlugin()

const prodConfig = merge(baseConfig, {
  mode: 'production',
  stats: 'errors-only',
  plugins: [
    new OptimizeCssAssetsWebpackPlugin({
      assetNameRegExp: /\.css$/,
      cssPorcessor: cssnano
    })
  ],
  optimization: {
    splitChunks: {
      minSize: 0,
      cacheGroups: {
        commons: {
          name: 'commons',
          chunks: 'all',
          minChunks: 2
        }
      }
    }
  }
})

module.exports = smp.wrap(prodConfig)
