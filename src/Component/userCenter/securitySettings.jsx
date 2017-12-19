import React, {Component, PropTypes} from 'react';
import {browserHistory, Link } from 'react-router';
import { connect } from 'react-redux';
import { is, fromJS} from 'immutable';
import {Tool} from '../../Config/Tool';
import { PayUtils } from '../../Config/payUtils';
import {template, Loading, Footer} from '../common/mixin';
import {RealNameMask} from '../common/realNameMask';
import '../../Style/settings'
import {SessionService} from '../../Config/sessionService'

class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showRealNameMask: false,
            haveTrusteeshipAccount: false,
            user: {},
            openAutoRepayment: false, // 自动投标
            loading: false
        }
        this.props.getData(process.env.WEB_DEFAULT_DOMAIN + '/siteUser/userSecurityInfo',{},(res) => {
            // this.setState({loading: false})
            if (res.ret === -1) {
                Tool.alert(res.msg);
            }else{
                this.setState({
                    user: res.data.user,
                    openAutoRepayment: res.data.userAuth.autoRepayment
                })
                if (res.data.userAuth && res.data.userAuth.authStatus === 2) {
                    this.setState({haveTrusteeshipAccount: true, openTrustReservation:res.data.userAuth.autoTransfer})
                } else {
                    this.setState({haveTrusteeshipAccount: false})
                }
            }
        },'')
        this.closeRealNameMask = () => {
            this.setState({showRealNameMask: false})
        }
        this.changeMobile = () => {
            if (!this.state.user.mobile) {
                return;
            }
            let path = {
                pathname:'/resetMobile',
                state: {phone: this.state.user.mobile},
            }
            browserHistory.push(path)
        }
        this.toRealName = () => {
            if (this.state.haveTrusteeshipAccount) {
                return
            }
            this.setState({showRealNameMask:true})
        }
        this.resetPayPwd = () => {
            if (!this.state.haveTrusteeshipAccount) {
                this.setState({showRealNameMask:true})
                return
            }
            this.props.getData(process.env.RESTFUL_DOMAIN + '/userAuths/resetPayPassword', {from:5}, (res)=>{
                if (res && res.ret !== -1) {
                    PayUtils.redToTrusteeship('resetPayPassword', res);
                }
            }, '', 'POST')
        }
        this.goToAutoRepayment = () => {
            if (!this.state.haveTrusteeshipAccount) {
                this.setState({showRealNameMask:true})
                return
            }
            this.props.getData(process.env.RESTFUL_DOMAIN + '/enterpriseUsers/0/autoRepayment', {
                from: 5
            }, (res)=> {
                if (res && res.ret !== -1) {
                    PayUtils.redToTrusteeship('AUTOREPAYMENT', res);
                  } else {
                    Tool.alert(res.msg);
                  }
            },'','POST')
        }
        this.signOut = () => {
            this.props.getData(process.env.WEB_DEFAULT_DOMAIN + '/siteUser/destorySession',{},(res)=>{
                if (res && res.ret === 1) {
                    browserHistory.push('/login')
                    SessionService.destory()
                } else {
                    Tool.alert(res.msg)
                }
            }, '', 'POST')
        }  
    }

    componentDidMount() {
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state),fromJS(nextState))
    }
    
    render() {
        let h = window.innerHeight + 'px'
        let icon = require('../../images/userCenter/angle-down.png')
        return (
        <div className="settings" style={{height: h}}>
            {this.state.loading && <Loading />}
            {this.state.showRealNameMask ? <RealNameMask getData={this.props.getData} closeRealNameMask={this.closeRealNameMask} showRealNameMask={this.state.showRealNameMask}/> : null }
            <div className="wrapper">
                <div className="form_style clear" onClick={this.changeMobile}>
                    <span className="fl">手机号</span>
                    <div className="fr">
                        <img  className="fr" src={icon} alt="" width="10.5%"/> 
                        <span className="fr">{this.state.user.mobile || '去设置'}</span>
                    </div>
                </div>
                <div className="form_style clear">
                    <span className="fl">银行资金存管账户</span>
                    <div className="fr" onClick={this.toRealName}>
                        {!this.state.haveTrusteeshipAccount ? <img  className="fr" src={icon} alt="" width="10%"/> : null}
                        <span className="fr">{this.state.haveTrusteeshipAccount? '已开通':'去开通'}</span>
                    </div>
                </div> 
                <div className="form_style clear">
                    <span className="fl">登录密码</span>
                    <div className="fr">
                        <img  className="fr" src={icon} alt="" width="10%"/> 
                        <Link to="/modifyPassword"><span className="fr">修改</span></Link>
                    </div>
                </div> 
                <div className="form_style clear">
                    <span className="fl">交易密码</span>
                    <div className="fr">
                        <img  className="fr" src={icon} alt="" width="10%"/> 
                        <span className="fr" onClick={this.resetPayPwd}>{this.state.haveTrusteeshipAccount? '修改':'去设置'}</span>
                    </div>
                </div>
            </div>
            <div className="auto_repayment">
                <div className="wrapper">
                    <div className="form_style">
                        <div className="clear">
                            <span className="fl">自动还款</span>
                            <div className="fr" onClick={this.goToAutoRepayment}>
                                {!this.state.openAutoRepayment ? <img  className="fr" src={icon} alt="" width="10%"/>: null}
                                <span className="fr">{this.state.openAutoRepayment ? '已开通' : '去开通'}</span>
                            </div>
                        </div>
                        <p>开通自动还款，将会在还款日从您所绑定的银行卡中自动扣取还款所需资金，并自动完成还款操作。</p>
                    </div>
                </div>
            </div>
            <div className="sign_out clear">
                <p onClick={this.signOut}>安全退出</p>
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

