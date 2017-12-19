import React, {Component, PropTypes} from 'react';
import { Router, Route, Redirect, IndexRoute, browserHistory, hashHistory } from 'react-router';
import {SessionService} from '../Config/sessionService'

import index from '../Component/Index'; //销售录入

class Roots extends Component {
    constructor() {
      super();
      this.state = {
        isLogged: false,
      }
      console.log(SessionService.isLogin())
    }
    render() {
        return (
            <div>
                {this.props.children}
            </div>
        );
    }
    checkLogin = () => {
      if (this.state.isLogged) {
        return
      }
      if(!SessionService.isLogin()){
        fetch(process.env.RESTFUL_DOMAIN + '/users/checkSession',{
          mode: 'cors',
          "Content-Type": "application/json",
          credentials: 'same-origin'
        })
        .then(response => {
          SessionService.checkLogin();
          if (response.ok) {
            response.json().then(res => {
              let isLogged = res.mobile || res.email;
              isLogged ? null : browserHistory.push('/login')
              SessionService.loginSuccess(res);
              this.setState({isLogged: isLogged ? true : false})
            })
          } else {
            console.log("status", response.status);
          }
        })
        .catch(error => console.log(error))
      }
    }
  
    componentWillReceiveProps(nextProps) {
      if (nextProps.location.pathname.indexOf('loginPassword') !== 1 && nextProps.location.pathname.indexOf('register') !== 1 && nextProps.location.pathname.indexOf('login') !== 1) {
        this.checkLogin()
      } 
    }
    componentDidMount (props) {
      if (this.props.location.pathname.indexOf('loginPassword') !== 1 && this.props.location.pathname.indexOf('register') !== 1 && this.props.location.pathname.indexOf('login') !== 1) {
        this.checkLogin()
      } 
      document.title = this.props.routes[1].title === undefined ? '宏财企业平台' : this.props.routes[1].title
    }
    componentWillUpdate (nextProps) {
        document.title = nextProps.routes[1].title === undefined ? '宏财企业平台' : nextProps.routes[1].title
    }
}

// const history = process.env.NODE_ENV !== 'production' ? browserHistory : hashHistory;


const chooseProducts = (location, cb) => {require.ensure([], require => {cb(null, require('../Component/chooseProducts').default)},'chooseProducts')}
const helpCenter = (location, cb) => {require.ensure([], require => {cb(null, require('../Component/helpCenter').default)},'helpCenter')}
const saleRecord = (location, cb) => {require.ensure([], require => {cb(null, require('../Component/saleRecord').default)},'saleRecord')}
const allDeposit = (location, cb) => {require.ensure([], require => {cb(null, require('../Component/allDeposit').default)},'allDeposit')}
const applyRecord = (location, cb) => {require.ensure([], require => {cb(null, require('../Component/applyRecord').default)},'applyRecord')}
const applyDeposit = (location, cb) => {require.ensure([], require => {cb(null, require('../Component/applyDeposit').default)},'applyDeposit')}
const login = (location, cb) => {require.ensure([], require => {cb(null, require('../Component/login').default)},'login')}
const register = (location, cb) => {require.ensure([], require => {cb(null, require('../Component/register').default)},'register')}
const forgetPassword = (location, cb) => {require.ensure([], require => {cb(null, require('../Component/forgetPassword').default)},'forget')}
const resetPassword = (location, cb) => {require.ensure([], require => {cb(null, require('../Component/resetPassword').default)},'forget')}
const resetMobile = (location, cb) => {require.ensure([], require => {cb(null, require('../Component/resetMobile').default)},'resetMobile')}
const bindMobile = (location, cb) => {require.ensure([], require => {cb(null, require('../Component/bindMobile').default)},'resetMobile')}
const modifyPassword = (location, cb) => {require.ensure([], require => {cb(null, require('../Component/modifyPassword').default)},'modifyPassword')}
const loginPassword = (location, cb) => {require.ensure([], require => {cb(null, require('../Component/loginPassword').default)},'login')}
const registerAgree = (location, cb) => {require.ensure([], require => {cb(null, require('../Component/registerAgree').default)},'registerAgree')}
const yeepayCallback = (location, cb) => {require.ensure([], require => {cb(null, require('../Component/callback').default)},'yeepayCallback')}
const realName = (location, cb) => {require.ensure([], require => {cb(null, require('../Component/realName').default)},'realNameAuth')}
const recharge = (location, cb) => {require.ensure([], require => {cb(null, require('../Component/userCenter/recharge').default)},'recharge')}
const withdraw = (location, cb) => {require.ensure([], require => {cb(null, require('../Component/userCenter/withdraw').default)},'withdraw')}
const transactionRecord = (location, cb) => {require.ensure([], require => {cb(null, require('../Component/userCenter/transactionRecord').default)},'transactionRecord')}
const bankcardManagement = (location, cb) => {require.ensure([], require => {cb(null, require('../Component/userCenter/bankcardManagement').default)},'bankcardManagement')}
const securitySettings = (location, cb) => {require.ensure([], require => {cb(null, require('../Component/userCenter/securitySettings').default)},'securitySettings')}
const bankcardLimit = (location, cb) => {require.ensure([], require => {cb(null, require('../Component/userCenter/bankcardLimit').default)},'bankcardLimit')}
const projectDeatil = (location, cb) => {require.ensure([], require => {cb(null, require('../Component/userCenter/projectDeatil').default)},'projectDeatil')}
const projectList = (location, cb) => {require.ensure([], require => {cb(null, require('../Component/project/projectList').default)},'projectList')}

const RouteConfig = (
    <Router history={browserHistory}>
        <Route path="/" component={Roots}>
            <IndexRoute component={index} title='账户总览'/> //首页
            <Route path="index" component={index} title='账户总览' />
            <Route path="helpCenter" getComponent={helpCenter}  title='帮助中心'/>//帮助中心
            <Route path="saleRecord" getComponent={saleRecord}  title='销售记录'/>//销售记录
            <Route path="chooseProducts" getComponent={chooseProducts}  title='选择商品'/>//选择商品
            <Route path="allDeposit" getComponent={allDeposit}  title='余额'/>//余额
            <Route path="applyDeposit" getComponent={applyDeposit}  title='申请提现'/>//申请提现
            <Route path="applyRecord" getComponent={applyRecord}  title='提现记录'/> //提现记录
            <Route path="register" getComponent={register} title='注册'/> //注册
            <Route path="login" getComponent={login}  title='登录'/> //注册
            <Route path="resetMobile/:mobile" getComponent={resetMobile} title='更改绑定手机号'/>
            <Route path="bindMobile" getComponent={bindMobile} title='绑定新手机号'/>
            <Route path="forgetPassword/:mobile" getComponent={forgetPassword} title='忘记密码'/>
            <Route path="resetPassword" getComponent={resetPassword} title='重置密码'/>
            <Route path="modifyPassword" getComponent={modifyPassword} title='修改密码'/>
            <Route path="loginPassword/:mobile" getComponent={loginPassword} title='登录密码'/> //注册
            <Route path="registerAgree" getComponent={registerAgree}  title='注册服务协议'/> //注册协议
            <Route path="realName" getComponent={realName}  title='开通银行资金存管账户'/>
            <Route path="yeepayCallback/:business/:yeepayStatus" getComponent={yeepayCallback}  title='跳转中···'/> 
            <Route path="userCenter/recharge" getComponent={recharge}  title='充值'/>
            <Route path="userCenter/withdraw" getComponent={withdraw}  title='提现'/>
            <Route path="userCenter/transactionRecord" getComponent={transactionRecord}  title='资金流水'/>
            <Route path="userCenter/bankcardManagement" getComponent={bankcardManagement}  title='银行卡管理'/>
            <Route path="userCenter/securitySettings" getComponent={securitySettings}  title='账户设置'/>
            <Route path="userCenter/bankcardLimit" getComponent={bankcardLimit}  title='银行卡限额'/>
            <Route path="project/projectDeatil/:projectNum/:projectId" getComponent={projectDeatil}  title='项目详情'/>
            <Route path="project/projectList" getComponent={projectList}  title='借款项目'/>
            <Redirect from='*' to='/' title='宏财企业平台' />
        </Route>
    </Router>
);

export default RouteConfig;