const assert = require('assert')

describe('webpack-base.js test case', () => {
    const baseConfig = require('../../lib/webpack.base')
    
    it('entry test', () => {
        assert.equal(baseConfig.entry.index, '/Users/luichooy/Documents/luichooy-code/webpack/webpack-builder/demo/src/pages/index/index.js')
        assert.equal(baseConfig.entry.search, '/Users/luichooy/Documents/luichooy-code/webpack/webpack-builder/demo/src/pages/search/index.js')
    })
})
