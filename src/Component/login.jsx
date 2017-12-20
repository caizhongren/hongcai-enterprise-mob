import React, {Component, PropTypes} from 'react';
import {Link, browserHistory } from 'react-router';
import { connect } from 'react-redux';
import { is, fromJS} from 'immutable';
import {Tool} from '../Config/Tool';
import {template, HongcaiHeader, HongcaiFooter} from './common/mixin';
import '../Style/login.less'

class Main extends Component {
    constructor() {
      super();
      this.state = {
        phone:'',   //电话
        preventMountSubmit:true,//防止重复提交
      }

      this.changeValue = (event) => {
        let value = event.target.value.replace(/\D/gi,'')
        this.setState({
            phone:value
        })
      }
      this.beforepasteHandler = (e) => {
        e.clipboardData.setData('text', e.clipboardData.getData('text').replace(/\D/g, ''))
      }
      this.postPhone = () => {
        let mobilePattern = /^((13[0-9])|(15[^4,\D])|(18[0-9])|(17[03678])|(14[0-9]))\d{8}$/;
          if (this.state.phone.length < 11) {
              return
          }else if (!mobilePattern.test(this.state.phone)) {
              Tool.alert('请输入正确的手机号！');
              return
          } else if (this.state.preventMountSubmit) {
            this.state.preventMountSubmit == false;
            this.props.getData(process.env.RESTFUL_DOMAIN + '/users/isUnique',{account:this.state.phone, userType:1},(res) => {
                if (res.ret === 1) {
                    Tool.alert('该手机号尚未注册，请先注册哦~');
                    this.setState({
                        preventMountSubmit:true
                    })
                }else{
                    var path = {
                        pathname:'/loginPassword',
                        state: {phone: this.state.phone},
                    }
                  browserHistory.push(path)
                }
            },'input', 'POST')
          }
      } 
    }

    componentWillMount() {
    }
    componentDidMount() {
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state),fromJS(nextState))
    }
    
    componentWillUpdate(nextProps,nextState){
        if (this.props !== nextProps) {
            let {data} = nextProps.state;

        }
    }
   
    render() {
      return (
        <div className="login">
          <HongcaiHeader />
          <div className="padding-b-11">
              <form className='form_style'>
              <div className='input_container'>
                <input type="tel" maxLength='11' value={this.state.phone} placeholder='请输入手机号' onChange={this.changeValue.bind(this)} onPaste={this.beforepasteHandler} required autoFocus/>
                <input type="text" className="hide"/>
              </div>
            </form>
            <div className={`btu_next ${this.state.phone.length === 11 ? 'btn_blue':'btn_blue_disabled'}`} onClick={this.postPhone}>下一步</div>
            <Link to="/register" className="to_register display-bl">注册账号</Link>
          </div>
          <HongcaiFooter />
        </div>
      )
    }
}

export default template({
    id: 'index',  //应用关联使用的redux
    component: Main,//接收数据的组件入口
    url: '',
    subscribeData:['increaseData'],
});

