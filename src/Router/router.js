import React, {Component, PropTypes} from 'react';
import { Router, Route, Redirect, IndexRoute, browserHistory, hashHistory } from 'react-router';
import Index from '../Component/index';
import Footer from '../Component/FooterView';
/*=================
   router.jsx 组件
  专门用来管理路由的
==================*/
/**
Page2 组件按需加载
*/
const page2 = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('../Component/Page2').default)
    },'page2')
}
const page1 = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('../Component/Page1').default)
    },'page1')
}

const RouteConfig =(
  <Router history={browserHistory}>
    <Route path="/" component={Footer}>
        <IndexRoute component={Index}/>
        <Route path='/page1' getComponent={page1}/>
        <Route path='/page2' getComponent={page2}/>
    </Route>
  </Router>
)
export default RouteConfig
