import React, {Component, PropTypes} from 'react';
import pureRender from 'pure-render-decorator';
import {browserHistory, Link } from 'react-router';
import { connect } from 'react-redux';
import { is, fromJS} from 'immutable';
import {Tool, checkPwdUtil} from '../Config/Tool';
import {template} from './common/mixin';
import '../Style/login.less'
import {MD5} from '../Config/MD5'

class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            preventMountSubmit:true,//防止重复提交
            pwdHide: false,
            password: '',
            phone: '',
            captcha: '',
            strength: 0,
        }
        this.changeEyes = () => {
          this.state.pwdHide ? this.setState({ pwdHide: false}) : this.setState({ pwdHide: true});
        }

        this.changeValue = (event) => {
          let pwd = event.target.value;
          this.setState({
            password:pwd,
            strength: checkPwdUtil(pwd)
          })
        }

        this.postPwd = () => {
            if (!this.state.password || this.state.password.length < 6 ) {
                return
            }
            let passwordPattern = /^(?=.*[a-zA-Z])(?=.*[0-9])[\da-zA-Z~!@#$%^&*]{6,16}$/;
            if (!passwordPattern.test(this.state.password)) {
                Tool.alert('密码6-16位，需包含字母和数字')
                return
            }
            this.state.preventMountSubmit == false;
            this.props.getData(process.env.WEB_DEFAULT_DOMAIN + '/siteUser/resetMobilePassword',{
                mobile: this.state.phone,
                password: MD5(this.state.password),
                captcha: this.state.captcha,
                guestId: Tool.guestId(32,16)
            },(res) => {
                if (res.ret === -1) {
                    Tool.alert(res.msg);
                    this.setState({
                        preventMountSubmit:true
                    })
              }else{
                    this.state.preventMountSubmit = true;
                    Tool.alert('密码重置成功，请牢记哦~!')
                    let timer = setTimeout( () => {
                        browserHistory.push('/login')
                        clearTimeout(timer);
                    },2000)
                }
            },'input', 'POST')
        }      
    }

    componentWillMount() {
        
    }
    componentDidMount() {
        this.props.location.state ? (
            this.state.phone = this.props.location.state.phone || '',
            this.state.captcha = this.props.location.state.captcha || ''
        ) : Tool.alert('请从忘记密码页面进入')
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
        <div className="component_container login reset">
          <div>
            <form className='form_style'>
              <div className='input_container'>
                <input className="password" type={this.state.pwdHide ? 'password' : 'text'} minLength='6' maxLength='16' value={this.state.password} placeholder='新密码由6-16位数字、字母组合而成' onChange={this.changeValue.bind(this)} required />
                <span className={`pwd_eyes ${this.state.pwdHide ? '' : 'pwd_eyes_flash'}`} onClick={this.changeEyes}></span>
                <input type="text" className="hide"/>
              </div>
              {
                this.state.strength > 0 &&
                <div className="pwdStrength">密码强度: <span className={this.state.strength === 0 || this.state.strength === 1 ? 'strength0' : this.state.strength === 2 ? 'strength1' : 'strength2'}>{this.state.strength === 0 || this.state.strength === 1 ? '弱' : this.state.strength === 2 ? '中' : '强'}</span></div>
              }
            </form>
            <div className={`btu_next ${this.state.password.length >= 6 ? 'btn_blue':'btn_blue_disabled'}`} onClick={this.postPwd}>完成</div>
          </div>
        </div>
      )
    }
}

export default template({
    id: 'index',  //应用关联使用的redux
    component: Main,//接收数据的组件入口
    url: '',
});

