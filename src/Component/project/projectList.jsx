import React, {Component, PropTypes} from 'react';
import pureRender from 'pure-render-decorator';
import { connect } from 'react-redux';
import {browserHistory, Link } from 'react-router';
import { is, fromJS} from 'immutable';
import {Tool} from '../../Config/Tool';
import {number} from '../../filters/custom'
import {PayUtils} from '../../Config/payUtils';
import {dates} from '../../filters/custom'
import {Footer,template, Loading} from '../common/mixin';
import '../../Style/project'


class Main extends Component {
    constructor(props,context) {
        super(props,context);
        this.state = {
            loading: Boolean,
            data:[],  //分销商列表数组
            activeTab: String,
            choosedClass:'team_choosed', //当前选中的类别，以此设置class名
            currentPage:1, //当前所在页数
            totalPage: 1,//总共的页数
            limit:20 ,  //每页加载的数量
            shouldUpdata:true,  //当获取数据后才能进行加载,
            noData: require('../../images/project/no-data.png'),
            projectStatus: 9,
            balance: 100,
            balanse: 0
        }
        // 查账户余额
        this.props.getData(process.env.WEB_DEFAULT_DOMAIN + '/enterpriseUser/getEnterpriseUserInfo',{},(res) => {
            if (res.ret === -1) {
                console.log(res.msg)
            }else{
                this.setState({
                    balance: res.data.account.balance
                })
            }
        },'')
    
        this.chooseStatus = (page, pageSize, status, tab) => { //筛选类型
            this.setState({loading: false})
            this.setState({activeTab: tab})
            browserHistory.replace('/project/projectList?tab=' + tab)
            this.props.getData(process.env.RESTFUL_DOMAIN + '/enterpriseProjects/projects',{page:page, pageSize: pageSize,status:status}, (res) => {
                this.setState({loading: true})
                if (res && res.ret !== -1) {
                    let dataList = this.state.data.concat(res.data)
                    if (dataList.length <= 2) {
                        document.getElementsByClassName('projects')[0].style.height = window.innerHeight + 'px'
                    }
                    this.setState({
                        data: dataList,
                        totalPage:res.totalPage
                    })
                }else{
                    document.getElementsByClassName('projects')[0].style.height = window.innerHeight + 'px'
                    Tool.alert(res.msg)
                    res.code === -1000 ? browserHistory.replace('/login') : null
                }
            }, 'changeType')
        }
        this.getNextPage = () => { //加载下一页
            this.setState({currentPage: this.state.currentPage + 1})
            this.state.activeTab === '0' ? this.chooseStatus(this.state.currentPage + 1, 3, 9, '0') : this.chooseStatus(this.state.currentPage + 1, 3,10, '1')
        }
        this.repayment = function(projectId, repaymentAmount, repaymentNo) { // 还款
            if (repaymentAmount > this.state.balance) {
              Tool.alert('账户余额不足，请先充值');
              browserHistory.push('/userCenter/recharge')
              return;
            }
            this.setState({loading: false})
            this.props.getData(process.env.WEB_DEFAULT_DOMAIN+ '/enterpriseYeepay/repayment', {
                projectId: projectId,
                repaymentNo: repaymentNo,
                from: 5
            }, (res) => {
                this.setState({loading: true})
                if (res && res.ret !== -1) {
                    PayUtils.redToTrusteeship('toRepayment', res);
                } else {
                    Tool.alert(res.msg)
                }
            })
            
        }
        this.toProjectDetai = (number, projectId) => {
            let path = {
                pathname:'/project/projectDeatil',
                state: {number: number, projectId: projectId}
            }
            browserHistory.push(path)
        }
    }

    componentWillUpdate(nextProps, nextState) {
        if (this.state.activeTab !== nextState.activeTab) { // tab切换清空data
            this.setState({data: [], currentPage: 1})
        }
    }
    componentDidMount (props) {
        this.props.location.query.tab == '1' ? this.chooseStatus(1, 3, 10, '1') : this.chooseStatus(1, 4, 9, '0')
    }
    render() {
        let ms = 28 * 24 * 60 * 60 * 1000
        return (
            <div ref='Container' className="projects">
                {!this.state.loading && <Loading />}
                <nav className='team_nav'>
                   <ul className='clear'>
                       <li className={!this.state.activeTab || this.state.activeTab === '0' ? this.state.choosedClass:null} onClick={this.chooseStatus.bind(this, 1, 4, 9, '0')}><p>待还款</p></li>
                       <li className={this.state.activeTab === '1' ? this.state.choosedClass:null} onClick={this.chooseStatus.bind(this, 1, 3, 10, '1')}><p>已结清</p></li>
                   </ul>
               </nav>
               {
                   this.state.data && this.state.data.length > 0 ?
                   this.state.activeTab === '0' ?
                   this.state.data.map((project , index) => {
                       return project.projectBills.map((projectBill, index) =>{
                        
                            return projectBill.status === 0 ? <li key={index} className="project_list clear">
                                <p className="list_item_title">最近还款项目: <span>{project.project.name}</span></p>
                                <div className="list_item">
                                    <p>借款金额(元): <span>{number(project.project.total)}</span></p>
                                    <p>年化利率(%): <span>{project.project.annualEarnings}</span></p>
                                </div>
                                <div className="list_item">
                                    <p>已还金额(元): <span>{project.projectInfo.projectBackTotal - projectBill.remainInterest - projectBill.remainPrincipal - projectBill.repaymentAmount < 1 ? 0 : number(project.projectInfo.projectBackTotal - projectBill.remainInterest - projectBill.remainPrincipal - projectBill.repaymentAmount)}</span></p>
                                    <p>已还期数: <span>{projectBill.repaymentNo - 1}/{project.project.cycle}</span><span className="ft_s">期</span></p>
                                </div>
                                <div className="list_item">
                                    <p>本期还款(元): <span>{number(projectBill.repaymentAmount)}</span></p>
                                    <p>还款日期: <span>{dates(projectBill.repaymentTime,'.')}</span></p>
                                </div>
                                <div className="project-btns clear pass">
                                    <div className="btns-son">
                                        <span onClick={this.toProjectDetai.bind(this, project.project.number, project.project.id)} className={`left ${(projectBill.repaymentTime - new Date().getTime()) >= ms? 'one' : ''}`}>查看详情</span>
                                        {
                                            (projectBill.repaymentTime - new Date().getTime()) < ms ?
                                            <span onClick={this.toRealName} className="right" onClick={this.repayment.bind(this, project.project.id, projectBill.repaymentAmount, projectBill.repaymentNo)}>立即还款({projectBill.repaymentNo}/{project.project.cycle})</span> : null
                                        }
                                    </div>
                                </div>
                            </li> : null
                       })
                    }) :
                    this.state.data.map((project , index) => {
                        return <li key={index} className="project_list clear pass">
                                <p className="list_item_title">借款项目: <span>{project.project.name}</span></p>
                                <div className="list_item">
                                    <p>借款金额(元): <span>{number(project.project.total)}</span></p>
                                    <p>年化利率(%): <span>{project.project.annualEarnings}</span></p>
                                </div>
                                <div className="list_item">
                                    <p>已还金额(元): <span>{number(project.projectInfo.projectBackTotal)}</span></p>
                                    <p>本息两清日: <span>{dates(project.project.repaymentDate, '.')}</span></p>
                                </div>
                                <div className="project-btns clear">
                                    <div className="btns-son">
                                        <span className="left one" onClick={this.toProjectDetai.bind(this, project.project.number, project.project.id)}>查看详情</span>
                                    </div>
                                </div>
                            </li>
                        })
                    :
                    <div className="no_data">
                        <img src={this.state.noData} alt="" width="40%"/>
                        <p>暂无数据</p>
                    </div>
                }
                {
                    this.state.currentPage < this.state.totalPage ?
                    <div className='get_more' onClick={this.getNextPage}>
                        点击查看更多
                    </div> : null
                }
                <Footer/>
            </div>
        );
    }
}


export default template({
    id: 'index',  //应用关联使用的redux
    component: Main, //接收数据的组件入口
});
