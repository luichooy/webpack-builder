const path = require('path')
const glob = require('glob')
const HtmlWebpackPlugin = require('html-webpack-plugin')

/* 项目当前根目录 */
const projectRootDir = process.cwd()

/*
 *  [
 *    '/Users/luichooy/Documents/luichooy-code/webpack/webpack-builder/src/pages/index/index.js',
 *    '/Users/luichooy/Documents/luichooy-code/webpack/webpack-builder/src/pages/search/index.js'
 *  ]
 */

function getMpaConfig() {
  const entry = {}
  const htmlWebpackPlugins = []

  const pageEntryPath = path.resolve(projectRootDir, './src/pages/**/index.js')

  const pageEntryFiles = glob.sync(pageEntryPath)

  pageEntryFiles.forEach(file => {
    const matched = file.match(/src\/pages\/(.+)\/index\.js$/)
    const entryName = matched && matched[1]

    if (entryName) {
      entry[entryName] = file
      htmlWebpackPlugins.push(
        new HtmlWebpackPlugin({
          template: path.resolve(projectRootDir, `./src/pages/${entryName}/index.html`),
          filename: `${entryName}.html`,
          chunks: ['commons', entryName],
          minify: {
            collapseBooleanAttributes: true, // 移除布尔属性的值
            collapseWhitespace: true,
            minifyJS: true, // 压缩 script 标签中的 js
            minifyCss: true, // 压缩 style 标签中的 css 和内联 css
            removeComments: true
          }
        })
      )
    }
  })

  return {
    entry,
    htmlWebpackPlugins
  }
}

module.exports = {
  projectRootDir,
  getMpaConfig
}
