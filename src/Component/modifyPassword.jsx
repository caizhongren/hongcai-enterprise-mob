import React, {Component, PropTypes} from 'react';
import {browserHistory } from 'react-router';
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
            oldPwd: '',
            newPwd: '',
            strength: 0,
        }
        this.changeEyes = () => {
          this.state.pwdHide ? this.setState({ pwdHide: false}) : this.setState({ pwdHide: true});
        }

        this.changeValue = (type, event) => {
          if (type === 'oldPwd') {
            this.setState({
              oldPwd: event.target.value
            })
          } else {
            // let newPwd = event.target.value.replace(/[\W]/g,'');
            let newPwd = event.target.value;
            this.setState({
              newPwd: newPwd,
              strength: checkPwdUtil(newPwd)
            })
          }
        }

        this.postPwd = () => {
          if (this.state.newPwd.length < 6) {
            return
          }
            let passwordPattern = /^(?=.*[a-zA-Z])(?=.*[0-9])[\da-zA-Z~!@#$%^&*]{6,16}$/;
            if (!passwordPattern.test(this.state.newPwd)) {
                Tool.alert('登录密码由6-16位数字、字母组合而成')
                return
            }
            this.state.preventMountSubmit == false;
            this.props.getData(process.env.RESTFUL_DOMAIN + '/users/0/changePassword',{
              oldPassword: MD5(this.state.oldPwd),
              newPassword: MD5(this.state.newPwd)
            },(res) => {
                if (res.ret === -1) {
                    Tool.alert(res.msg);
                    this.setState({
                        preventMountSubmit:true
                    })
              }else{
                    this.state.preventMountSubmit = true;
                    Tool.alert('密码修改成功！')
                    let timer = setTimeout( () => {
                        browserHistory.push('/userCenter/securitySettings')
                        clearTimeout(timer);
                    },2000)
                }
            },'input', 'POST')
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
        <div className="component_container login reset">
          <div>
            <form className='form_style'>
              <div className='input_container'>
                <input className="password" type='password' value={this.state.oldPwd} placeholder='请输入原密码' onChange={this.changeValue.bind(this, 'oldPwd')} required autoFocus/>
              </div>
              <div className='input_container'>
                <input className="password" type={this.state.pwdHide ? 'password' : 'text'} minLength='6' maxLength='16' value={this.state.newPwd} placeholder='请设置6-16位数字、字母组合新密码' onChange={this.changeValue.bind(this, 'newPwd')} required/>
                <span className={`pwd_eyes ${this.state.pwdHide ? '' : 'pwd_eyes_flash'}`} onClick={this.changeEyes}></span>
              </div>
              {
                this.state.strength > 0 &&
                <div className="pwdStrength">密码强度: <span className={this.state.strength === 0 || this.state.strength === 1 ? 'strength0' : this.state.strength === 2 ? 'strength1' : 'strength2'}>{this.state.strength === 0 || this.state.strength === 1 ? '弱' : this.state.strength === 2 ? '中' : '强'}</span></div>
              }                
            </form>
            <div className={`btu_next ${this.state.oldPwd.length > 0 && this.state.newPwd.length >= 6 ? 'btn_blue':'btn_blue_disabled'}`} onClick={this.postPwd}>确定</div>
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

