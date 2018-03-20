import React, {Component} from 'react';
import { Link, IndexLink } from 'react-router';
import pureRender from 'pure-render-decorator';
import { is, fromJS} from 'immutable';
import { Tool, InputMaskHelper } from '../../Config/Tool';
import { PayUtils } from '../../Config/payUtils';
import template from './template';
export {template}
import '../../Style/realName'

export class RealNameMask extends Component {
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
                    this.props.closeRealNameMask()
                    PayUtils.redToTrusteeship('toRegister', res)
                }else{
                    Tool.alert(res.msg)
                }
            },'input', 'POST')
        }
    }
    render () {
        return (
            <div className="mask-common" id="real-name">
                <div className="real-wrraper" id="real_name_wrraper">
                    <div className="icon"></div>
                    <p className="title">身份认证</p>
                    <form action="">
                        <div className="input-wrraper">
                            <input type="text" placeholder="请输入您的姓名" value={this.state.name} onChange={this.changeValue.bind(this,'name')} maxLength="8"/>
                        </div>
                        <div className="input-wrraper">
                            <input type="text" placeholder="请输入您的身份证号" value={this.state.idCard} onChange={this.changeValue.bind(this,'idCard')} maxLength='18'/>
                        </div>
                    </form>
                    <div className="real-btns">
                        <div className="btns-son">
                            <span onClick={this.props.closeRealNameMask}>取消</span>
                            <span onClick={this.toRealName}>确认</span>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    componentDidMount () {
        if (this.props.showRealNameMask) {
            var handleEle = document.getElementById('real_name_wrraper')
            console.log(document.getElementById('real_name_wrraper'))
            InputMaskHelper.windowChange(handleEle)
        }
    }
}