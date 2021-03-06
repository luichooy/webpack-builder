const path = require('path')
const glob = require('glob-all')
const webpack = require('webpack')
const merge = require('webpack-merge')
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const cssnano = require('cssnano')

const SpeedMeasureWebpackPlugin = require('speed-measure-webpack-plugin')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
// const UglifyjsPlugin = require('uglifyjs-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin')
const PurgecssWebpackPlugin = require('purgecss-webpack-plugin')

const baseConfig = require('./webpack.base')
const { projectRootDir } = require('./util')

const smp = new SpeedMeasureWebpackPlugin()
const PATH = {
  src: path.resolve(projectRootDir, './src')
}

const prodConfig = merge(baseConfig, {
  mode: 'production',
  // stats: 'errors-only',
  plugins: [
    new PurgecssWebpackPlugin({
      paths: glob.sync(`${PATH.src}/**/*`, { nodir: true })
    }),
    new OptimizeCssAssetsWebpackPlugin({
      assetNameRegExp: /\.css$/,
      cssPorcessor: cssnano
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false
    }),
    new HardSourceWebpackPlugin()
    // new webpack.DllReferencePlugin({
    //   manifest: require(path.resolve(projectRootDir, './build/vendor/vendor.json'))
    // })
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
    },
    minimize: true,
    minimizer: [
      new TerserPlugin({
        cache: true,
        parallel: true
      })
    ]
  }
})

module.exports = smp.wrap(prodConfig)
