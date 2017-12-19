import React, {Component, PropTypes} from 'react';
import {History, Link, browserHistory} from 'react-router';
import { connect } from 'react-redux';
import { is, fromJS} from 'immutable';
import {Tool} from '../Config/Tool';
import {RealNameMask} from './common/realNameMask';
import {Header, Footer, template, Loading} from './common/mixin';
import '../Style/main.less'


class Main extends Component {
    constructor() {
      super();
      this.state = {
        userAuth: {
          authStatus: 0,
        },
        balance: 0, // 账户余额
        loanAmount: 0, // 借款金额
        payableAmount: 0, //应还金额 
        returnedAmount: 0, // 已还金额
        unpaidAmount: 0, // 待还金额
        showRealNameMask: false, // 控制实名认证弹窗
        loading: false,
      }

      this.getEnterpriseUserInfo = () => {
        this.props.getData(process.env.WEB_DEFAULT_DOMAIN + '/enterpriseUser/getEnterpriseUserInfo',{},(res) => {
          this.setState({loading: false})
          if (res.ret === -1) {
            Tool.alert(res.msg);
          }else{
            let account = res.data.account;
            let enterpriseCapitalVo = res.data.enterpriseCapitalVo;
            this.setState({
              balance: account.balance, // 账户余额
              loanAmount: enterpriseCapitalVo.totalFundRaising, // 借款金额
              payableAmount: enterpriseCapitalVo.totalFundRaising + enterpriseCapitalVo.accruedInterest, //应还金额 = 已还金额 + 待还金额
              returnedAmount: (enterpriseCapitalVo.totalFundRaising - enterpriseCapitalVo.unPrincipal) + (enterpriseCapitalVo.accruedInterest - enterpriseCapitalVo.unInterest), // 已还金额
              unpaidAmount: enterpriseCapitalVo.unInterest + enterpriseCapitalVo.unPrincipal, 
            })
          }
        },'')
      }

      this.userSecurityInfo = () => {
        this.props.getData(process.env.WEB_DEFAULT_DOMAIN + '/siteUser/userSecurityInfo',{},(res) => {
          this.setState({loading: false})
          if (res.ret === -1) {
            Tool.alert(res.msg);
          }else{
            this.setState({
              userAuth: res.data.userAuth
            })
          }
        },'')
      }
      this.toRealName = () => {
        this.setState({showRealNameMask: true})
      }
      this.closeRealNameMask = () => {
        this.setState({showRealNameMask: false})
      }
      this.toBankManagement = (page) => {
        if (this.state.userAuth && this.state.userAuth.authStatus === 2) {
          if (page === 'record') {
            browserHistory.push('/userCenter/transactionRecord')
          } else {
            browserHistory.push('/userCenter/bankcardManagement?amount='+this.state.unpaidAmount)
          }
        } else {
          this.setState({showRealNameMask: true})
        }
      }
    }

    componentWillMount() {
        let params = this.props.location.query;
    }
    componentDidMount() {
      this.setState({loading: true})
      setTimeout(() => {
        this.setState({loading: false})
      }, 5000)
      this.getEnterpriseUserInfo();
      this.userSecurityInfo();
      this.setState({height: window.innerHeight + 'px'})
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
        <div className="main" style={{height: this.state.height}}>
          {this.state.showRealNameMask ? <RealNameMask getData={this.props.getData} closeRealNameMask={this.closeRealNameMask} showRealNameMask={this.state.showRealNameMask}/> : null }
          {this.state.loading && <Loading />}
          <Link className="setting" to='/userCenter/securitySettings'></Link>
          <div className="part1">
            <div className="account">
              <div className="balance">
                <img src={require('../images/balance.png')} alt=""/>
                账户余额(元): <span>{this.state.balance.toFixed(2)}</span>
              </div>
              <div className="loanAmount">
                <img src={require('../images/jiekuan.png')} alt=""/>
                借款金额(元): <span>{this.state.loanAmount.toFixed(2)}</span>
              </div>
            </div>
            <ul className="statistics">
              <li>
                <span></span>
                <p>应还金额(元)</p>
                <p>{this.state.payableAmount.toFixed(2)}</p>
              </li>
              <li>
                <span></span>
                <p>已还金额(元)</p>
                <p>{this.state.returnedAmount < 0 ? '0.00' : this.state.returnedAmount.toFixed(2)}</p>
              </li>
              <li>
                <span></span>
                <p>待还金额(元)</p>
                <p>{this.state.unpaidAmount.toFixed(2)}</p>
              </li>
            </ul>
            <div className="btns">
              { this.state.userAuth && this.state.userAuth.authStatus === 2 ? 
              <ul>
                <Link to='/userCenter/recharge'><div className="fl">充值</div></Link>
                <Link to='/userCenter/withdraw'><div className="fr">提现</div></Link>
              </ul>
              : <div className="toRealNameAuth" onClick={this.toRealName}>开通银行资金存管</div>
              }
            </div>
          </div>
          <div className="part2">
            <p onClick={this.toBankManagement.bind(this, 'record')}>资金流水</p>
            <div onClick={this.toBankManagement}><p className="border-none">银行卡管理</p></div>
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
    url: ''
});

