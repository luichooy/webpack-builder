const path = require('path')
const webpack = require('webpack')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

const { projectRootDir } = require('./util')

module.exports = {
  mode: 'production',
  entry: {
    vendor: ['react', 'react-dom']
  },
  output: {
    filename: 'vendor/[name]_[contenthash:8].dll.js',
    path: path.resolve(projectRootDir, './build'),
    library: '[name]'
  },
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.DllPlugin({
      name: '[name]_[hash]',
      path: path.resolve(projectRootDir, './build/vendor/[name].json')
    })
  ]
}
