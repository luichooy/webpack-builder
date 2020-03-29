const glob = require('glob-all')

describe('Checking js & css files generated', () => {
  it('should generate js & css files', done => {
    const files = glob.sync([
      './dist/index_*.js',
      './dist/static/index_*.css',
      './dist/search_*.js',
      './dist/static/search_*.css'
    ])

    if (files.length > 0) {
      done()
    } else {
      throw new Error('no js & css files generated')
    }
  })
})
