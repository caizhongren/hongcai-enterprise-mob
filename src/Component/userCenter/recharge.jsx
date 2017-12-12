import React, {Component, PropTypes} from 'react';
import {browserHistory, Link } from 'react-router';
import { connect } from 'react-redux';
import { is, fromJS} from 'immutable';
import {Tool} from '../../Config/Tool';
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
            unpaidAmount: 2990,
            bankCardName: '建设银行',
            bankCardNo: '***********6543',
            monthLimit: '不限',
            dayLimit: '50万',
            singleLimit: 50000,
        }

        this.changeValue = (event) => {
          let amount = event.target.value.replace(/\D/gi,'');
          this.setState({
            rechargeAmount:amount
          })
        }

        this.getUserBalance = () => {
          this.props.getData(process.env.WEB_DEFAULT_DOMAIN + '/siteAccount/getUserBalance',{},(res) => {
            this.setState({loading: false})
            if (res.ret === -1) {
              Tool.alert(res.msg);
            }else{
              this.setState({
                userBalance: res.data.balance, // 账户余额
              })
            }
          },'')
        }

        this.recharge = () => {
          if (this.state.rechargeAmount < 3) {
            Tool.alert('充值金额必须大于等于3元！')
            return;
          }
          if (this.state.rechargeAmount > this.state.singleLimit) {
            Tool.alert('该卡本次最多充值' + this.state.singleLimit / 10000 + '万')
            return;
          }
          this.state.preventMountSubmit == false;
          this.setState({loading: true})
          this.props.getData(process.env.WEB_DEFAULT_DOMAIN + '/siteUser/login',{account:this.state.phone,rechargeAmount:MD5(this.state.rechargeAmount),type:1,userType:1},(res) => {
            this.setState({loading: false}) 
            if (res.ret === -1) {
              Tool.alert(res.msg);
              this.setState({
                  preventMountSubmit:true
              })
              }else{
                this.state.preventMountSubmit = true;
                Tool.success('登录成功')
                let timer = setTimeout( () => {
                  browserHistory.push('/')
                  clearTimeout(timer);
                },1000)
              }
          },'input', 'POST')
          setTimeout(() => {
            this.setState({loading: false})
          }, 5000)
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
      return (
        <div className="component_container recharge">
          {this.state.loading && <Loading />}
          <div className="userBalance">
            <p className="balance">账户余额 : <span>{this.state.userBalance.toFixed(2)}元</span></p>
            <p>当期待还金额 : <span>{this.state.unpaidAmount.toFixed(2)}元</span></p>
            <p>建议充值金额 : <span>{(this.state.unpaidAmount - this.state.userBalance < 0) ? '0' : this.state.unpaidAmount - this.state.userBalance }元</span></p>
          </div>
          <div className="AmountInput">
            <img src={require('../../images/add.png')} className="fl"/>
            <ul>
              <li>{this.state.bankCardName}</li>
              <li>{this.state.bankCardNo}</li>
            </ul>
          </div>
          <div className="bankLimit">单日{this.state.dayLimit}，单月{this.state.monthLimit}</div>
          <form className='form_style'>
            <span>充值金额</span>
            <input className="rechargeAmount" type='text' value={this.state.rechargeAmount} placeholder={`该卡本次最多充值 ${this.state.singleLimit/10000} 万`} onChange={this.changeValue.bind(this)} required autoFocus/>
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

