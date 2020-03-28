const merge = require('webpack-merge')
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const cssnano = require('cssnano')
const baseConfig = require('./webpack.base')

const ssrConfig = merge(baseConfig, {
  mode: 'production',
  stats: 'errors-only',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: 'ignore-loader'
      },
      {
        test: /\.less$/,
        use: 'ignore-loader'
      },
      {
        test: /\.scss$/,
        use: 'ignore-loader'
      }
    ]
  },
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

module.exports = ssrConfig
