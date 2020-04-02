##  webpack入口
入口文件位于 `node_modules/webpack/bin/webpack.js`

webpack 入口文件做的事：

判断 `webpack-cli`和 `webpack-command`是否安装:

如果一个都没有安装，则引导用户安装 `webpack-cli`；

如果安装其中一个，则引入改 cli，然后执行；

如果安装两个，则提示用户删除其中一个。

```javascript
const runCommand = (command, args) => {
   /**
    *  执行命令 在此处执行的是
    *  npm install -D webpack-cli 或者 yarn add -D webpack-cli
    *  npm install -D webpack-command 或者 yarn add -D webpack-command
    */
}

const isInstalled = packageName => {
  // 判断给定的 包是否已经安装
}

const CLIs = [
  {
    name: "webpack-cli",
    package: "webpack-cli",
    installed: isInstalled("webpack-cli"),
    recommended: true,
    ...
  },
  {
    name: "webpack-command",
    package: "webpack-command",
    installed: isInstalled("webpack-command"),
    recommended: false,
    ...
  }
]
```

##  webpack-cli 做的事情
*   引入 yargs，对命令行进行定制
*   分析命令行参数，对各个参数进行转换，组成编译配置项
*   引用 webpack，根据配置项进行编译和构建
