import React, {Component} from 'react';
import {browserHistory, Link } from 'react-router';
import { is, fromJS} from 'immutable';
import {Tool} from '../Config/Tool';
import {template, HongcaiHeader, HongcaiFooter, Loading} from './common/mixin';
import '../Style/login.less'
import {MD5} from '../Config/MD5'
import {SessionService} from '../Config/sessionService'

class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            preventMountSubmit:true,//防止重复提交
            pwdHide: true,
            password: '',
            loading: false,
            phone: ''
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
          this.setState({loading: true})
          this.props.getData(process.env.WEB_DEFAULT_DOMAIN + '/siteUser/login',{account:this.state.phone,password:MD5(this.state.password),type:1,userType:1},(res) => {
            this.setState({loading: false}) 
            if (res.ret === -1) {
              Tool.alert(res.msg);
              this.setState({
                  preventMountSubmit:true
              })
              }else{
                this.state.preventMountSubmit = true;
                Tool.success('登录成功')
                SessionService.loginSuccess(res)
                let timer = setTimeout( () => {
                  browserHistory.push('/')
                  clearTimeout(timer);
                },1000)
              }
          },'input', 'POST')
          this.state.loading ? setTimeout(() => {
            this.setState({loading: false})
          }, 5000) : null
        }

        this.goForgetPassword = () => {
          let path = {
            pathname:'/forgetPassword',
            state: {phone: this.state.phone},
          }
          browserHistory.push(path)
        }        
    }

    componentDidMount() {
      !this.props.location.state ? (
        Tool.alert('请先输入登录手机号码') ,
        browserHistory.replace('/login')
      ) : this.state.phone = this.props.location.state.phone;
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
          {this.state.loading && <Loading />}
          <div className="padding-b-10p5">
            <form className='form_style'>
              <div className='input_container'>
                <input className="password" type={this.state.pwdHide ? 'password' : 'text'} minLength='6' maxLength='16' value={this.state.password} placeholder='请输入登录密码' onChange={this.changeValue.bind(this)} required />
                <span className={`pwd_eyes ${this.state.pwdHide ? '' : 'pwd_eyes_flash'}`} onClick={this.changeEyes}></span>
                <input type="text" className="hide"/>
              </div>
            </form>
            <div className={`btu_next ${this.state.password.length >= 6 ? 'btn_blue':'btn_blue_disabled'}`} onClick={this.postPwd}>登录</div>
            <div className="text-center">
              <Link to="/register" className="to_register display-inb">注册账号</Link>
              <span className="line">|</span>
              <p className="to_getPwd display-inb" onClick={this.goForgetPassword}>忘记密码</p>  
            </div>
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
});

