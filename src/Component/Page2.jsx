import React, {Component, PropTypes} from 'react';
import {History, Link } from 'react-router';
import {connect} from 'react-redux';
import template from './common/template'
import Loading from './Loading'
import BottonView from './BottonView'
import fetch from 'isomorphic-fetch'
import Footer from './common/footer'

/*=================
  Page2.jsx 子组件
==================*/
class Page2 extends Component{
    constructor(){
        super();
    }
    render(){
        const {fData} = this.props;
        let items;
        if(fData.data.data){
             console.log(fData);
             items = (fData.data.data.stories.map((item,index)=>{
                  return <ListItem key={index} {...item} index = {item}/>
             }))
         }
        return(
            <div id='Page2'>
                <BottonView/>
                <div className='page-head'>
                  <p className="lesson-3" onClick={this.getSome}>page2 component</p>
                  <div className='test-data'>
                    <p>来着index页面的 </p>
                    <span>加数据:{this.props.increaseData.get('count')}</span>
                    <span>减数据:{this.props.decreaseData.get('count')}</span>
                  </div>
                  <Link className='link_page2' to='/'>link to index</Link>
                </div>
                {
                  items
                }
                <Footer/>
            </div>
        )
    }
    shouldComponentUpdate(nextProps, nextState){
       return  true;
    }
    getSome () {
        let url = '/hongcai/rest/projects?page=1&pageSize=5&type=5'
        fetch(url)
          .then(function(response) {
              if (response.status >= 400) {
                  throw new Error("Bad response from server");
              }
              return response.json();
          })
          .then(function(data){
              // 这里延时只是为了演示效果，实际开发中需要把延时去掉
              setTimeout(function(){
                  // 数据请求成功 再派发一个 getData  action
                //   return dispatch(dispathData('getData',data));
              },3000);
           })
          .catch(function(error) {
              console.log('Request failed', error)
          });
    }
}
class ListItem extends Component{
    constructor(){
        super();
    }
    render(){
        let {title ,images ,index} = this.props;
        var imgUrl = {background:'url('+images[0]+') no-repeat center'}
        return(
            <div id='ListItem'>
              <p>{title}</p>
              <div className='item-img' style={imgUrl}></div>
            </div>
        )
    }
}
export default template({
  id:'',
  url:'/getData',
  subscribeData:['fData','increaseData','decreaseData'],
  component:Page2
})
