const glob = require('glob-all')

describe('Checking generated HTML files', () => {
    it('should generate HTML files', done => {
        const files = glob.sync([
            './dist/index.html',
            './dist/search.html'
        ])
        
        console.log(files)
        
        if (files.length > 0) {
            done()
        } else {
            throw new Error('no HTML file generated')
        }
    })
})
