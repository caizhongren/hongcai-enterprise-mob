import React, {Component, PropTypes} from 'react';
import {IndexLink, Link } from 'react-router';
import {connect} from 'react-redux';
import template from './template'
import '../../Style/comm.scss'
/*=================
  FooterView.jsx 子组件
==================*/
class FooterView extends Component{
    constructor(props){
        super(props);
    }
    render(){
        return(
          <div className="footer">
            <ul role="nav" className="nav">
              <li><IndexLink to="/" activeClassName="active">账户总览</IndexLink></li>
              <li><Link to="/about" activeClassName="active">借款企业</Link></li>
            </ul>
          </div>
        )
    }
    shouldComponentUpdate(nextProps, nextState){
       return  true;
    }
}
export default template({
  id:'',
  url:'',
  subscribeData:[],
  component:FooterView
})


