import React, {Component, PropTypes} from 'react';
import { Router, Route, Redirect, IndexRoute, browserHistory, hashHistory } from 'react-router';

import index from '../Component/index'; //销售录入

class Roots extends Component {
    render() {
        return (
            <div>
                {this.props.children}
            </div>
        );
    }
    componentDidMount (props) {
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
const loginPassword = (location, cb) => {require.ensure([], require => {cb(null, require('../Component/loginPassword').default)},'login')}
const registerAgree = (location, cb) => {require.ensure([], require => {cb(null, require('../Component/registerAgree').default)},'registerAgree')}
const recharge = (location, cb) => {require.ensure([], require => {cb(null, require('../Component/userCenter/recharge').default)},'recharge')}
const withdraw = (location, cb) => {require.ensure([], require => {cb(null, require('../Component/userCenter/withdraw').default)},'withdraw')}
const transactionRecord = (location, cb) => {require.ensure([], require => {cb(null, require('../Component/userCenter/transactionRecord').default)},'transactionRecord')}
const bankcardManagement = (location, cb) => {require.ensure([], require => {cb(null, require('../Component/userCenter/bankcardManagement').default)},'bankcardManagement')}
const securitySettings = (location, cb) => {require.ensure([], require => {cb(null, require('../Component/userCenter/securitySettings').default)},'securitySettings')}

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
            <Route path="loginPassword/:mobile" getComponent={loginPassword} title='登录密码'/> //注册
            <Route path="registerAgree" getComponent={registerAgree}  title='注册服务协议'/> //注册协议
            <Route path="userCenter/recharge" getComponent={recharge}  title='充值'/>
            <Route path="userCenter/withdraw" getComponent={withdraw}  title='提现'/>
            <Route path="userCenter/transactionRecord" getComponent={transactionRecord}  title='资金流水'/>
            <Route path="userCenter/bankcardManagement" getComponent={bankcardManagement}  title='银行卡管理'/>
            <Route path="userCenter/securitySettings" getComponent={securitySettings}  title='账户设置'/>
            <Redirect from='*' to='/' title='宏财企业平台' />
        </Route>
    </Router>
);

export default RouteConfig;