import React, {Component} from 'react';
import {browserHistory, Link } from 'react-router';
import { is, fromJS} from 'immutable';
import {Tool,Utils, InputMaskHelper} from '../../Config/Tool';
import {number} from '../../filters/custom'
import { PayUtils } from '../../Config/payUtils';
import {template, Loading, Footer} from '../common/mixin';
import '../../Style/recharge.less'

class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            preventMountSubmit:true,//防止重复提交
            withdrawAmount: '',
            loading: false,
            userBalance: 0, 
            unpaidAmount: 0,
            bankCardName: '',
            bankCardNo: '0000',
            maxWithdrawAmount: 0
        }

        this.changeValue = (event) => {
          let amount = event.target.value.replace(/[^\d.]/g, "").
          //只允许一个小数点              
          replace(/^\./g, "").replace(/\.{2,}/g, ".").
          //只能输入小数点后两位
          replace(".", "$#$").replace(/\./g, "").replace("$#$", ".").replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');
          this.setState({
            withdrawAmount: amount
          })
        }

        this.getUserBalance = () => {
            this.props.getData(process.env.RESTFUL_DOMAIN + '/enterpriseUsers/0/getMaxWithdrawAmount',null,(res) => {
                this.setState({loading: false})
                if (res.ret === -1) {
                    Tool.alert(res.msg);
                    res.code === -1000 ? browserHistory.replace('/login') : null
                }else{
                    this.setState({
                        maxWithdrawAmount: res.amount, // 查询企业最大可提现金额
                    })
                }
            },'')

            this.props.getData(process.env.WEB_DEFAULT_DOMAIN + '/siteAccount/getUserBalance',null,(res) => {
                this.setState({loading: false})
                if (res.ret === -1) {
                    Tool.alert(res.msg);
                    res.code === -1000 ? browserHistory.replace('/login') : null
                }else{
                    this.setState({
                        userBalance: res.data.balance, // 账户余额
                    })
                }
            },'')

            this.props.getData(process.env.WEB_DEFAULT_DOMAIN + '/bank/getUserBankCard', null, (res) => {
                if (res.ret && res.ret === -1) {
                    Tool.alert(res.msg);
                } else {
                    this.setState({
                        bankCardName: res.data.card.openBank,
                        bankCardNo: res.data.card.cardNo.slice(-4),
                        bankCardSrc: require('../../images/bankcardImg/' + res.data.card.bankCode + '.png')
                    })
                }
            }, '')
        }

        this.withdraw = () => {
            if (!this.state.preventMountSubmit || this.state.maxWithdrawAmount - 2 <= 0 || this.state.userBalance - 2 <= 0 || !this.state.withdrawAmount || this.state.withdrawAmount == 0) {
                return
            }
            if (this.state.withdrawAmount < 0.01) {
                Tool.alert('提现金额必须大于等于0.01元！')
                return;
            } else if (this.state.withdrawAmount > Math.min(this.state.maxWithdrawAmount, this.state.userBalance) - 2) {
                Tool.alert('最大提现金额：' + number(Math.min(this.state.maxWithdrawAmount, this.state.userBalance) - 2) + '元')
                return;
            }
            this.setState({
                preventMountSubmit: false,
                loading: true,
            })
            this.props.getData(process.env.RESTFUL_DOMAIN + '/users/0/withdraw',{
                'amount': this.state.withdrawAmount,
                'from': 5,
                'device': Utils.deviceCode()
            },(res) => {
                if (res && res.ret !== -1) {
                    PayUtils.redToTrusteeship('toWithdraw', res)
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

    componentDidMount() {
      this.getUserBalance()
      var handleEle = document.getElementsByClassName('withdraw')[0]
      InputMaskHelper.windowChange(handleEle)
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
        <div className="component_container recharge withdraw">
          {this.state.loading && <Loading />}
          <div className="userBalance">
            <p className="balance">账户余额 : <span>{number(this.state.userBalance)}元</span></p>
          </div>
          <div className="AmountInput">
            <img src={this.state.bankCardSrc} className="fl"/>
            <ul>
              <li>{this.state.bankCardName}</li>
              <li>**** **** **** {this.state.bankCardNo}</li>
            </ul>
          </div>
          <div className="bankLimit">可提现金额：{Math.min(this.state.maxWithdrawAmount, this.state.userBalance) - 2 < 0 ? 0 : number(Math.min(this.state.maxWithdrawAmount, this.state.userBalance) - 2)}元
          </div>
          <form className='form_style'>
            <span>提现金额</span>
            <input type="text" className="hide"/>
            <input className="rechargeAmount" type='text' value={this.state.withdrawAmount} placeholder={`该卡本次最高可提现：${Math.min(this.state.maxWithdrawAmount, this.state.userBalance) - 2 < 0 ? 0 : number(Math.min(this.state.maxWithdrawAmount, this.state.userBalance) - 2)}元`} onChange={this.changeValue.bind(this)} required/>
          </form>
          <p className="text-right fee">手续费：2元/笔</p>
          <div className="btnAndTips">
            <div className={`rechargeBtn ${Math.min(this.state.maxWithdrawAmount, this.state.userBalance) - 2 > 0 && this.state.withdrawAmount && this.state.withdrawAmount > 0 ? 'btn_blue':'btn_blue_disabled'}`} onClick={this.withdraw}>申请提现</div>
            <div className="tips">
              <p className="header">温馨提示 :</p>
              <p className="contents">
                1.由第三方支付机构收取提现手续费，每笔2元(金额不限)；<br/>
                2.一般提现T+1即可到账，最晚T+2到账(双休日及节假日顺延)；<br/>
                3.银行卡挂失、注销等状态异常导致提现失败，会在收到银行通知后解除该笔资金冻结，并在两个工作日内回到账户余额；<br/>
                4.如果提现资金没有在规定时限内到账，请马上联系客服400-990-7626。
              </p>
            </div>
          </div>
          <Footer />
        </div>
      )
    }
}

export default template({
    id: 'index',  //应用关联使用的redux
    component: Main,//接收数据的组件入口
    url: '',
});

