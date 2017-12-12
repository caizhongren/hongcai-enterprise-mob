import React, {Component, PropTypes} from 'react';
import { Link, IndexLink } from 'react-router';
import pureRender from 'pure-render-decorator';
import { is, fromJS} from 'immutable';
import { Tool } from '../../Config/Tool';
import template from './template';
export {template}

/**
 * 公共头部
 *
 * @export
 * @class Header
 * @extends {Component}
 */


export class Header extends Component {  //头部标题
    constructor(props,context) {
        super(props,context);
        this.state = {
            showHide :'none', // 显示右侧菜单，默认隐藏
        }

        this.showNav = () => { //显示右侧导航栏
            if (this.state.showHide == 'block') {
                this.setState({showHide:'none'})
            }else{
                this.setState({showHide:'block'})
            }
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state),fromJS(nextState))
    }
    
    render() {
        let {nav, saleRecord ,title ,HideList,goback ,save,productsInform,applyRecord,params} = this.props;
        let navState = this.state.showHide;
        let indexNavStyle = {}
        if (nav) {
            nav = (
                <div className='head_menu' onClick={this.showNav}>
                    <ul className='head_listname'  style={{display:navState}} >
                        <li>
                            <IndexLink to="/">
                                <span>销售录入</span>
                                <span className='head_arrow'></span>
                            </IndexLink>
                        </li>
                        <li>
                            <Link to='/allDeposit'>
                                <span>提现</span>
                                <span className='head_arrow'></span>
                            </Link>
                        </li>
                        <li>
                            <Link to='/helpCenter'>
                                <span>帮助中心</span>
                                <span className='head_arrow'></span>
                            </Link>
                        </li>
                    </ul>
                </div>
            );
        }
        
        if (goback&&params) {
            goback = ( <Link to={'/index'+params} className='head_goback left'>返回</Link>)
        }else if (goback){
            goback = (<span className='head_goback left' onClick={() => window.history.back()}>返回</span>)
        }

        if (title&&title == '销售录入') {
            indexNavStyle = {position:'absolute'}
        }

        return (
            <header className="head-list" style={indexNavStyle}>
                {nav}
                {goback}

                {
                    saleRecord&&<Link to="/saleRecord" className='head_icon_right'></Link>
                }

                {
                    title&&<span className='head_title'>{title}</span>
                }

                {
                    save&&<Link to={'/index'+params} className='head_save right'>确定</Link>
                }

                {
                    applyRecord&&<Link to="/applyRecord" className='head_icon_right head_applyrecord_right'></Link>
                }
            </header>
        );
    }
}


/**
 * 公共底部
 *
 * @export
 * @class Footer
 * @extends {Component}
 */

 export class Footer extends Component { 
    constructor(props){
        super(props);
    }
    render(){
        return(
        <ul role="nav" className="footer">
            {/* <li><IndexLink to="/" activeClassName="active"><img src={require('../../images/tabbar1.png')}/>账户总览</IndexLink></li> */}
            <li><IndexLink to="/" activeClassName="active">账户总览</IndexLink></li>
            <li><Link to="/applyRecord" activeClassName="active">我的借款</Link></li>
        </ul>
        )
    }
    shouldComponentUpdate(nextProps, nextState){
       return  true;
    }
}

/**
 * 注册、登录 公共头部
 *
 * @export
 * @class HongcaiHeader
 * @extends {Component}
 */
export class HongcaiHeader extends Component { 
    constructor(props){
        super(props);
    }
    render(){
        return(
            <div className='hongcai-header'></div>
        )
    }
    shouldComponentUpdate(nextProps, nextState){
       return  true;
    }
}

/**
 * 注册、登录 公共底部
 *
 * @export
 * @class HongcaiFooter
 * @extends {Component}
 */
export class HongcaiFooter extends Component { 
    constructor(props){
        super(props);
    }
    render(){
        return(
            <div className="hongcai-footer">
                <p>国企战略投资A轮1亿元</p>
                <p>海口联合农商银行正式存管</p>
            </div>
        )
    }
    shouldComponentUpdate(nextProps, nextState){
       return  true;
    }
}
/**
 * loading
 *
 * @export
 * @class Loading
 * @extends {Component}
 */
import '../../Style/loading' 
export class Loading extends Component {
    render () {
        return (
            <div>
                <div className="weui-mask_transparent"></div>
                <div className="weui-toast">
                    <i className="weui-loading weui-icon_toast"></i>
                    <p className="weui-toast__content">数据加载中...</p>
                </div>
            </div>
        )
    }
}
