import React, {Component, PropTypes} from 'react';
import pureRender from 'pure-render-decorator';
import { History, Link, browserHistory } from 'react-router';
import { connect } from 'react-redux';
import { is, fromJS} from 'immutable';
import {Tool} from '../Config/Tool';
import {template} from './common/mixin';
import '../Style/callback'
import { setTimeout } from 'timers';

class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
           second: 2,
           interval: null,
           business: '',
           yeepayStatus: '',
           amount: '',
           number: ''
        }
        this.backTo = () => {
            let msg = ''
            if (this.state.business === 'PERSONAL_REGISTER'){
                browserHistory.replace('/')
                msg = '认证成功！'
            } else if (this.state.business == 'RESET_MOBILE'){
                browserHistory.replace('/userCenter/securitySettings')
                msg = '修改成功！'
            } else if (this.state.business === 'RECHARGE'){
                browserHistory.replace('/')
                msg = '充值成功！'
            } else if (this.state.business === 'WITHDRAW'){
                browserHistory.replace('/')
                msg = '提现成功！'
            } else if(this.state.business === 'UNBIND_CARD'){
                browserHistory.replace('/userCenter/bankcardManagement')
                msg = '解绑成功！'
            } else if(this.state.business === 'BIND_BANK_CARD'){
                browserHistory.replace('/userCenter/bankcardManagement')
                msg = '绑卡成功！'
            } else if (this.state.business === 'AUTHORIZE_AUTO_REPAYMENT'){
                browserHistory.replace('/userCenter/securitySettings')
                msg = '开通成功！'
            } else if (this.state.business === 'REPAYMENT'){
                browserHistory.replace('/')
                msg = '还款成功！'
            }
            Tool.success(msg)
        }
    }
    
    componentDidMount(){
        let params = this.props.routeParams
        let query = this.props.location.query
        this.setState({
            business: params.business,
            yeepayStatus: params.yeepayStatus,
            amount: query.amount,
            number: query.number
        })
        var _this = this
        _this.state.interval = setInterval(()=>{
            if (_this.state.second > 0) {
                _this.setState({second: _this.state.second - 1})
            }
            if (_this.state.second <= 0) {
                this.backTo()
                clearInterval(_this.state.interval)
            }
        }, 1000)
    }
    shouldComponentUpdate(nextProps, nextState) {
        return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state),fromJS(nextState))
    }
    
    render() {
        return (
            <div className='yeepay_callback'>
                <div>
                    <span id="back_countdown">{this.state.second}</span>s<span>后返回宏财网</span>
                </div>
            </div>
        );
    }
}


export default template({
    id: 'applyRecord',  //应用关联使用的redux
    component: Main, //接收数据的组件入口
    url: ''
});
