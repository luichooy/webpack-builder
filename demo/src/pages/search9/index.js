import '@babel/polyfill'
import logo from '@/assets/images/logo.jpg'
import React from 'react'
import ReactDom from 'react-dom'
import { common } from '@/common'
import { greet } from './greet'
import '@/assets/styles/search.scss'

import { cube } from './tree-shaking'

class Search extends React.Component {
  constructor() {
    super()
    this.state = {
      text: null
    }
  }

  loadComponent() {
    import('./dynamic-import.js').then(res => {
      console.log(res)
      this.setState({
        text: res.default
      })
    })
  }

  render() {
    const greeting = greet()
    const { text } = this.state
    return (
      <div className="search">
        {text && <span>{text}</span>}
        <span className="greet">
          搜索内容
          {greeting}
        </span>
        <span>{common()}</span>
        <span>{`cube 3 is ${cube(3)}`}</span>
        <img onClick={this.loadComponent.bind(this)} src={logo} alt="logo" className="logo" />
      </div>
    )
  }
}

ReactDom.render(<Search />, document.getElementById('root'))
