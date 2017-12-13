import React, {Component, PropTypes} from 'react';
import pureRender from 'pure-render-decorator';
import { connect } from 'react-redux';
import { is, fromJS} from 'immutable';
import { Header,template} from '../common/mixin';
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
          aside:null, // 右侧列表的对象
          dealType: [
            {
              'type': '全部',
              'no': '',
            },{
              'type': '放款',  //包含：项目正常回款、债权转让回款
              'no': '4,16'
            },{
              'type': '充值',
              'no': '1'
            },{
              'type': '提现',  
              'no': '2'
            },{
              'type': '还款',  
              'no': '18,20,27,28,29,30'
            },{
              'type': '其他',  //包含：提现手续费、债权转让手续费
              'no': '8,15'
            }
          ],
          selected: '全部',
          showHide: 'none',
          dealList: [],
          page: 1,
          pageSize: 3,
          totalPage: 1,
        }
        this.toggleSelect = (deal) => {  //确定当前选中的商品
          console.log(deal)
          this.setState({
            selected: deal.type
          })
          this.select()
        }

        this.select = () => {
          this.state.showHide === 'none' ? this.setState({showHide: 'block'}) : this.setState({showHide: 'none'})
        }
        this.getDealList = (page, pageSize) => {
          this.props.getData(process.env.WEB_DEFAULT_DOMAIN + '/siteUser/getDealListByUser',{
            page: page,
            pageSize: pageSize
          },(res) => {
            if (res && res.ret !== -1) {
              for (var i = 0; i < res.data.dealList.length; i++) {
                this.state.dealList.push(res.data.dealList[i]);
                
              }


              console.log(this.state.dealList)
            }else{
              Tool.alert(res.msg)
            }
            this.setState({
              preventMountSubmit:true,
              loading: false,
            })
            this.setState({
              dealList: this.state.dealList,
              totalPage: Math.ceil(res.data.count / pageSize),
            })
          },'')
        }

        this.loadMore = (page) => {
          this.setState({
          page: (this.state.page + 1),
        })
          this.getDealList(this.state.page + 1, this.state.pageSize-1)
          
        }
    }
    componentDidMount () {
      this.getDealList(this.state.page, this.state.pageSize)
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
              <div className="column dealType" onClick={this.select}>
                <span className="txt-left fl">{this.state.selected}{this.state.totalPage}</span>
                <div className="txt-right fr">
                  <span className={`deal-angle-down ${this.state.showHide === 'block' ? 'deal-angle-up' : ''}`}></span>
                </div>
              </div>
              {this.state.aside}
              {
                this.state.dealList.length > 0 ?
                <div>
                  <ul className="dealList">
                    {
                      this.state.dealList.map((item , index) => {
                        return <li key={index}>
                        <div className="title">
                          <p className="fl">{item.description}</p>
                          <p className={`amount fr ${item.getAmount>0 ? 'ft-red' : 'ft-green'}`}>{item.getAmount>0 ? '+' + item.getAmount : '-' + item.payAmount}</p>
                        </div>
                        <div className="dateBalance">
                          <p className="fl">{item.createTime}</p>
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
