import React, {Component} from 'react';
import {History, Link, browserHistory } from 'react-router';
import { is, fromJS} from 'immutable';
import {Tool, Count, Utils} from '../Config/Tool';
import {MD5} from '../Config/MD5'
import {template} from './common/mixin';
import '../Style/login'
import '../Style/register'
class Main extends Component {
    constructor() {
        super();
        this.state = {
            phone: '',   //电话
            picCaptcha: '', // 图形验证码
            mobCaptcha: '', // 短信验证码
            busy: false,//防止重复提交
            canGoNext: true,
            isUnique: 0, //图形验证码是否正确
            isUniqueMobile: 0, //手机号是否注册
            codeSrc: process.env.WEB_DEFAULT_DOMAIN + '/siteUser/getPicCaptcha',
            Timer: null,
        }
        this.changeValue = (type, event) => {
          if (type === 'phone') {
            let value = event.target.value.replace(/\D/gi,'')
            if (value.length === 11) {
                this.checkIsUnique(value)
             }
            this.setState({
              phone: value
          })
          } else if (type === 'picCaptcha') {
            let value = event.target.value.replace(/[\W]/g, '')
              if (value.length >= 4) {
                  this.checkPicCaptcha(value)
                  value = event.target.value.slice(0, 4)
              }
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
        this.checkPicCaptcha = (picCaptcha) => {  //
            if (this.state.picCaptcha.length === 0) {
                return
            }
            var that = this
            that.props.getData(process.env.WEB_DEFAULT_DOMAIN + '/siteUser/checkPicCaptcha', {
                captcha: picCaptcha
            }, (res) => {
                if (res.ret === -1) { // 图形验证码错误
                    if (res.code === '-1245') {
                        that.setState({isUnique: 0})
                    }
                } else { // 图形验证码正确
                    that.setState({isUnique: 1})
                }
            }, '', 'POST')
        } 
        this.sendMobCaptcha = () => {
          let mobilePattern = /^((13[0-9])|(15[^4,\D])|(18[0-9])|(17[03678])|(14[0-9]))\d{8}$/;
            if (this.state.busy) {
                return
            }
            if (!this.state.phone) {
                Tool.alert('请输入手机号！')
                return
            }
            if (!mobilePattern.test(this.state.phone)) {
              Tool.alert('请输入正确的手机号！');
              return
            }
            if (this.state.isUniqueMobile === 1) {
                Tool.alert('手机号已注册，请直接登录哦～')
                return;
            }
            if (!this.state.picCaptcha) {
              Tool.alert('请输入图形验证码！')
              return
            }
            if(this.state.picCaptcha.length !== 4 || this.state.isUnique === 0) {
                Tool.alert('请输入正确的图形验证码！')
                return
            }
            if (this.state.isUnique === 2) {
                Tool.alert(this.state.msg)
                return
            }
            var that = this
            that.setState({busy: true})
            let guestId = Tool.guestId(32, 16)
            that.props.getData(process.env.RESTFUL_DOMAIN + '/users/mobileCaptcha', {
                mobile: that.state.phone, 
                picCaptcha: that.state.picCaptcha, 
                business: 2, 
                guestId: guestId,
                userType: 1,
            }, (res) => {
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
        this.checkIsUnique = (mobile) => {
          var that = this
          that.props.getData(process.env.WEB_DEFAULT_DOMAIN + '/siteUser/isUniqueMobile', {
              mobile: mobile,
              userType: 1
          }, (res) => {
              if (res.ret === 1) {
                  if (res.data.isUnique === 0) { // 未注册
                      that.setState({isUniqueMobile: 0})
                  } else { // 已注册
                      that.setState({isUniqueMobile: 1})
                  }
              } else {
                  Tool.alert('请重试')
              }
          }, '', 'POST')
        }
        this.bindMobile = () => {
            let that = this
            let mobilePattern = /^((13[0-9])|(15[^4,\D])|(18[0-9])|(17[03678])|(14[0-9]))\d{8}$/;
            if (!that.state.canGoNext) {
                return
            }
            if (!that.state.picCaptcha || !that.state.mobCaptcha || !this.state.phone) {
                return
            }
            if (!mobilePattern.test(this.state.phone)) {
                Tool.alert('请输入正确的手机号！');
                return
            }
            if (this.state.isUniqueMobile === 1) {
                Tool.alert('手机号已注册，请直接登录哦～')
                return;
            }
            if(that.state.picCaptcha.length !== 4 || that.state.isUnique === 0) {
                Tool.alert('请输入正确的图形验证码！')
                return
            }
            that.setState({canGoNext: false})
            that.props.getData(process.env.WEB_DEFAULT_DOMAIN + '/siteUser/bindMobile', {
                mobile: that.state.phone,
                captcha: that.state.mobCaptcha,
                business: 2,
                userType: 1
            }, (res) => {
                that.setState({canGoNext: true})
                if (res && res.ret === -1) {
                    Tool.alert(res.msg)
                } else {
                  Tool.alert('手机号修改成功')
                    setTimeout(() => {
                        browserHistory.push('/userCenter/securitySettings')
                    }, 500);
                }
            },'', 'POST')
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
            <div className="component_container login forget">
                <div>
                <form className='form_style' autoComplete="off">
                    <div className='input_container'>
                    <input id="phone" type="tel" maxLength='11' value={this.state.phone} placeholder='请输入手机号' onChange={this.changeValue.bind(this,'phone')} onPaste={Utils.pasteMobile.bind(this)} required />
                    </div>
                    <div className='input_container pic'>
                    <input type="text" maxLength='4' value={this.state.picCaptcha} placeholder='请输入图形验证码' onChange={this.changeValue.bind(this,'picCaptcha')} onPaste={Utils.pastePic.bind(this)} required />
                    </div>
                    <span id="captcha_img" className="fr" onClick={this.refreshCode}><img  id="_img" src={this.state.imgSrc} alt=""/></span>                
                    <div className='input_container message'>
                    <input type="tel" maxLength='6' value={this.state.mobCaptcha} placeholder='请输入短信验证码' onChange={this.changeValue.bind(this,'mobCaptcha')} onPaste={Utils.pasteMobile.bind(this)} required />
                    </div>
                    <span id="get_captcha" className="fr" onClick={this.sendMobCaptcha}>获取短信验证码</span>
                </form>
                <div className={`btu_next ${!this.state.picCaptcha || this.state.mobCaptcha.length <6 || this.state.phone.length < 11 ? 'btn_blue_disabled':'btn_blue'}`} onClick={this.bindMobile}>绑定新手机号</div>
                </div> 
            </div>
        )
    }
}

export default template({
    id: 'index',  //应用关联使用的redux
    component: Main,//接收数据的组件入口
    url: ''
});

