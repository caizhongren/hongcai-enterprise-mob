import React, {Component, PropTypes} from 'react';
import pureRender from 'pure-render-decorator';
import {History, Link, browserHistory } from 'react-router';
import { connect } from 'react-redux';
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
            canGoNext: true,//防止重复提交
            isUnique: 0,
            codeSrc: process.env.WEB_DEFAULT_DOMAIN + '/siteUser/getPicCaptcha',
            Timer: null,
        }
        this.changeValue = (type, event) => {
            if (type === 'picCaptcha') {
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
                    mobCaptcha: event.target.value.replace(/\D/g, '')
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
        this.checkPicCaptcha = (picCaptcha) => {
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
            if (this.state.busy) {
                return
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
            that.props.getData(process.env.WEB_DEFAULT_DOMAIN + '/siteUser/mobileCaptcha', {mobile: that.state.phone, picCaptcha: that.state.picCaptcha, business: 1, guestId: guestId}, (res) => {
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
            })
        }
        this.goNextPage = () => {
            let that = this
            if (!that.state.canGoNext) {
                return
            }
            if (!that.state.picCaptcha || !that.state.mobCaptcha) {
                return
            }
            if(that.state.picCaptcha.length !== 4 || that.state.isUnique === 0) {
                Tool.alert('请输入正确的图形验证码！')
                return
            }
            that.setState({canGoNext: false})
            that.props.getData(process.env.WEB_DEFAULT_DOMAIN + '/siteUser/checkMobileCaptcha', {
                mobile: that.state.phone,
                captcha: that.state.mobCaptcha,
                business: 1
            }, (res) => {
                setTimeout(() => {
                    that.setState({canGoNext: true})
                }, 500);
                if (res && res.ret === -1) {
                    Tool.alert(res.msg)
                } else {
                    setTimeout(() => {
                        let path = {
                            pathname:'/resetPassword',
                            state: {phone: that.state.phone, captcha: that.state.mobCaptcha},
                        }
                        browserHistory.push(path)
                    }, 500);
                }
            })
        }
        
    }

    componentWillUnmount() {
        clearTimeout(this.state.Timer)
    }
    componentDidMount() {
        this.props.location.state ? (
            this.state.phone = this.props.location.state.phone || '',
            document.getElementById('phone').value = this.state.phone,
            this.refreshCode()
        ) : Tool.alert('请先输入手机号码')
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
        var opts = {};
        opts['readOnly'] = 'readOnly'
        return (
            <div className="component_container login forget">
                <div>
                <form className='form_style'>
                    <div className='input_container'>
                    <input className="readonly" id="phone" type="tel" maxLength='11' value={this.state.phone} placeholder='请输入手机号' {...opts} />
                    </div>
                    <div className='input_container pic'>
                    <input type="text" maxLength='4' value={this.state.picCaptcha} placeholder='请输入图形验证码' onChange={this.changeValue.bind(this,'picCaptcha')} onPaste={Utils.pastePic.bind(this)} required autoFocus/>
                    </div>
                    <span id="captcha_img" className="fr" onClick={this.refreshCode}><img  id="_img" src={this.state.imgSrc} alt=""/></span>                
                    <div className='input_container message'>
                    <input type="tel" maxLength='6' value={this.state.mobCaptcha} placeholder='请输入短信验证码' onChange={this.changeValue.bind(this,'mobCaptcha')} onPaste={Utils.pasteMobile.bind(this)} required />
                    </div>
                    <span id="get_captcha" className="fr" onClick={this.sendMobCaptcha}>获取短信验证码</span>
                </form>
                <div className={`btu_next ${!this.state.picCaptcha || !this.state.mobCaptcha ? 'btn_blue_disabled':'btn_blue'}`} onClick={this.goNextPage}>下一步</div>
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

