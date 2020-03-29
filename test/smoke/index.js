const path = require('path')
const webpack = require('webpack')
const rimraf = require('rimraf')
const Mocha = require('mocha')

const mocha = new Mocha({
  timeout: 10000
})

/* 进到 demo 目录 */
process.chdir(path.resolve(__dirname, '../../demo'))

/* 测试前先删除 dist目录 */
rimraf('./dist', () => {
  const prodConfig = require('../../lib/webpack.prod')

  webpack(prodConfig, (err, stats) => {
    if (err) {
      console.error(err)
      process.exit(2)
    } else {
      console.log(
        stats.toString({
          colors: true,
          module: false,
          children: false
        })
      )

      console.log('******Webpack build success, begin running test case.******')

      mocha.addFile(path.resolve(__dirname, './html-test.js'))
      mocha.addFile(path.resolve(__dirname, './js-css-test.js'))

      mocha.run()
    }
  })
})
