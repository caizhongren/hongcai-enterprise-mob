
import * as config from './Config';

const {target} = config;
export const Tool = {};
export const Count = {
    second: 60,
    canGetMobileCapcha: true
};

Tool.paramType = data => {
    let paramArr = []; 
    let paramStr = ''; 
    for (let attr in data) {
        paramArr.push(attr + '=' + data[attr]);
    }
    paramStr = paramArr.join('&');
    paramStr = '?' + paramStr;
    return paramStr
}


Tool.ajax = url => {
  return new Promise((resolve, reject) => {
    let xml = new XMLHttpRequest();
    xml.open('get',url,true);
    xml.onload = resolve;
    xml.onerror = reject;
    xml.send();
  } )
}

Tool.isAndroid = data => {
    let userAgent = navigator.userAgent || navigator.vendor || window.opera
    return /android/i.test(userAgent) && !/windows phone/i.test(userAgent)
}

Tool.isIos = data =>  {
    let userAgent = navigator.userAgent || navigator.vendor || window.opera
    return /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream
}


let alertText = document.createElement('div');
alertText.setAttribute('id','alertText');

let successText = document.createElement('div');
successText.setAttribute('id','successText');


let alertDom = document.createElement('div');
alertDom.setAttribute('id','alertTip');
alertDom.appendChild(alertText);

let successDom = document.createElement('div');
successDom.setAttribute('id','successTip');
successDom.appendChild(successText);

document.body.appendChild(alertDom);
document.body.appendChild(successDom);
let timer = null;
Tool.alert =  (msg,msg2) => {
    clearTimeout(timer);
    if (msg2) {
        alertText.innerHTML = msg+'<div class="alert_bottom">'+msg2+'</div>';
    }else{
        alertText.innerHTML = msg;
    }
    alertDom.style.display = 'block';
    alertDom.onclick = () => {
        clearTimeout(timer);
        alertDom.style.display = 'none';
    }
    timer = setTimeout( () => {
       alertDom.style.display = 'none';
       clearTimeout(timer);
    },3000)
}

Tool.success =  (msg) => {
    clearTimeout(timer);
    successText.innerHTML = msg;
    successDom.style.display = 'block';
    successDom.onclick = () => {
        clearTimeout(timer);
        successDom.style.display = 'none';
    }
    timer = setTimeout( () => {
       successDom.style.display = 'none';
       clearTimeout(timer);
    },2000)
}

Tool.getStyle =  (obj,attr) => { 
    if(obj.currentStyle){ 
        return obj.currentStyle[attr]; 
    } 
    else{ 
        return document.defaultView.getComputedStyle(obj,null)[attr]; 
    } 
} 


Tool.nextPage = (dom,currentPage,totalPage,callback,shouldUpdata) => { //分页
    let updata = shouldUpdata;
    let page = currentPage;
    let height = 0;
    let windowHeight = window.screen.height;
    let setTop = 0;
    let Bottom = 0;
    let oldScrollTop = 0;
    let timer = null;
    dom.addEventListener('touchstart',() => {
        height = dom.offsetHeight;
        setTop = dom.offsetTop;
        Bottom = parseInt(Tool.getStyle(dom,'marginBottom'));
    },false)
    dom.addEventListener('touchmove',() => {
       loadMore();
    },false)
    dom.addEventListener('touchend',() => {
       oldScrollTop = document.body.scrollTop
        moveEnd()
    },false)
    
    let requestID;
    const moveEnd = () => {
        requestID = requestAnimationFrame(() => {
            if (document.body.scrollTop != oldScrollTop) {
                oldScrollTop = document.body.scrollTop;
                moveEnd()
            }else{
                loadMore();
            }
        })
    }

    const loadMore = () => {
        if ((page < totalPage)&&(updata==true)) {
            if (document.body.scrollTop+windowHeight >= height+setTop+Bottom) {
                cancelAnimationFrame(requestID)
                page++;
                updata = false;
                callback(page);
            }
        }
    }

}
Count.countDown = ($mobilecode) => {
    // 如果秒数还是大于0，则表示倒计时还没结束
    if (Count.second > 0) {
        // 倒计时不结束按钮不可点
        Count.canGetMobileCapcha = false
        $mobilecode.innerHTML = null
        $mobilecode.innerHTML = Count.second + 's'
        // $mobilecode.className = ''
        // 时间减一
        Count.second -= 1
        // 一秒后重复执行
        setTimeout(function () {
          Count.countDown($mobilecode)
        }, 1000)
        // 否则，按钮重置为初始状态,可点击
    } else {
        Count.canGetMobileCapcha = true
        // $mobilecode.className += ' send'
        $mobilecode.innerHTML = '重新获取'
        Count.second = 60
    }
}
