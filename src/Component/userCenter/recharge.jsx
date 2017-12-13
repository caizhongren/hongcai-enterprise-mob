import React, {Component, PropTypes} from 'react';
import {browserHistory, Link } from 'react-router';
import { connect } from 'react-redux';
import { is, fromJS} from 'immutable';
import {Tool} from '../../Config/Tool';
import { PayUtils } from '../../Config/payUtils';
import {template, Loading, Footer} from '../common/mixin';
import '../../Style/recharge.less'

class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            preventMountSubmit:true,//防止重复提交
            rechargeAmount: '',
            loading: false,
            userBalance: 0, 
            unpaidAmount: 0,
            bankCardName: '',
            bankCode: '',
            bankCardNo: '0000',
            monthLimit: '不限',
            dayLimit: '',
            singleLimit: 0,
            userType: 1,
        }

        this.changeValue = (event) => {
          let amount = event.target.value.replace(/[^\d.]/g, "").
          //只允许一个小数点              
          replace(/^\./g, "").replace(/\.{2,}/g, ".").
          //只能输入小数点后两位
          replace(".", "$#$").replace(/\./g, "").replace("$#$", ".").replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');
          this.setState({
            rechargeAmount: amount
          })
        }

        this.getUserBalance = () => {
          this.props.getData(process.env.WEB_DEFAULT_DOMAIN + '/siteAccount/getUserBalance',null,(res) => {
            this.setState({loading: false})
            if (res.ret === -1) {
              Tool.alert(res.msg);
            }else{
              this.setState({
                userBalance: res.data.balance, // 账户余额
              })
            }
          },'')

          this.props.getData(process.env.RESTFUL_DOMAIN + '/bankcard/rechargeRemainLimit', null, (res) => {
            if (res.ret && res.ret === -1) {
              Tool.alert(res.msg);
            } else {
              this.setState({
                bankCardName: res.bankName,
                bankCardNo: res.bankNo,
                monthLimit: res.monthLimit,
                dayLimit: res.dayLimit,
                singleLimit: res.singleLimit,
                bankCardSrc: require('../../images/bankcardImg/' + res.bankCode + '.png')
              })
            }
          }, '')

          // 获取账户类型  // 1 对私；2 对公
          this.props.getData(process.env.WEB_DEFAULT_DOMAIN + '/siteUser/userSecurityInfo',null, (res) => {
            if (res.ret === -1) {
              Tool.alert(res.msg)
            } else {
              this.setState({userType: res.data.user.type})
            }
          })

        }

        this.recharge = () => {
          if (!this.state.preventMountSubmit || !this.state.rechargeAmount) {
            return
          }
          if (this.state.userType !== 1) {
            Tool.alert('该卡不支持快捷充值方式，请在电脑端登录www.biz.hongcai.com，使用网银充值。')
            return;
          } else if (this.state.rechargeAmount < 3) {
            Tool.alert('充值金额必须大于等于3元！')
            return;
          } else if (this.state.singleLimit > 0 && this.state.rechargeAmount > this.state.singleLimit) {
            let singLimit = this.state.singleLimit%10000 !== 0 ? this.state.singleLimit : this.state.singleLimit/10000
            Tool.alert('该卡本次最多充值' + singLimit + '万元，建议您分多次充值，或在电脑端登录www.biz.hongcai.com，使用网银充值。')
            return;
          }
          this.setState({
            preventMountSubmit: false,
            loading: true,
          })
          this.props.getData(process.env.RESTFUL_DOMAIN + '/users/0/recharge',{
            'amount': this.state.rechargeAmount,
            'rechargeWay': 'SWIFT',
            'expectPayCompany': '',
            'from': 5,
            'device': 1
          },(res) => {
            if (res && res.ret !== -1) {
              PayUtils.redToTrusteeship('toRecharge', res)
            }else{
              Tool.alert(res.msg)
            }
            this.setState({
              preventMountSubmit:true,
              loading: false,
            })
          },'input', 'POST')
        }     
    }

    componentWillMount() {
        
    }
    componentDidMount() {
      this.getUserBalance()
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
      let dayLimit = this.state.dayLimit < 0 ? '不限' : this.state.dayLimit%10000 !== 0 ? this.state.dayLimit : this.state.dayLimit/10000 + '万'
      let monthLimit = this.state.monthLimit < 0 ? '不限' : this.state.monthLimit%10000 !== 0 ? this.state.monthLimit : this.state.monthLimit/10000 + '万'
      let singleLimit = this.state.singleLimit < 0 ? `不限` : this.state.singleLimit%10000 !== 0 ? this.state.singleLimit : this.state.singleLimit/10000 + '万'
      return (
        <div className="component_container recharge">
          {this.state.loading && <Loading />}
          <div className="userBalance">
            <p className="balance">{this.state.bankCode}账户余额 : <span>{this.state.userBalance.toFixed(2)}元</span></p>
            <p>当期待还金额 : <span>{this.state.unpaidAmount.toFixed(2)}元</span></p>
            <p>建议充值金额 : <span>{(this.state.unpaidAmount - this.state.userBalance < 0) ? '0' : this.state.unpaidAmount - this.state.userBalance }元</span></p>
          </div>
          <div className="AmountInput">
            <img src={this.state.bankCardSrc} className="fl"/>
            <ul>
              <li>{this.state.bankCardName}</li>
              <li>**** **** **** {this.state.bankCardNo}</li>
            </ul>
          </div>
          <div className="bankLimit">单日{dayLimit}，单月{monthLimit}
          </div>
          <form className='form_style'>
            <span>充值金额</span>
            <input className="rechargeAmount" type='text' value={this.state.rechargeAmount} placeholder={`该卡本次最多充值 ${singleLimit}`} onChange={this.changeValue.bind(this)} required/>
          </form>
          <div className="btnAndTips">
            <div className={`rechargeBtn ${this.state.rechargeAmount.length >= 1 ? 'btn_blue':'btn_blue_disabled'}`} onClick={this.recharge}>立即充值</div>
            <div className="tips">
              <p className="header">温馨提示 :</p>
              <p className="contents">
                1.充值资金将进入您的海口联合农商银行个人存管账户；<br/>
                2.充值前请确认您的银行卡是否已经开通快捷支付等功能；<br/>
                3.充值限额由银行、第三方支付平台及用户设定的银行卡快捷支付限额决定，取三者最小值，请多留意，以免造成充值不成功的情况；
                4.如果充值金额没有及时到账，请马上联系客服 400-990-7626。
              </p>
            </div>
          </div>
          <Footer />
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
    url: '',
});

