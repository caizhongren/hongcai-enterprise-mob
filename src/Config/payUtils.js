/**
 * 跳转到托管方
 */
let PayUtils = {}
PayUtils.newForm = () => {
    var f = document.createElement('form');
    document.body.appendChild(f);
    f.method = 'post';
    // f.target = '_blank';
    return f;
  },

  PayUtils.createElements = (eForm, eName, eValue) => {
    var e = document.createElement('input');
    eForm.appendChild(e);
    e.type = 'text';
    e.name = eName;
    if (!document.all) {
      e.style.display = 'none';
    } else {
      e.style.display = 'block';
      e.style.width = '0px';
      e.style.height = '0px';
    }
    e.value = eValue;
    return e;
  },
  PayUtils.redToTrusteeship = (business, encrpyMsg) => {
    if (encrpyMsg && encrpyMsg.ret !== -1) {
        // if(config.pay_company === 'yeepay'){
        // var req = encrpyMsg.req;
        // var sign = encrpyMsg.sign;
        // var _f = PayUtils.newForm();
        // PayUtils.createElements(_f, 'req', req);
        // PayUtils.createElements(_f, 'sign', sign);
        // _f.action = config.YEEPAY_ADDRESS + business;
        // _f.submit();
        // } else if (config.pay_company === 'cgt'){
        var serviceName = encrpyMsg.serviceName;
        var platformNo = encrpyMsg.platformNo;
        var userDevice = encrpyMsg.userDevice;
        var reqData = encrpyMsg.reqData;
        var keySerial = encrpyMsg.keySerial;
        var sign = encrpyMsg.sign;
        var _f = PayUtils.newForm();
        PayUtils.createElements(_f, 'serviceName', serviceName);
        PayUtils.createElements(_f, 'platformNo', platformNo);
        PayUtils.createElements(_f, 'userDevice', userDevice);
        PayUtils.createElements(_f, 'reqData', reqData);
        PayUtils.createElements(_f, 'keySerial', keySerial);
        PayUtils.createElements(_f, 'sign', sign);
        _f.action = process.env.CGT_ADDRESS;
        _f.submit();
        // }
    } else {
        alert(encrpyMsg.msg);
    }
}
export {PayUtils}