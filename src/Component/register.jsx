import React, {Component, PropTypes} from 'react';
import pureRender from 'pure-render-decorator';
import {History, Link } from 'react-router';
import { connect } from 'react-redux';
import { is, fromJS} from 'immutable';
import {Tool} from '../Config/Tool';
import {MD5} from '../Config/MD5'
import {template, HongcaiHeader, HongcaiFooter} from './common/mixin';
import '../Style/login'
import '../Style/register'

class Main extends Component {
    constructor() {
        super();
        this.state = {
            phone:'',   //电话
            picCaptcha: '', // 图形验证码
            mobCaptcha: '', // 短信验证码
            password: '', // 密码
            preventMountSubmit:true,//防止重复提交
            nextPart: true,
            pwdHide: true,
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
              if (event.target.value.length === 11) {
                this.setState({ disable: true})
              } else {
                this.setState({disable: false})
              }
            } else if (type === 'password') {
              let pwd = event.target.value;
              this.setState({
                password: pwd
              })
              if (pwd.length < 6) {
                this.setState({disable: false})
              } else {
                this.setState({disable: true})
              }
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
        this.postPhone = () => {
          let mobilePattern = /^((13[0-9])|(15[^4,\D])|(18[0-9])|(17[03678])|(14[0-9]))\d{8}$/;
            if (this.state.phone.length < 11) {
               return
            }else if (!mobilePattern.test(this.state.phone)) {
                Tool.alert('请输入正确的手机号！');
                return
            } else if (this.state.preventMountSubmit) {
              this.state.preventMountSubmit == false;
              this.props.getData('/enterprise/rest/users/isUnique',{account:this.state.phone, userType:1},(res) => {
                // console.log(res)
                  if (res.ret === -1) {
                      Tool.alert('该手机号尚未注册，请先注册哦~');
                      this.setState({
                          preventMountSubmit:true
                      })
                  }else{
                    // console.log(this.state.phone)
                      this.setState({
                        phone: '',
                        nextPart: false,
                        // pwdHide: true, 
                      });
                      // Tool.alert(res.msg)

      
                  }
              },'input', 'POST')
            }
        } 

        this.postPwd = () => {
          this.state.preventMountSubmit == false;
          this.props.getData(process.env.WEB_DEFAULT_DOMAIN + '/siteUser/login',{account:this.state.phone,password:this.state.password,type:1,userType:1},(res) => {
            // console.log(res)
              if (res.ret === -1) {
                  Tool.alert('该手机号尚未注册，请先注册哦~');
                  this.setState({
                      preventMountSubmit:true
                  })
              }else{
                  this.state.preventMountSubmit = true;
                  Tool.alert(res.msg)
              }
          },'input', 'POST')
        }
        this.sendMobCaptcha = () => {
            this.props.getData(process.env.WEB_DEFAULT_DOMAIN + '/siteUser/mobileCaptcha', {mobile: this.state.phone, picCaptcha: this.state.picCaptcha, business: 0}, (res) => {
                if (res.ret && res.ret !== -1) {
                    Tool.alert('短信验证码发送成功，请查收')
                } else {
                    Tool.alert('发送失败，' + res.msg)
                }
            })
        }
        this.register = () => {
            var that = this
            this.props.getData(process.env.RESTFUL_DOMAIN + '/enterpriseUsers/register', {
                mobile: that.state.phone,
                captcha: that.state.mobCaptcha,
                password: MD5(that.state.password)
            }, (res) => {
                if (res && res.ret === -1) {
                    Tool.alert(res.msg)
                } else {
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
          {/* <Header nav saleRecord title='登录'/> */}
          <HongcaiHeader />
            <div>
               <form className='form_style'>
                <div className='input_container'>
                {console.log(process.env.baseFileUrl)}
                  <input type="tel" maxLength='11' value={this.state.phone} placeholder='请输入手机号' onChange={this.changeValue.bind(this,'phone')} required autoFocus/>
                </div>
                <div className='input_container pic'>
                  <input type="text" maxLength='4' value={this.state.picCaptcha} placeholder='请输入图形验证码' onChange={this.changeValue.bind(this,'picCaptcha')} required />
                </div>
                <span id="captcha_img" className="fr" onClick={this.refreshCode}><img  id="_img" src={this.state.imgSrc} alt=""/></span>                
                <div className='input_container message'>
                  <input type="text" maxLength='6' value={this.state.mobCaptcha} placeholder='请输入短信验证码' onChange={this.changeValue.bind(this,'mobCaptcha')} required />
                </div>
                <span id="get_captcha" className="fr" onClick={this.sendMobCaptcha}>获取短信验证码</span>                
                <div className='input_container'>
                    <input className="password" type={this.state.pwdHide ? 'password' : 'text'} minLength='6' maxLength='16' value={this.state.password} placeholder='请输入登录密码' onChange={this.changeValue.bind(this,'password')} required />
                    <span className={`pwd_eyes ${this.state.pwdHide ? '' : 'pwd_eyes_flash'}`} onClick={this.changeEyes}></span>
                </div>
              </form>
              <div className={`btu_next ${this.state.disable ? 'btn_blue':'btn_blue_disabled'}`} onClick={this.register}>注册</div>
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

