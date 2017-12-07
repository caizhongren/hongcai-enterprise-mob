import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import template from './common/template'
/*=================
  ToastView.jsx 子组件
==================*/
class ToastView extends Component{
    constructor(props){
        super(props);
    }
    render(){
        let{toastData} = this.props;
        let toastingStyle;
        if(toastData.toast){
          toastingStyle = {
              opacity: 1
          }
        }else{
          toastingStyle = {
                opacity: 0
          }
        }
        return(
            <div id='ToastView' style={toastingStyle}>
                {this.props.errMsg}
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
  subscribeData:['toastData'],
  component:ToastView
})
