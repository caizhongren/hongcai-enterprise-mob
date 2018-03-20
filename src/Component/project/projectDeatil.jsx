import React, {Component} from 'react';
import {Link, browserHistory } from 'react-router';
import { is, fromJS} from 'immutable';
import {Tool} from '../../Config/Tool';
import {template, Loading} from '../common/mixin';
import {dates} from '../../filters/custom';
import '../../Style/projectDeatil.less';

class Main extends Component {
    constructor() {
      super();
      this.state = {
        payAmount: 0,  //应还金额
        preventMountSubmit:true,//防止重复提交
        projectBills: [],
        projects: {
          name: '',
          LoanAmount: 0, //借款金额
          LoanTime: '',
          repaymentDate: '',
          loanState: Number
        },
        loading: false,
      }

      this.getProjectDetail =(projectId) => {
        let that = this
        that.props.getData(process.env.RESTFUL_DOMAIN + '/projects/' + projectId+ '/detail',{},(res) => {
          if (res && res.ret !== -1) {
            that.setState({
              projects: {
                name: res.name,
                LoanAmount: res.total, //借款金额
                repaymentDate: res.repaymentDate,
                loanState: res.status,
                LoanTime: res.loanTime
              }
            })
          }else{
            Tool.alert(res.msg)
          }
          that.setState({
            preventMountSubmit:true,
            loading: true
          })
        },'')

        that.props.getData(process.env.RESTFUL_DOMAIN + '/projects/' + projectId+ '/info',{},(res) => {
          if (res && res.ret !== -1) {
            that.setState({
              payAmount: res.projectBackTotal, 
            })
          }else{
            Tool.alert(res.msg)
          }
          that.setState({
            preventMountSubmit:true,
            loading: true
          })
        })
      }

      this.getProjectBill = (projectNum) => {
        let that = this
        that.props.getData(process.env.RESTFUL_DOMAIN + '/projects/' + projectNum+ '/projectBills',{},(res) => {
          if (res && res.ret !== -1) {
            let projectBills = that.state.projectBills.concat(res)
            that.setState({
              projectBills: res,
            })
          }else{
            Tool.alert(res.msg)
          }
          that.setState({
            preventMountSubmit:true,
            loading: true
          })
        })
      }
    }

    componentWillMount() {
    }
    componentDidMount() {
      this.props.location.state ? (
        this.getProjectBill(this.props.location.state.number ||''),
        this.getProjectDetail(this.props.location.state.projectId ||'')
      ) : (Tool.alert('请先从列表页进入详情'), browserHistory.push('/project/projectList'))
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
        <div className="projectDeatil">
          {!this.state.loading && <Loading />}
          <ul className="header">
            <div className="title">{this.state.projects.name}</div>
            <li>
              <p>{this.state.projects.LoanAmount}元</p>
              <p>借款金额</p>  
            </li>  
            <li>
              <p>{this.state.payAmount}元</p>
              <p>应还金额</p>  
            </li>      
          </ul>
          <div className="creditRight repayment-plan">
          <div className="each-line">
            <div className={`column1 ${this.state.projects.loanState === 9 || this.state.projects.loanState === 10 ? 'ft_999' : ''}`}><span className={this.state.projects.loanState === 9 || this.state.projects.loanState === 10 ? 'ed' : ''}>预计</span>{dates(this.state.projects.LoanTime, '-')}</div>
            <div className="column2">
              <span className={`circle ${this.state.projects.loanState === 9 || this.state.projects.loanState === 10 ? 'ed' : ''}`}></span>
              <span className={`vertical-line ${this.state.projects.loanState === 9 || this.state.projects.loanState === 10 ? 'ed' : ''}`}></span>
            </div>
            <div className={`column3 ${this.state.projects.loanState === 9 || this.state.projects.loanState === 10 ? 'ft_999' : ''}`}>
              项目放款：{this.state.projects.LoanAmount}元 <br/>
              开始计息
            </div>
          </div>
          { this.state.projectBills.map((item , index) => {
            return (
              <div className={`each-line ${item.status === 1 ? 'ed': ''}`} key={index}>
                <div className="column1"><span className={item.status === 1  ? 'ed' : ''}>预计</span>{item.status === 1 ? dates(item.realRepaymentTime, '-') : dates(item.repaymentTime, '-')}</div>
                <div className="column2">
                  <span className={`circle ${item.status === 1 ? 'ed' : ''}`}></span>
                  <span className={`vertical-line ${index === this.state.projectBills.length-1 ? 'hidden' : this.state.projectBills[index+1].status === 1 ? 'ed' : ''}`}></span>
                </div>
                <div className="column3">
                  {item.status === 1 ? '已还金额' : '待还金额'}：{item.repaymentAmount}元 <br/>
                  <span className={index === this.state.projectBills.length -1? 'ed' : ''}>{index === this.state.projectBills.length -1 && item.status === 1 ? '本息结清' : ''}</span><br/>
                </div>
              </div>
            )
            })
          } 
          </div>
        </div>
      )
    }
}

export default template({
    id: 'index',  //应用关联使用的redux
    component: Main,//接收数据的组件入口
    url: '',
});

