import React, {Component, PropTypes} from 'react';
import {History, Link } from 'react-router';
import {connect} from 'react-redux';
import template from './common/template'
import Toasting from './Toasting'

/*=================
  Login.jsx 子组件
==================*/
class About extends Component{
    constructor(props){
        super(props);
    }
    componentDidMount () {
       this.props.hideFooter()
    }
    render(){
        const {fData} = this.props;
        // const {footerData} = this.props;
        let items;
        if(fData.data.data){
             items = (fData.data.data.stories.map((item,index)=>{
                  return <ListItem key={index} {...item} index = {item}/>
             }))
         }
        return(
            <div id='login'>
                <form action="">
                    <input type="number" placeholder="请输入您的手机号"/>
                    <input type="text" placeholder="请输入您的密码"/>
                </form>
                <Toasting/>
            </div>
        )
    }
    shouldComponentUpdate(nextProps, nextState){
       return  true;
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
  subscribeData:['fData','increaseData','decreaseData', 'footerData'],
  component:About
})
