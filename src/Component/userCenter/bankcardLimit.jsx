import React, {Component, PropTypes} from 'react';
import { History, Link, browserHistory } from 'react-router';
import { is, fromJS} from 'immutable';
import {Tool} from '../../Config/Tool';
import {template} from '../common/mixin';
import '../../Style/bankCardLimit'

class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
          bankLimit: [],
          aside: null,
          bankLimitList: {
            'ICBK': require('../../images/bankcardImg/ICBK.png'),
            'BKCH': require('../../images/bankcardImg/BKCH.png'),
            'PCBC': require('../../images/bankcardImg/PCBC.png'),
            'ABOC': require('../../images/bankcardImg/ABOC.png'),
            'COMM': require('../../images/bankcardImg/COMM.png'),
            'CMBC': require('../../images/bankcardImg/CMBC.png'),
            'CIBK': require('../../images/bankcardImg/CIBK.png'),
            'SZDB': require('../../images/bankcardImg/SZDB.png'),
            'MSBC': require('../../images/bankcardImg/MSBC.png'),
            'EVER': require('../../images/bankcardImg/EVER.png'),
            'HXBK': require('../../images/bankcardImg/HXBK.png'),
            'GDBK': require('../../images/bankcardImg/GDBK.png'),
            'PSBC': require('../../images/bankcardImg/PSBC.png'),
            'FJIB': require('../../images/bankcardImg/FJIB.png'),
            'SPDB': require('../../images/bankcardImg/SPDB.png'),
            'BJCN': require('../../images/bankcardImg/BOB.png')
          }
        }
        this.getBankLimit = () => {
          this.props.getData(process.env.RESTFUL_DOMAIN + '/bankcard/rechargeBankLimits',{},(res) => {
            if (res && res.ret !== -1) {
              this.setState({bankLimit: res})
            } else {
              Tool.alert(res.msg)
            }
          })
        }
    }
    
    componentDidMount(){
      this.getBankLimit()
    }
    shouldComponentUpdate(nextProps, nextState) {
        return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state),fromJS(nextState))
    }
    
    render() {
        return (
          <div className="banklimit-list">
            <ul className="display-bl margin-auto">
              <li className="titles">
                <div><p className="display-inb bank-names">支持银行</p><p className="display-inb limits">单笔/单日/单月</p></div>
              </li>
              { 
                // this.state.aside
                this.state.bankLimit.map((card , index) => {
                  return <li key={index} className="clearfix">
                    <div>
                      <p className="display-inb bank-name"><img src={this.state.bankLimitList[card.bankCode]} alt=""/>{card.bankName}</p>
                      <p className="display-inb limit">{card.singleLimit < 0 ? '不限': card.singleLimit % 10000 === 0 ? card.singleLimit / 10000 + 'w' : card.singleLimit}/{card.dayLimit < 0 ? '不限': card.dayLimit % 10000 === 0 ? card.dayLimit / 10000 + 'w' : card.dayLimit}/{card.monthLimit < 0 ? '不限': card.monthLimit % 10000 === 0 ? card.monthLimit / 10000 + 'w' : card.monthLimit}</p>
                    </div>
                  </li>
                })
              }
            </ul>
            <img className="bottom_bg" src={require('../../images/userCenter/common-bg.png')} alt=""/>
          </div>
        );
    }
}


export default template({
    id: 'applyRecord',  //应用关联使用的redux
    component: Main, //接收数据的组件入口
    url: ''
});
