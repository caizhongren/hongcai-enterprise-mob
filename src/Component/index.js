import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {History, Link } from 'react-router';
import template from './common/template'
import BottonView from './BottonView'
import "../Style/style.scss"
import fetch from 'isomorphic-fetch'
/*=================
  index.jsx 子组件
==================*/
class Index extends Component{
    constructor(){
        super();
        this.pClick =() =>{
         };
        this.state = {
        }
    }
    render(){
        // 拿到 this.props 参数
        // let dec_count = decreaseData.get('count');
        return(
          <ul className="footer">
            <li onClick={this.fetchData}>账户总览</li>
            <li><Link className='link_page2' to='/page2'>借款项目</Link></li>
          </ul>
        )
    }
    
    componentWillMount() {
      fetch('/hongcai/rest/users/checkSession', {
        method: 'GET',
        mode: 'cors'
      })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
      })
      .then((responseJson) => {
        // console.log(response)
      })
      .catch((error) => {
        console.error(error);
      });
    }

    shouldComponentUpdate(nextProps, nextState){
      console.log('index component::::');
      console.log(nextProps);
       return true;
    }
}
export default template({
  id:'index',
  url:'',
  subscribeData:'', // 对应组件所需要的 this.props 数据
  component:Index
})
