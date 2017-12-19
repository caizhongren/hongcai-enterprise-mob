let SessionService = {}
SessionService.set = () => {
  return sessionStorage.setItem(key, value);
}
SessionService.get = () => {
  return sessionStorage.getItem(key);
}

SessionService.checkSession = () => {
  var lastCheckTime = sessionStorage.getItem('lastCheckTime') ? sessionStorage.getItem('lastCheckTime') : 0;
  if(new Date().getTime() - Number(lastCheckTime) > 20 * 60 * 1000){
    sessionStorage.setItem('isLogin', 'false');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('userAuth');
  } else {
    sessionStorage.setItem('lastCheckTime', new Date().getTime() + '');
  }

  if(!sessionStorage.getItem('isLogin')){
    sessionStorage.setItem('isLogin', 'false');
  }

}
/**
 * 退出登录，清除session
 */
SessionService.destory = () => {
  sessionStorage.setItem('isLogin', 'false');
  sessionStorage.removeItem('user');
  sessionStorage.removeItem('userAuth');

  return true;
}
SessionService.removeUserAuth = () => {
  sessionStorage.removeItem('userAuth');
}

/**
 * 获取session中用户信息
 */
SessionService.getUser = () => {
  SessionService.checkSession();
  return sessionStorage.getItem('user') ?  JSON.parse(sessionStorage.getItem('user')) : undefined;
}

/**
 * 是否登录
 */
SessionService.isLogin = () => {
  SessionService.checkSession();
  return sessionStorage.getItem('isLogin') === 'true';
}

// 未和服务器校验过是否登录
SessionService.hasCheckLogin = () => {
  return sessionStorage.getItem('hasCheck') != null && sessionStorage.getItem('isLogin') != undefined;
}

/**
 * 登录成功，将user相关信息放入session storage中
 */
SessionService.loginSuccess = (user) => {
  sessionStorage.setItem('isLogin', 'true');
  sessionStorage.setItem('lastCheckTime', new Date().getTime() + '');
  SessionService.removeUserAuth();
  return sessionStorage.setItem('user', JSON.stringify(user));
}

SessionService.checkLogin = () => {
  sessionStorage.setItem('hasCheck', '1');
}

/**
 * 如果用户已实名认证，则缓存
 */
SessionService.setUserAuthIfAuthed = (userAuth) => {
  if(userAuth && userAuth.authStatus == 2 && userAuth.status == 2){
    sessionStorage.setItem('userAuth', JSON.stringify(userAuth));
  }
}

SessionService.getUserAuth = () => {
  SessionService.checkSession();
  return sessionStorage.getItem('userAuth') ?  JSON.parse(sessionStorage.getItem('userAuth')) : undefined;
}

export {SessionService}