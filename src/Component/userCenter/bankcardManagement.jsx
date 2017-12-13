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
            withdrawAmount: '',
            loading: false,
            userBalance: 0, 
            unpaidAmount: 0,
            bankCardName: '',
            bankCardNo: '0000',
            isVerifying: false,
            haveCard: false,
            isAuth: false,
            unbindBankCardApply: false,
            bindMobile: '',
            addIcon: require('../../images/main/add_bankcard.png')
        }
        // 查询是否可解绑卡
        this.props.getData(process.env.RESTFUL_DOMAIN + '/users/0/unbindBankCardApply', null, (res) => {
            if (res.ret && res.ret === -1) {
                Tool.alert(res.msg);
            } else {
                this.setState({
                    unbindBankCardApply: res.status
                })
            }
        }, '')
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

        this.getUserBankCard = () => {
            this.props.getData(process.env.WEB_DEFAULT_DOMAIN + '/bank/getUserBankCard',null,(res) => {
                this.setState({loading: false})
                if (res.ret === -1) {
                    Tool.alert(res.msg);
                }else{
                    this.setState({isAuth: res.data.isAuth})
                    if (res.data.card) {
                        this.setState({
                            bankCardName: res.data.card.openBank,
                            bankCardNo: res.data.card.cardNo.slice(-4),
                            haveCard: (res.data.card.status === 'VERIFIED'),
                            isVerifying: (res.data.card.status === 'VERIFYING'),
                            bankCardSrc: require('../../images/bankcardImg/' + res.data.card.bankCode + '.png'),
                            bindMobile: res.data.card.mobile
                        })
                    } else {
                        this.setState({
                            haveCard: false,
                            isVerifying: false
                        })
                    }
                }
            },'')
        }

        this.manageBankCard = (type) => {
            if (type === 1) { // 解绑
                if (this.state.unbindBankCardApply === 1) {
                    this.props.getData(process.env.WEB_DEFAULT_DOMAIN + 'yeepay/cgtUnbindBankCard', null, (res) => {
                        if (res.ret && res.ret === -1) {
                            Tool.alert(res.msg);
                        } else {
                            PayUtils.redToTrusteeship('toBindBankCard', res)
                        }
                    }, '')
                } else {
                    Tool.alert('尊敬的用户，检测到您当前有待偿款项尚未清偿，请联系客服进行人工解绑。客服热线：400-990-7626')
                }
            } else { // 绑卡
                this.props.getData(process.env.WEB_DEFAULT_DOMAIN + '/yeepay/bindBankCard', {from:5}, (res) => {
                    if (res.ret && res.ret === -1) {
                        Tool.alert(res.msg);
                    } else {
                        PayUtils.redToTrusteeship('toBindBankCard', response)
                    }
                }, '')
            }
        }   
    }

    componentDidMount() {
      this.getUserBankCard()
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
        var imgSrc = require('../../images/main/add_bankcard.png')
      return (
        <div className="component_container recharge bank_manage">
          {this.state.loading && <Loading />}
          <p className="fee text-right">支持银行及限额</p>
          {this.state.isAuth && this.state.haveCard ?                 
            <div>
                <div className="AmountInput">
                    <img src={this.state.bankCardSrc} className="fl"/>
                    <ul>
                    <li>{this.state.bankCardName}</li>
                    <li>**** **** **** {this.state.bankCardNo}</li>
                    </ul>
                </div>
                <form className='form_style'>
                    <span>预留手机号</span>
                    <span className="bind_mobile">{this.state.bindMobile}<span className="modify">修改</span></span>
                </form>
                <div className="form_style text-center ft-blue" onClick={this.manageBankCard.bind(this,1)}>
                    解绑银行卡
                </div>
            </div> :
            <div>
                <div className="form_style" onClick={this.manageBankCard.bind(this,0)}>
                    <img src={this.state.addIcon} width="10%" className="margin-auto" alt=""/>
                    <p className="add">添加银行卡</p>
                </div>
            </div>
          }
          <div className="btnAndTips">
            <div className="tips">
              <p className="header">温馨提示 :</p>
              <p className="contents">
                1.当前绑定银行卡用于平台充值及提现，为保证投资人资金安全，目前一个账号只可同时绑定一张银行卡；<br/>
                2.解绑银行卡：当账户总资产≤2元时，可直接解绑当前银行卡，如遇卡片丢失等不可抗因素时，请上传手持身份证等文件至客服邮箱hckf@hoolai.com，或拨打客服热线400-990-7626联系客服进行处理；<br/>
                3.更换银行卡：需先解绑当前银行卡，解绑成功后，即可申请绑定新的银行卡。
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

