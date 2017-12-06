import React from 'react';
import { Link, IndexLink } from 'react-router';
import '../Style/style.scss'

// 定义Footer组件
// 增加 this.props.children 用来渲染子组件
export default class Footer extends React.Component {
	constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="list">
        <div className="footer">
            <ul role="nav" className="nav">
              <li><IndexLink to="/" activeClassName="active">账户总览</IndexLink></li>
              <li><Link to="/page1" activeClassName="active">借款企业</Link></li>
            </ul>
        </div>
        {this.props.children}
      </div>
    );
  }
  componentDidMount () {
    console.log(this.props.children)
  }
}