const assert = require('assert')

describe('webpack-base.js test case', () => {
  const baseConfig = require('../../lib/webpack.base')

  it('entry test', () => {
    assert.equal(baseConfig.entry.index.indexOf('webpack-builder/demo/src/pages/index/index.js') > -1, true)
    assert.equal(baseConfig.entry.search.indexOf('webpack-builder/demo/src/pages/search/index.js') > -1, true)
  })
})
