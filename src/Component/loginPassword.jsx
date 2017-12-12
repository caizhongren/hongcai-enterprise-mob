import React, {Component, PropTypes} from 'react';
import pureRender from 'pure-render-decorator';
import {browserHistory, Link } from 'react-router';
import { connect } from 'react-redux';
import { is, fromJS} from 'immutable';
import {Tool} from '../Config/Tool';
import {template, HongcaiHeader, HongcaiFooter} from './common/mixin';
import '../Style/login.less'
import {MD5} from '../Config/MD5'

class Main extends Component {
    constructor(props) {
        super(props);
        console.log(this.props)
        this.state = {
            preventMountSubmit:true,//防止重复提交
            pwdHide: true,
            password: '',
        }
        this.changeEyes = () => {
          this.state.pwdHide ? this.setState({ pwdHide: false}) : this.setState({ pwdHide: true});
        }

        this.changeValue = (event) => {
          let pwd = event.target.value;
          this.setState({
            password:pwd
          })
        }

        this.postPwd = () => {
          if (this.state.password.length < 6) {
            return;
          }
          this.state.preventMountSubmit == false;
          this.props.getData(process.env.WEB_DEFAULT_DOMAIN + '/siteUser/login',{account:this.state.phone,password:MD5(this.state.password),type:1,userType:1},(res) => {
              if (res.ret === -1) {
                  Tool.alert(res.msg);
                  this.setState({
                      preventMountSubmit:true
                  })
              }else{
                  this.state.preventMountSubmit = true;
                  Tool.success('登录成功')
                  let timer = setTimeout( () => {
                    browserHistory.push('/')
                    clearTimeout(timer);
                 },2000)
              }
          },'input', 'POST')
        }
        
    }

    componentWillMount() {
        
    }
    componentDidMount() {
      let params = this.props.routeParams;
      this.state.phone = params.mobile||'';
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
        <div className="component_container login">
          <HongcaiHeader />
          <div>
            <form className='form_style'>
              <div className='input_container'>
                <input className="password" type={this.state.pwdHide ? 'password' : 'text'} minLength='6' maxLength='16' value={this.state.password} placeholder='请输入登录密码' onChange={this.changeValue.bind(this)} required autoFocus/>
                <span className={`pwd_eyes ${this.state.pwdHide ? '' : 'pwd_eyes_flash'}`} onClick={this.changeEyes}></span>
              </div>
            </form>
            <div className={`btu_next ${this.state.password.length >= 6 ? 'btn_blue':'btn_blue_disabled'}`} onClick={this.postPwd}>登录</div>
            <div className="text-center">
              <Link to="/register" className="to_register display-inb">注册账号</Link>
              <span className="line">|</span>
              <Link to="/getPwd1" className="to_getPwd display-inb">忘记密码</Link>  
            </div>
          </div>
          <HongcaiFooter />
        </div>
      )
    }
    
    componentWillUnmount() {
        cancelAnimationFrame(this.state.requestID);
    }
}

export default template({
    id: 'index',  //应用关联使用的redux
    component: Main,//接收数据的组件入口
    url: '',
});

