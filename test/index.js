const path = require('path')

/* 进到 demo目录 */
process.chdir(path.resolve(__dirname, '../demo'))

describe('webpack-builder test case', () => {
  require('./unit/webpack-base-test')
})
