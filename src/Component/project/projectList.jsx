import React, {Component, PropTypes} from 'react';
import pureRender from 'pure-render-decorator';
import { connect } from 'react-redux';
import {browserHistory, Link } from 'react-router';
import { is, fromJS} from 'immutable';
import {Tool} from '../../Config/Tool';
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
            activeTab: 0,
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
    
        this.chooseStatus = (page, pageSize, status) => { //筛选类型
            this.setState({loading: false})
            if (this.state.activeTab === 0 && status === 10) {
                this.setState({activeTab: 1, projectStatus: status})
            } else if (this.state.activeTab === 1 && status === 9) {
                this.setState({activeTab: 0, projectStatus: status})
            }
            this.props.getData(process.env.RESTFUL_DOMAIN + '/enterpriseProjects/projects',{page:page, pageSize: pageSize,status:status, token: '825c5090f81f003f8fdbbb6543d6894f1ae54ec43430a554'}, (res) => {
                this.setState({loading: true})
                if (res && res.ret !== -1) {
                    let dataList = this.state.data.concat(res.data)
                    if (dataList.length <= 0) {
                        document.getElementsByClassName('projects')[0].style.height = window.innerHeight + 'px'
                    }
                    this.setState({
                        data: dataList,
                        totalPage:res.totalPage
                    })
                }else{
                    document.getElementsByClassName('projects')[0].style.height = window.innerHeight + 'px'
                    Tool.alert(res.data.msg)
                }
            }, 'changeType')
        }

        this.getNextPage = () => { //加载下一页
            this.setState({currentPage: this.state.currentPage + 1})
            this.state.activeTab === 0 ? this.chooseStatus(this.state.currentPage + 1, 3, 9) : this.chooseStatus(this.state.currentPage + 1, 3,10)
        }
        this.repayment = function(projectId, repaymentAmount, repaymentNo) { // 还款
            this.setState({loading: false})
            if (repaymentAmount > this.state.balance) {
              Tool.alert('账户余额不足，请先充值');
              return;
            }
            this.props.getData(process.env.WEB_DEFAULT_DOMAIN+ '/enterpriseYeepay/repayment', {
                projectId: projectId,
                repaymentNo: repaymentNo,
                from: 5,
                token: '825c5090f81f003f8fdbbb6543d6894f1ae54ec43430a554'
            }, (res) => {
                this.setState({loading: true})
                if (res && res.ret !== -1) {
                    PayUtils.redToTrusteeship('toRepayment', res);
                } else {
                    Tool.alert(res.msg)
                }
            })
            
        }
        this.toProjectDetai = (number) => {
            browserHistory.push('/project/projectDetail/' + number)
        }
    }

    componentWillUpdate(nextProps, nextState) {
        if (this.state.activeTab !== nextState.activeTab) { // tab切换清空data
            this.setState({data: [], currentPage: 1})
        }
    }
    componentDidMount () {
        this.chooseStatus(1, 4, 9)
    }
    render() {
        let ms = 28 * 24 * 60 * 60 * 1000
        return (
            <div ref='Container' className="projects" style={{height: this.state.height}}>
                {!this.state.loading && <Loading />}
                <nav className='team_nav'>
                   <ul className='clear'>
                       <li className={this.state.activeTab === 0 ? this.state.choosedClass:null} onClick={this.chooseStatus.bind(this,1, 4,9)}><p>待还款</p></li>
                       <li className={this.state.activeTab === 1 ? this.state.choosedClass:null} onClick={this.chooseStatus.bind(this,1, 3, 10)}><p>已结清</p></li>
                   </ul>
               </nav>
               {
                   this.state.data.length > 0 ?
                   this.state.activeTab === 0 ?
                   this.state.data.map((project , index) => {
                       return project.projectBills.map((projectBill, index) =>{
                        
                            return projectBill.status === 0 ? <li key={index} className="project_list clear">
                                <p className="list_item_title">最近还款项目：<span>{project.project.name}</span></p>
                                <div className="list_item">
                                    <p>借款金额(元)： <span>{project.project.total}</span></p>
                                    <p>年化利率(%)：<span>{project.project.annualEarnings}</span></p>
                                </div>
                                <div className="list_item">
                                    <p>已还金额(元)： <span>88000</span></p>
                                    <p>已还期数：<span>{projectBill.repaymentNo - 1}/{project.project.cycle}</span><span className="ft_s">期</span></p>
                                </div>
                                <div className="list_item">
                                    <p>本期还款(元)： <span>{projectBill.repaymentAmount}</span></p>
                                    <p>还款日期：<span>{dates(project.project.repaymentDate,'.')}</span></p>
                                </div>
                                <div className="project-btns clear pass">
                                    <div className="btns-son">
                                        <Link to="/project/projectDetail"><span className={`left ${Math.abs(project.project.repaymentDate - new Date().getTime()) >= ms ? 'one' : ''}`}>查看详情</span></Link>
                                        {
                                            Math.abs(project.project.repaymentDate - new Date().getTime()) < ms ?
                                            <span onClick={this.toRealName} className="right" onClick={this.repayment.bind(this, project.project.id, project.project.repaymentAmount, projectBill.repaymentNo)}>立即还款({projectBill.repaymentNo}/{project.project.cycle})</span> : null
                                        }
                                    </div>
                                </div>
                            </li> : null
                       })
                    }) :
                    this.state.data.map((project , index) => {
                        return <li key={index} className="project_list clear pass">
                                <p className="list_item_title">借款项目：<span>{project.project.name}</span></p>
                                <div className="list_item">
                                    <p>借款金额(元)： <span>{project.project.total}</span></p>
                                    <p>年化利率(%)：<span>{project.project.annualEarnings}</span></p>
                                </div>
                                <div className="list_item">
                                    <p>已还金额(元)： <span>{(project.projectInfo.projectBackProfit).toFixed(2)}</span></p>
                                    <p>本息两清日：<span>{dates(project.project.repaymentDate, '.')}</span></p>
                                </div>
                                <div className="project-btns clear">
                                    <div className="btns-son">
                                        <span className="left one" onClick={this.toProjectDetai.bind(this, project.project.number)}>查看详情</span>
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
