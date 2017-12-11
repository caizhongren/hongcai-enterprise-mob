import React, {Component, PropTypes} from 'react';
import pureRender from 'pure-render-decorator';
import {History, Link, browserHistory } from 'react-router';
import { connect } from 'react-redux';
import { is, fromJS} from 'immutable';
import {Tool, Count} from '../Config/Tool';
import {MD5} from '../Config/MD5'
import {template, HongcaiHeader, HongcaiFooter} from './common/mixin';
import '../Style/login'
import '../Style/register'

class Main extends Component {
    constructor() {
        super();
        this.state = {
            phone: '',   //电话
            picCaptcha: '', // 图形验证码
            mobCaptcha: '', // 短信验证码
            password: '', // 密码
            busy: false,//防止重复提交
            disable: true,
            nextPart: true,
            pwdHide: true,
            mobilePattern: /^((13[0-9])|(15[^4,\D])|(18[0-9])|(17[03678])|(14[0-9]))\d{8}$/,
            codeSrc: process.env.domain + process.env.WEB_DEFAULT_DOMAIN + '/siteUser/getPicCaptcha'
        }
        this.changeEyes = () => {
          this.state.pwdHide ? this.setState({ pwdHide: false}) : this.setState({ pwdHide: true});
        }

        this.changeValue = (type, event) => {
            if(type === 'phone'){
              let value = event.target.value.replace(/\D/gi,'')
              this.setState({
                  phone:value
              })
            } else if (type === 'password') {
              let pwd = event.target.value;
              this.setState({
                password: pwd
              })
            } else if (type === 'picCaptcha') {
                this.setState({
                    picCaptcha: event.target.value
                })
            } else {
                this.setState({
                    mobCaptcha: event.target.value
                })
            }
        }
        this.refreshCode = () => {
            let $imgSrc = document.getElementById('_img')
            $imgSrc.setAttribute('src', this.state.codeSrc + '?code=' + Math.random())
        }
        this.countDown = () => { // 倒计时效果
            let $code = document.getElementById('get_captcha')
            Count.countDown($code)
        }
        this.sendMobCaptcha = () => {
            if (this.state.busy) {
                return
            }
            if (!this.state.phone) {
                Tool.alert('请输入手机号！')
                return
            }
            if (!this.state.mobilePattern.test(this.state.phone)) {
                Tool.alert('请输入正确的手机号！')
                return
            }
            if (!this.state.picCaptcha) {
                Tool.alert('请输入图形验证码！')
                return
            }
            var that = this
            that.state.busy = true
            that.props.getData(process.env.WEB_DEFAULT_DOMAIN + '/siteUser/mobileCaptcha', {mobile: that.state.phone, picCaptcha: that.state.picCaptcha, business: 0}, (res) => {
                setTimeout(() => {
                    that.state.busy = false
                }, 1000);
                if (res.ret && res.ret !== -1) {
                    Tool.alert('短信验证码发送成功，请查收')
                    that.countDown()
                } else {
                    Tool.alert(res.msg)
                }
            })
        }
        this.register = () => {
            if (this.state.busy) {
                return
            }
            let that = this
            let passwordPattern = /^(?=.*[a-zA-Z])(?=.*[0-9])[\da-zA-Z~!@#$%^&*]{6,16}$/;
            if (!that.state.mobilePattern.test(that.state.phone) || !that.state.picCaptcha || !that.state.mobCaptcha || that.state.password.length < 6) {
                return
            }
            if (!passwordPattern.test(that.state.password)) {
                Tool.alert('密码6-16位，需包含字母和数字')
                return
            }
            that.state.busy = true
            that.props.getData(process.env.RESTFUL_DOMAIN + '/enterpriseUsers/register', {
                mobile: that.state.phone,
                captcha: that.state.mobCaptcha,
                password: MD5(that.state.password)
            }, (res) => {
                setTimeout(() => {
                    that.state.busy = false
                }, 1000);
                if (res && res.ret === -1) {
                    Tool.alert(res.msg)
                } else {
                    browserHistory.push('/login')
                    Tool.alert('注册成功')
                }
            }, '', 'POST')
        }
        
    }

    componentWillMount() {
        // let params = this.props.location.query;
        // this.state.phone = params.phone||'';
        // console.log(this.props)
    }
    componentDidMount() {
        this.refreshCode()
        console.log(this.state.phone)
        this.setState({
            disable: !this.state.mobilePattern.test(this.state.phone) || !this.state.picCaptcha || !this.state.mobCaptcha || this.state.password.length < 6
        })
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
        <div className="component_container login register">
          <HongcaiHeader />
            <div>
               <form className='form_style'>
                <div className='input_container'>
                  <input type="tel" maxLength='11' value={this.state.phone} placeholder='请输入手机号' onChange={this.changeValue.bind(this,'phone')} required autoFocus/>
                </div>
                <div className='input_container pic'>
                  <input type="text" maxLength='4' value={this.state.picCaptcha} placeholder='请输入图形验证码' onChange={this.changeValue.bind(this,'picCaptcha')} required />
                </div>
                <span id="captcha_img" className="fr" onClick={this.refreshCode}><img  id="_img" src={this.state.imgSrc} alt=""/></span>                
                <div className='input_container message'>
                  <input type="tel" maxLength='6' value={this.state.mobCaptcha} placeholder='请输入短信验证码' onChange={this.changeValue.bind(this,'mobCaptcha')} required />
                </div>
                <span id="get_captcha" className="fr" onClick={this.sendMobCaptcha}>获取短信验证码</span>                
                <div className='input_container'>
                    <input className="password" type={this.state.pwdHide ? 'password' : 'text'} minLength='6' maxLength='16' value={this.state.password} placeholder='请输入登录密码' onChange={this.changeValue.bind(this,'password')} required />
                    <span className={`pwd_eyes ${this.state.pwdHide ? '' : 'pwd_eyes_flash'}`} onClick={this.changeEyes}></span>
                </div>
              </form>
              <div className={`btu_next ${!this.state.mobilePattern.test(this.state.phone) || !this.state.picCaptcha || !this.state.mobCaptcha || this.state.password.length < 6 ? 'btn_blue_disabled':'btn_blue'}`} onClick={this.register}>注册</div>
              <p className="to_register display-bl">注册即表示您同意《<span className="ft-blue">宏财网注册协议</span>》</p>
              <Link to="/login" className="to_login display-inb">已有账号，<span className="under-line">去登录</span></Link>
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
    url: ''
});

