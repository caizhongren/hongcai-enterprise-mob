import React, {Component, PropTypes} from 'react';
import pureRender from 'pure-render-decorator';
import { connect } from 'react-redux';
import { is, fromJS} from 'immutable';
import { template, Loading} from '../common/mixin';
import {Tool} from '../../Config/Tool'
import {date} from '../../filters/custom'
import '../../Style/deal.less'


/**
 * (导出组件)
 * 
 * @export
 * @class Main
 * @extends {Component}
 */

class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
          aside:null,
          dealType: [
            {
              'type': '全部',
              'no': '',
            },{
              'type': '放款',  //包含：项目正常回款、债权转让回款
              'no': '6'
            },{
              'type': '充值',
              'no': '1'
            },{
              'type': '提现',  
              'no': '2'
            },{
              'type': '还款',  
              'no': '7,3,5'
            },{
              'type': '其他',  
              'no': '4,5,8,9,10,25,26'
            }
          ],
          selected: '全部',
          showHide: 'none',
          disableScroll: '',
          dealList: [],
          page: 1,
          pageSize: 3,
          totalPage: 1,
          type: '',
          loading: false,
        }
        this.toggleSelect = (deal) => {
          this.setState({
            dealList: [],
            selected: deal.type,
            page: 1,
            pageSize: 3,
            type: deal.no
          }, () => {
            this.getDealList(this.state.page, this.state.pageSize, deal.no);
            this.select();
          })
        }

        this.select = () => {
          this.state.showHide === 'none' ? this.setState({disableScroll: 'fixed'}) : this.setState({disableScroll: 'relative'})
          this.state.showHide === 'none' ? this.setState({showHide: 'block'}) : this.setState({showHide: 'none'})
        }
        this.getDealList = (page, pageSize, type) => {
          this.setState({loading: true})
          this.props.getData(process.env.RESTFUL_DOMAIN + '/users/0/deals',{
            page: page,
            pageSize: pageSize,
            types: type,
          },(res) => {
            if (res && res.ret !== -1) {
              this.setState({loading: false})
              let dealList = this.state.dealList.concat(res.data)
              this.setState({
                dealList: dealList,
                totalPage: res.totalPage,
              })
            }else{
              Tool.alert(res.msg)
            }
            this.setState({
              preventMountSubmit:true,
              loading: false,
            })
          },'')
        }

        this.loadMore = (page) => {
          this.setState({
          page: (this.state.page + 1),
        })
          this.getDealList(this.state.page + 1, this.state.pageSize, this.state.type) 
        }

        this.getAllTypes = () => {
          let otherTypes = []
          this.props.getData(process.env.RESTFUL_DOMAIN + '/deals/types', {}, (res) => {
            if (res && res.ret !== -1) {
              for(var key in res){
                key == 1 || key == 2 || key == 6 || key == 7 ? null : otherTypes.push(key)
              }
              console.log(otherTypes.toString())

            } else {
            }
          }, '')
        }
    }

    componentDidMount () {
      this.setState({loading: true})
      setTimeout(() => {
        this.setState({loading: false})
      }, 5000)
      this.getAllTypes()
      this.getDealList(this.state.page, this.state.pageSize, this.state.type)
    }
    componentWillUpdate(nextProps, nextState) {
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state),fromJS(nextState))
    }
    
    render() {
      this.state.aside = (<aside className='mask-type' style={{display:this.state.showHide}}>
        <ul className='allType'>
          {
            this.state.dealType.map((item , index) => {
              return <li className={`ft-666 ${this.state.selected === item.type ? 'ft-39c': ''}`} key={index}  onClick={this.toggleSelect.bind(this,item)}>{item.type}</li>
            })
          }
        </ul>
      </aside>)
        return (
            <div className="deal">
              {this.state.loading && <Loading />}
              <div className="column dealType" onClick={this.select}>
                <span className="txt-left fl">{this.state.selected}</span>
                <div className="txt-right fr">
                  <span className={`deal-angle-down ${this.state.showHide === 'block' ? 'deal-angle-up' : ''}`}></span>
                </div>
              </div>
              {this.state.aside}
              {
                this.state.dealList.length > 0 ?
                <div>
                  <ul className="dealList" style={{position:this.state.disableScroll}}>
                    {
                      this.state.dealList.map((item , index) => {
                        return <li key={index}>
                        <div className="title">
                          <p className="fl">{item.description}</p>
                          <p className={`amount fr ${item.getAmount>0 ? 'ft-red' : 'ft-green'}`}>{item.getAmount>0 ? '+' + item.getAmount : '-' + item.payAmount}元</p>
                        </div>
                        <div className="dateBalance">
                          <p className="fl">{date(item.createTime)}</p>
                          <p className="fr">余额 : {item.balance}元</p>
                        </div>
                      </li>
                      })
                    }
                  </ul>
                  { this.state.totalPage > this.state.page && <p className="loadMore" onClick={this.loadMore}>查看更多</p>}
                </div>
                :
                  <div className="noDeal">
                    <img src={require('../../images/userCenter/deal-list.png')} width="45%"/>
                    <p>您还没有资金流水记录哦～</p>
                  </div>
              }
            </div>
        );
    }
}


export default template({
    id: 'helpCenter',  //应用关联使用的redux
    component: Main, //接收数据的组件入口
});
