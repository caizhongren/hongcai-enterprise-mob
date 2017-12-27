import React, {Component, PropTypes} from 'react';
import { Link, IndexLink, browserHistory } from 'react-router';
import pureRender from 'pure-render-decorator';
import { is, fromJS} from 'immutable';
import { Tool } from '../Config/Tool';
import { PayUtils } from '../Config/payUtils';
import {template,Loading} from './common/mixin'
import '../Style/realName'

export class RealName extends Component {
    constructor() {
        super();
        this.state = {
          name:'',   //电话
          idCard: '',
          preventMountSubmit:true,//防止重复提交
        }
  
        this.changeValue = (type, event) => {
            if (type === 'name') {
                let name = event.target.value
                this.setState({
                    name: name
                })
            } else {
                this.setState({
                    idCard: event.target.value
                })
            }
        }
  
        this.toRealName = () => {
            if (!this.state.preventMountSubmit) {
                return
            }
            let idPattern = /^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i;
            if (!this.state.name) {
                Tool.alert('请输入您的姓名！')
                return
            }
            if (!this.state.idCard) {
                Tool.alert('请输入您的身份证号！')
                return
            }
            if (!idPattern.test(this.state.idCard)) {
                Tool.alert('请输入正确的身份证号!')
                return
            }
            this.setState({preventMountSubmit: false})
            this.props.getData(process.env.RESTFUL_DOMAIN + '/users/0/yeepayRegister',{
                realName: this.state.name,
                idCardNo: this.state.idCard,
                from: 5
            },(res) => {
                this.setState({
                    preventMountSubmit:true
                })
                if (res && res.ret !== -1) {
                    PayUtils.redToTrusteeship('toRegister', res)
                }else{
                    Tool.alert(res.msg)
                }
            },'input', 'POST')
        }
    }
    render () {
        return (
            <div className="real_name_auth" id="real-name">
                <div className="real-wrraper">
                    <p className="first_message text-center">恭喜您注册成功！</p>
                    <p className="second_message text-center">请您开通海口联合农商银行资金存管账户</p>
                    <form action="">
                        <div className="input-wrraper">
                            <input type="text" placeholder="请输入您的姓名" value={this.state.name} onChange={this.changeValue.bind(this,'name')} autoFocus maxLength="8"/>
                        </div>
                        <div className="input-wrraper">
                            <input type="tel" placeholder="请输入您的身份证号" value={this.state.idCard} onChange={this.changeValue.bind(this,'idCard')} maxLength='18'/>
                        </div>
                    </form>
                    <div className="real-btns">
                        <div className="btns-son">
                            <Link to="/index"><span>暂不开通</span></Link>
                            <span onClick={this.toRealName}>立即开通</span>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default template({
    id: 'index',  //应用关联使用的redux
    component: RealName,//接收数据的组件入口
    url: ''
});