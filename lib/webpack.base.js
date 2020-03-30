const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const { projectRootDir, getMpaConfig } = require('./util')

const { entry, htmlWebpackPlugins } = getMpaConfig()

module.exports = {
  entry,
  output: {
    path: path.resolve(projectRootDir, 'dist'),
    filename: '[name]_[chunkhash:8].js'
  },
  resolve: {
    extensions: ['.js'],
    alias: {
      '@': path.resolve(projectRootDir, './src')
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ['thread-loader', 'babel-loader?cacheDirectory=true']
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader']
      },
      {
        test: /\.less$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'less-loader']
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader']
      },
      {
        test: /\.(png|jpe?g|webp|gif|svg)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: 'static/images/[name]_[hash:8].[ext]',
              limit: 10240
            }
          }
          // {
          //   loader: 'image-webpack-loader',
          //   options: {
          //     mozjpeg: {
          //       progressive: true,
          //       quality: 65
          //     },
          //     // optipng.enabled: false will disable optipng
          //     optipng: {
          //       enabled: false
          //     },
          //     pngquant: {
          //       quality: [0.65, 0.90],
          //       speed: 4
          //     },
          //     gifsicle: {
          //       interlaced: false
          //     },
          //     // the webp option will enable WEBP
          //     webp: {
          //       quality: 75
          //     }
          //   }
          // }
        ]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'static/fonts/[name]_[hash:8].[ext]'
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new FriendlyErrorsWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: 'static/styles/[name]_[contenthash:8].css'
    }),
    function () {
      /*
       * webpack3写法
       * this.plugin(done, stats => {})
       */
      this.hooks.done.tap('done', stats => {
        if (stats.compilation.errors && stats.compilation.errors.length && process.argv.indexOf('--watch') === -1) {
          console.log('build error')
          process.exit(1)
        }
      })
    }
  ].concat(htmlWebpackPlugins)
}
