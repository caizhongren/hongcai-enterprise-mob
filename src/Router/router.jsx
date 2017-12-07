import React, {Component, PropTypes} from 'react';
import { Router, Route, Redirect, IndexRoute, browserHistory, hashHistory } from 'react-router';
import Index from '../Component/Index.jsx';
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
const about = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('../Component/About').default)
    },'about')
}
const login = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('../Component/Login').default)
    },'login')
}
const RouteConfig =(
  <Router history={browserHistory}>
     <Route path='/' component={Index}/>
     <Route path='/page2' getComponent={page2}/>
     <Route path='/about' getComponent={about}/>
     <Route path='/login' getComponent={login}/>
  </Router>
)
export default RouteConfig
