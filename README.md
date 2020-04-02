## 自动补全 CSS 前缀

利用 postcss 的插件 autoprefixer

#### install

```shell
npm install postcss-loader autoprefixer -D
```

#### usage

1. 在 **_css-loader_**后面添加**_postcss-loader_**

```javascript
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader']
      }
    ]
  }
}
```

2. 新建 postcss 配置文件 `postcss.config.js`， 使用 `autoprefixer` 插件

```javascript
// postcss.config.js

module.exports = {
  plugins: [require('autoprefixer')]
}
```

3. 新建 `.browserslistrc`

```yaml
// .browserslistrc

> 1%
last 2 versions
not ie <= 8
```

## 每次构建前清理 构建目录

- 通过 npm script 清理构建目录

```shell script
# rm 命令
rm -rf ./dist && webpack

# rimraf 库
rimraf ./dist && webpack
```

- 自动清理构建目录
  使用 `clean-webpack-plugin`

```javascript
const cleanWebpackPlugin = require('clean-webpack-plugin')
module.exports = {
  plugin: [
    new cleanWebpackPlugin()
  ]
}
```

## 代码压缩（html/css/js）

1. webpack4 内置了 `uglifyjs-webpack-plugin`，当 mode 为“production”时，webpack 构建是默认已将 js 压缩过了，所以不用再去处理。但是也可以手动安装`uglifyjs-webpack-plugin`来开启并行压缩。

2. css 压缩使用 `optimize-css-assets-webpack-plugin` 和 `cssnano`

```javascript
// webpack.prod.js

module.exports = {
  plugins: [
    new OptimizeCssAssetsWebpackPlugin({
        assetNameRegExp: /\.css$/,
        cssPorcessor: cssnano
    })
  ]
}
```

3. html 压缩通过给`html-webpack-plugin`插件传入`minify`参数来配置压缩策略。

## html-webpack-plugin

```javascript
new HtmlWebpackPlugin({
  template: path.resolve(__dirname, `./src/pages/index.html`),
  filename: `index.html`,
  chunks: [index],
  minify: {
    collapseBooleanAttributes: true,
    collapseWhitespace: true,
    minifyJS: true,
    minifyCss: true,
    removeComments: true
  }
})
```

#### minify 用法：

- collapseBooleanAttributes: true // 删除布尔属性的属性值，如：

```
<input value=“foo” readonly=“readonly”>
===>
<input value=“foo” readonly>
```

- collapseWhitespace // 删除文档树中多余空格

  [minify 更多详细用法](https://github.com/DanielRuf/html-minifier-terser)

## 静态资源内联

静态资源内联的意义：

- 代码层面
  * 页面框架的初始化脚本
  * 上报相关打点 
  * css 内联避免页面闪动
- 请求层面： 减少 HTTP 网络请求数 \* 小图片或者字体内联（url-loader）

#### HTML 和 JS 内联, 使用 raw-loader

```html
<!--html-webpack-plugin 默认的模板引擎是 ejs，所以可以这样插入-->

<!DOCTYPE html>
<html lang="“en”">
  <head>
    ${require(‘raw-loader!../meta.html’)}
    <title>Search</title>
    <script>
      { require('raw-loader!babel-loader!../../node_modules/lib-flexible/flexible.js')}
    </script>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
```

> ***raw-loader 版本： v0.5.1***

#### CSS 内联

- 方案一： 借助 style-loader
- 方案二：html-inline-css-webpack-plugin

## 代码分割

对于⼤的 Web 应⽤来讲，将所有的代码都放在⼀个⽂件中显然是不够有效的，特别是当你的
某些代码块是在某些特殊的时候才会被使⽤到。webpack 有⼀个功能就是将你的代码库分割成
chunks（语块），当代码运⾏到需要它们的时候再进⾏加载。

适用场景：

- 抽离相同代码到⼀个共享块
- 脚本懒加载，使得初始下载的代码更⼩

### 基础库分离（html-webpack-externals-plugin）

首先，在 `webpack.prod.config.js` 添加配置

```javascript
// webpack.prod.config.js

const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin')
module.exports = {
  plugins: [
    new HtmlWebpackExternalsPlugin({
      externals: [
        {
          module: 'react',
          entry: 'https://cdn.bootcss.com/react/16.13.1/umd/react.production.min.js',
          global: 'React'
        },
        {
          module: 'react-dom',
          entry: 'https://cdn.bootcss.com/react-dom/16.13.1/umd/react-dom.production.min.js',
          global: 'ReactDOM'
        }
      ]
    })
  ]
}
```

然后，在 html 模板中引入分离的基础库脚本

```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="en">
  <head>
    ${require('raw-loader!../meta.html')}
    <title>Search</title>
    <script>
      ${require('raw-loader!babel-loader!../../../node_modules/lib-flexible/flexible.js')}
    </script>
  </head>
  <body>
    <div id="root"></div>
    <script src="https://cdn.bootcss.com/react/16.13.1/umd/react.development.js" type="text/javascript"></script>
    <script src="https://cdn.bootcss.com/react-dom/16.13.1/umd/react-dom.development.js" type="text/javascript"></script>
  </body>
</html>
```

### 利用`SplitChunkplugin`进行公共脚本分离

webpack4 内置`splitChunkPlugin`，替代 webpack3 中常用的 `CommonsChunkPlugin`

```javascript
// webpack.prod.config.js

// 分离第三方基础库
module.exports = {
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /(react|react-dom)/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    }
  }
}

// 分离公共模块
module.exports = {
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
    }
  }
}

// HtmlWebpackPlugin 插件中配置分离出来的公共库
new HtmlWebpackPlugin({
  chunks: ['commons', 'otherChunk']
})
```

chunks 参数说明：

- async 异步引入的库进行分离（默认）
- initial 同步引入的库进行分离
- all 所有引入的库进行分离（推荐）

### 动态代码分割

#### 懒加载 JS 脚本的方式

- commonJS: `require.ensure`
- ES6: 动态 import（目前还没有原生支持，需要 babel 转换）

#### 如何使用动态 import

第一步，安装 babel 插件

```
npm install @babel/plugin-syntax-dynamic-import -D
```

第二步，配置 babel 配置文件

```json
// .babelrc
{
  "plugins": ["@babel/plugin-syntax-dynamic-import"]
}
```

第三步，使用

```
import(filepath).then(res => {
  var variable = res.default
})
```

> 貌似现在 webpack 又默认支持动态 import 了？

## tree shaking

webpack4 中将 mode 设置为“production”将默认启用 tree shaking

#### 哪些代码会被标记为不可用？DCE(Elimination)

- 代码不会执行，不可达到
- 代码执行的结果不会被用到
- 代码只会影响死变量（只写不读）

#### tree shaking 原理

利用 ES6 模块的特点：

- 只能作为模块顶层的语句出现
- import 的模块名只能是字符串常亮
- import binding 是 immutable 的

代码擦除：uglify 阶段删除无用代码

tree shaking 本质是利用编译阶段的静态代码分析，代码是否可用需要在编译阶段就确定下来，所以它只能支持 ES module,而不支持 commonjs，因为 commonjs 模块是动态模块，无法做静态分析。tree shaking 会在编译阶段将无用代码通过添加注释的方式标记出来，然后在 uglify 阶段将这些无用代码删除

## scope hoisting

现象： webpack 打包后存在大量的必报代码，一个模块就是一个闭包,

大量函数闭包包裹代码，导致体积增大（模块越多越明显）

代码运行时创建的函数作用域变多，内存开销变大

#### webpack 模块机制分析

```javascript
;(function(modules) {
  var installModules = {}

  function __webpack_require__(moduleId){
    if(installModules[moduleId]){
      return installModules[moduleId].exports
    }

    var module = installModules[moduleId] = {
      i: moduleId,
      l: false, // 标记模块是否加载
      exports: {}
    }

    modules[moduleId].call(module.exports, module, module.exports,__webpack_require__)
    module.l = true

    return module.exports
  }

  __webpack_require__(0)
})([
  /* 0 module */
  (function(module, __webpack_exports__, __webpack_require__){
    ...
  }),

  /* 1 module */
  (function(module, __webpack_exports__, __webpack_require__){
    ...
  }),


  /* 2 module */
  (function(module, __webpack_exports__, __webpack_require__){
    ...
  })
])
```

```javascript
// 打包后的模块初始化函数

;(function(module, __webpack_exports__, __webpack_require__) {
	'use strict'

	__webpack_require__.r(__webpack_exports__)

  var _x__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1)
  var _y__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2)

  ...
})
```

分析：

- 打包出来的是一个 IIFE（匿名闭包）
- modules 是一个数组，每一项是一个模块初始化函数
- `__webpack_require__`用来加载模块，返回 module.exports
- 通过 WEBPACK_REQUIRE_METHOD(0)启动程序

#### scope hoisting 原理

将所有模块的代码按照引用顺序放在一个函数作用域里，然后适当的重命名一些变量以防止变量名冲突

通过 scope hoisting 可以减少函数申明代码和内存开销

#### 使用

webpack3 手动开启

```javascript
module.exports = {
  plugins: [new webpack.optimize.ModuleConcatenationPlugin()]
}
```

webpack4 mode 为 “production” 默认开启

> 必须是 ES6 模块，cjs 不支持

## ESLint

如何落地：

- 和 CI/CD 系统集成
- 和 webpack 集成

husky + lint-staged

webpack 和 eslint 集成

使用 eslint-loader，构建时检查 JS 规范

## 优化构建时命令行的显示

#### webpack 统计信息 stats

| Preset            | Alternative | Description                    |
| :---------------- | :---------- | :----------------------------- |
| "errors-only"     | none        | 只在发生错误时显示             |
| "minimal"         | none        | 只有发生错误或有新的编译时输出 |
| "none"            | false       | 没有输出                       |
| " normal"         | true        | 标准输出                       |
| "verbose"         | none        | 全部输出                       |
| "detailed"        |             |                                |
| "errors-warnings" |             |                                |

```javascript
// webpack.prod.config.js
module.exports = {
  stats: 'errors-only'
}

// webpack.dev.config.js
module.exports = {
  devServer: {
    stats: 'errors-only'
  }
}
```

#### friendly-errors-webpack-plugin

```javascript
// webpack.config.js

const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
module.exports = {
  plugins: [new FriendlyErrorsWebpackPlugin()]
}
```

>   FriendlyErrorsWebpackPlugin 需要和 stats配合使用

## webpack 错误处理和异常捕获

如何判断构建是否成功

在 CI/CD 的 pipline 或者发布系统需要知道当前的构建状态

每次构建完成后输入 `echo $?`获取错误码

webpack4 之前的版本构建失败不会抛出错误码（error code）

Node.js 中的 process.exit 规范：

- 0 表示成功完成，回调函数中，err 为 null
- 非 0 表示执行失败，回调函数中，err 不为 null,err.code 就是传给 exit 的数字

#### 如何主动捕获并处理构建错误？

webpack 中的 compiler 在每次构建结束后会触发 done 这个 hook, process.exit 主动处理构建报错

```javascript
// webpack.config.js

module.exports = {
  plugins: [
    function() {
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
  ]
}
```

##  如何在 webpack 中分析构建速度和构建体积

####    初级分析： 使用 webpack 内置的 stats
```json
// package.json

{
  "scripts": {
    "build:stats": "webpack --config webpack-prod.js --json > stats.json"
  }  
}
```

####    speed-measure-webpack-plugin
```javascript
// webpack.prod.js

const SpeedMeasureWebpackPlugin = require('speed-measure-webpack-plugin')
const smp = new SpeedMeasureWebpackPlugin()

module.exports = smp.wrap(webpackConfig)
```

####    [webpack-bundle-analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer) 
```javascript
// webpack-prod.js

const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')

module.exports = {
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: 'static', // 在 output.path 中生成 report.html
      openAnalyzer: false // 默认不在浏览器中代开 report.html
    })
  ]
}
```

##  多进程/多实例构建: 资源并行解析
可选方案
*   [thread-loader](https://webpack.docschina.org/loaders/thread-loader/) （webpack4官方推出）
*   [happypack](https://github.com/amireh/happypack) （webpack3常用，目前作者已逐渐放弃维护）
*   parallel-webpack

####    thread-loader 使用

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          'thread-loader',
          'babel-loader'
        ] 
      }
    ]
  }
}
```

未开启 thread-loader 前
```shell script
Hash: 8b06f3065e9325105b25
Version: webpack 4.42.1
Time: 5851ms
```
开启后
```shell script
Hash: 8b06f3065e9325105b25
Version: webpack 4.42.1
Time: 4940ms
```

####  happypack的使用
```javascript
const HappyPack = require('happypack')

module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'happypack/loader'
      }
    ]
  },
  plugins: [
    new HappyPack({
      loaders: ['babel-loader']
    })
  ]
}
```
未开启 happypack 前
```shell script
Hash: 8b06f3065e9325105b25
Version: webpack 4.42.1
Time: 8364ms
```
开启后
```shell script
Hash: 8b06f3065e9325105b25
Version: webpack 4.42.1
Time: 4741ms
```

##  多进程/多实例构建: 并行压缩
*   [webpack-parallel-uglify-plugin](https://github.com/gdborton/webpack-parallel-uglify-plugin)
*   [uglifyjs-webpack-plugin](https://github.com/webpack-contrib/uglifyjs-webpack-plugin)
*   [terser-webpack-plugin](https://github.com/webpack-contrib/terser-webpack-plugin)

`terser-webpack-plugin` 相比 `uglifyjs-webpack-plugin`，多了压缩 es6 的功能

```javascript
// uglifyjs-webpack-plugin 用法相似
const TerserPlugin = require('terser-webpack-plugin')

module.exports = {
  optimization: {
  minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: true
      })
    ]
  }
}
```

##  预编译资源模块
思路： 将第三方基础包和业务基础包打包成一个文件

方法： 使用 DLLPlugin 进行分包，DLLReferencePlugin 对 mainfest.json 引用

使用： `/lib/webpack.dll.js  /lib/webpack.prod.js`

##  缓存
*   babel-loader 开启缓存
*   terser-webpack-plugin 开启缓存
*   使用 cache-loader 或者 hard-source-webpack-plugin

babel-loader
```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ['thread-loader', 'babel-loader?cacheDirectory=true']
      }
    ]
  }
}
```

terser-webpack-plugin
```javascript
const TerserPlugin = require('terser-webpack-plugin')

module.exports = {
  optimization: {
    minimizer: [
      new TerserPlugin({
        cache: true
      })  
   ]
  }
}
```
hard-source-webpack-plugin
```javascript
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin')

module.exports = {
  plugins: [
    new HardSourceWebpackPlugin()
  ]
}
```

##  缩小构建目标
####    babel-loader includes/excludes 等

####    减小文件搜索范围
*   优化 resolve.modules配置 （减小模块搜索层级）
*   优化 resolve.mainFields配置
*   优化 resolve.extension 配置
*   合理使用 alias

```javascript
module.exports = {
  resolve: {
    modules: path.resolve(__dirname, 'node_modules'), // 缩小模块查找范围到 node_modules 目录
    mainFields: ['main'], // 指定项目入口
    extension: ['.js'], // 缩小后缀查找范围
    alias: {
      'react': path.resolve(__dirname, 'node_modules/react/dist/react.min.js')
    } 
  }
}
```

##  缩小构建体积
####    css tree-shaking
*   PurifyCss: 遍历源码，识别已经用的到 css class
*   uncss: 只有html需要通过 jsdom来加载，所有的样式通过 postcss来解析，才能通过 document.querySelector来识别 html文件里面不存在的选择器
*   [pugecss-webpack-plugin](https://github.com/FullHuman/purgecss-webpack-plugin) （需要和 mini-css-extract-plugin 配合使用）
```javascript
// 注意需搭配 mini-css-extract-webpack-plugin 使用
const glob = require('glob-all')
const PurgecssWebpackPlugin = require('purgecss-webpack-plugin')
const PATH = {
  src: path.resolve(__dirname, './src')
}

module.exports = {
  plugins: [
    new PurgecssWebpackPlugin({
      paths: glob.sync(`${PATH.src}/**/*`, { nodir: true })
    })
  ]
}
```

####    图片压缩
*   基于 Node库 imagemin 或者 tinypng API
*   在 webpack中与 imagemin 对应的插件 [image-webpack-loader](https://github.com/tcoopman/image-webpack-loader)

####  动态 polyfill

| 方案 | 优点 | 缺点 | 是否采用 |
| ----- | ---- | ---- | ---- |
| babel-polyfill | react16 官方推荐 | 1. 包体积 200k+，难以抽离 Map,Set 2. 项目里 react是单独引用的 cdn，如果要用它，如果要用它，需要单独构建一份放在 react 前加载 | ❎ |
| babel-plugin-transform-runtime | 只 polyfill 到用到的类或方法 | 不能 polyfill 到原型上的方法，不适用于业务项目的复杂开发环境 | ❎ |
| 自己写 Map, Set 的 polyfill | 定制化高，体积小 | 1. 重复造轮子，容易在日后年久失修成为坑。 2. 即使体积小，依然所有用户都需要加载 | ❎ |
| polyfill-service | 只给用户返回需要的 polyfill，社区维护 | 部分国内奇葩浏览器UA 可能无法识别，（但可以降级返回全部 polyfill） | ✅ |
[es6-shim](https://github.com/paulmillr/es6-shim)

polyfill-service 原理：识别 User-Agent，下发不同的 polyfill

使用：
*   [polyfill.io](https://polyfill.io/v3/)官方提供的服务
*   基于官方自建 polyfill 服务

##  loader
####    loader的执行顺序：
*   多个 loader 串行执行
*   顺序从后到前，从右到左


####   loader执行顺序的原理：
 函数组合的两种情况
*   Unix中的 pipline
*   Compose

webpack采用的就是 Compose：
```javascript
compose = (f, g) => (...args) => f(g(...args))
```

####    loader 开发
*   loader运行时： [loader-runner](https://github.com/webpack/loader-runner)
*   获取 loader options: [loader-utils](https://github.com/webpack/loader-utils)
*   loader options 参数校验： [schema-utils](https://github.com/webpack/schema-utils)

##  冒烟测试
* 构建是否成功
* 每次构建完成 build 目录是否有内容输出
  * 是否有 JS、CSS 等静态资源文件
  * 是否有 HTML 文件


##  npm发布

```$xslt
// 第一步： 登陆 npm
npm login

// 第二步：发布
npm publish --access=public
```

如果在包前面要加作用范围，有两种方式：

第一种是直接在 package.json中修改 name 字段
```json
{
  "name": "@luichooy/webpack-build"
}
```
第二种是初始化项目是使用 npm init 的方式
```$xslt
npm init --scope=usename
```

发包时的版本管理
```shell script
npm version patch

npm version minor

npm version major
```

>   运行 `npm version`时会自动执行 `git tag`命令为本次发布打上标签

##  git commit规范和自动生成 CHANGELOG
```json
// package.json

{
  "scripts": {
    "commitmsg": "validate-commit-message",
    "changelog": "conventional-changelog -p angular -i CHANGELOG.md -s -r 0"
  },
  "devDependencies": {
    "validate-commit-message": "",
    "conventional-changelog-cli": "",
    "husky": ""
  }
}
```

##  semver规范
[semver](https://semver.org/lang/zh-CN/)

