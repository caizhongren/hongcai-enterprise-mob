import React, {Component, PropTypes} from 'react';
import pureRender from 'pure-render-decorator';
import {History, Link, browserHistory } from 'react-router';
import { connect } from 'react-redux';
import { is, fromJS} from 'immutable';
import {Tool, Count, Utils, checkPwdUtil} from '../Config/Tool';
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
            canRegister: true,//防止重复提交
            disable: true,
            nextPart: true,
            pwdHide: false,
            isUnique: 0,
            mobilePattern: /^((13[0-9])|(15[^4,\D])|(18[0-9])|(17[03678])|(14[0-9]))\d{8}$/,
            codeSrc: process.env.WEB_DEFAULT_DOMAIN + '/siteUser/getPicCaptcha',
            Timer: null,
            strength: 0,
        }
        this.changeEyes = () => {
          this.state.pwdHide ? this.setState({ pwdHide: false}) : this.setState({ pwdHide: true});
        }

        this.changeValue = (type, event) => {
            if(type === 'phone'){
              let value = event.target.value.replace(/\D/g,'')
              if (value.length === 11) {
                 this.checkIsUnique(value)
              }
              this.setState({
                  phone:value
              })
            } else if (type === 'password') {
              let pwd = event.target.value;
              this.setState({
                password: pwd,
                strength: checkPwdUtil(pwd)
              })
            } else if (type === 'picCaptcha') {
                let value = event.target.value.replace(/[\W]/g, '')
                this.setState({
                    picCaptcha: value
                })
            } else {
                this.setState({
                    mobCaptcha: event.target.value.replace(/\D/g,'')
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
        this.checkIsUnique = (mobile) => {
            var that = this
            that.props.getData(process.env.WEB_DEFAULT_DOMAIN + '/siteUser/isUniqueMobile', {
                mobile: mobile,
                userType: 1
            }, (res) => {
                if (res.ret === 1) {
                    if (res.data.isUnique === 0) { // 未注册
                        that.setState({isUnique: 0})
                    } else { // 已注册
                        that.setState({isUnique: 1})
                    }
                } else {
                    Tool('请重试')
                }
            }, '', 'POST')
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
            if (that.state.isUnique === 1) {
                Tool.alert('手机号已注册，请直接登录哦～')
                return
            }
            that.setState({busy: true})
            let guestId = Tool.guestId(32, 16)
            that.props.getData(process.env.RESTFUL_DOMAIN + '/users/mobileCaptcha', {mobile: that.state.phone, picCaptcha: that.state.picCaptcha, business: 0, guestId: guestId}, (res) => {
                if (res && res.ret !== -1) {
                    that.countDown()
                    that.setState({
                        Timer: setTimeout(() => {
                            that.setState({busy: false})
                        }, 61000)
                    })
                } else {
                    Tool.alert(res.msg)
                    that.setState({busy: false})
                }
            },'', 'POST')
        }
        this.register = () => {
            if (!this.state.canRegister) {
                return
            }
            let that = this
            let passwordPattern = /^(?=.*[a-zA-Z])(?=.*[0-9])[\da-zA-Z~!@#$%^&*]{6,16}$/;
            if (!that.state.mobilePattern.test(that.state.phone) || !that.state.picCaptcha || !that.state.mobCaptcha || that.state.password.length < 6) {
                return
            }
            if (!passwordPattern.test(that.state.password)) {
                Tool.alert('登录密码6-16位，需包含字母和数字')
                return
            }
            that.setState({canRegister: false})
            that.props.getData(process.env.RESTFUL_DOMAIN + '/enterpriseUsers/register', {
                mobile: that.state.phone,
                captcha: that.state.mobCaptcha,
                password: MD5(that.state.password)
            }, (res) => {
                setTimeout(() => {
                    that.setState({canRegister: true})
                }, 1000);
                if (res && res.ret === -1) {
                    if (res.ret === -1 && res.code === -1007) {
                        Tool.alert('手机号已注册，请直接登录哦～')
                    } else {
                        Tool.alert(res.msg)
                    }
                } else {
                    Tool.success('注册成功')
                    setTimeout(() => {
                        browserHistory.push('/realName')
                    }, 500);
                }
            }, '', 'POST')
        }
        
    }

    componentWillUnmount() {
        clearTimeout(this.state.Timer)
    }
    componentDidMount() {
        this.refreshCode()
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
        <div className="login register">
          <HongcaiHeader />
            <div className="padding-b-3p5">
               <form className='form_style'>
                <div className='input_container'>
                  <input type="tel" maxLength='11' value={this.state.phone} placeholder='请输入手机号' onChange={this.changeValue.bind(this,'phone')} onPaste={Utils.pasteMobile.bind(this)} required/>
                </div>
                <div className='input_container pic'>
                  <input type="text" maxLength='4' value={this.state.picCaptcha} placeholder='请输入图形验证码' onInput={this.changeValue.bind(this,'picCaptcha')} onPaste={Utils.pastePic.bind(this)} required />
                </div>
                <span id="captcha_img" className="fr" onClick={this.refreshCode}><img  id="_img" src={this.state.imgSrc} alt=""/></span>                
                <div className='input_container message'>
                  <input type="tel" maxLength='6' value={this.state.mobCaptcha} placeholder='请输入短信验证码' onChange={this.changeValue.bind(this,'mobCaptcha')} onPaste={Utils.pasteMobile.bind(this)} required />
                </div>
                <span id="get_captcha" className="fr" onClick={this.sendMobCaptcha}>获取短信验证码</span>                
                <div className='input_container'>
                    <input className="password" type={this.state.pwdHide ? 'password' : 'text'} minLength='6' maxLength='16' value={this.state.password} placeholder='密码由6-16位数字、字母组合而成' onChange={this.changeValue.bind(this,'password')} required />
                    <span className={`pwd_eyes ${this.state.pwdHide ? '' : 'pwd_eyes_flash'}`} onClick={this.changeEyes}></span>
                </div>
                {
                    this.state.strength > 0 &&
                    <div className="pwdStrength">密码强度: <span className={this.state.strength === 1 ? 'strength0' : this.state.strength === 2 ? 'strength1' : 'strength2'}>{this.state.strength === 1 ? '弱' : this.state.strength === 2 ? '中' : '强'}</span></div>
                }
                </form>
              <div className={`btu_next ${!this.state.mobilePattern.test(this.state.phone) || !this.state.picCaptcha || !this.state.mobCaptcha || this.state.password.length < 6 ? 'btn_blue_disabled':'btn_blue'}`} onClick={this.register}>注册</div>
              <p className="to_register display-bl">注册即表示您同意<Link className="ft-blue" to="/registerAgree">《宏财网注册协议》</Link></p>
              <Link to="/login" className="to_login display-inb">已有账号，<span className="under-line">去登录</span></Link>
            </div> 
          <HongcaiFooter />
        </div>
      )
    }
}

export default template({
    id: 'index',  //应用关联使用的redux
    component: Main,//接收数据的组件入口
    url: ''
});

