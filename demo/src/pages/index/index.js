import '@/assets/styles/iconfont.css'
import '@/assets/styles/index.less'
import { common } from '@/common' // eslint-disable-line
import logo from '@/assets/images/logo.jpg'

document.write(`
  <div class="root">
    <div class="webpack-greeting">Hello, Webpack!</div>
    <i class="iconfont el-icon-adm-access"></i>
    <span>图标字体</span>
    <img src="${logo}" />
  </div>
`)
