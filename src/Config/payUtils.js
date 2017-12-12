/**
 * 跳转到托管方
 */
let redToTrusteeship = (business, encrpyMsg) => {
    if (encrpyMsg && encrpyMsg.ret !== -1) {
        // if(config.pay_company === 'yeepay'){
        // var req = encrpyMsg.req;
        // var sign = encrpyMsg.sign;
        // var _f = this.newForm();
        // this.createElements(_f, 'req', req);
        // this.createElements(_f, 'sign', sign);
        // _f.action = config.YEEPAY_ADDRESS + business;
        // _f.submit();
        // } else if (config.pay_company === 'cgt'){
        var serviceName = encrpyMsg.serviceName;
        var platformNo = encrpyMsg.platformNo;
        var userDevice = encrpyMsg.userDevice;
        var reqData = encrpyMsg.reqData;
        var keySerial = encrpyMsg.keySerial;
        var sign = encrpyMsg.sign;
        var _f = this.newForm();
        this.createElements(_f, 'serviceName', serviceName);
        this.createElements(_f, 'platformNo', platformNo);
        this.createElements(_f, 'userDevice', userDevice);
        this.createElements(_f, 'reqData', reqData);
        this.createElements(_f, 'keySerial', keySerial);
        this.createElements(_f, 'sign', sign);
        _f.action = config.CGT_ADDRESS;
        _f.submit();
        // }
    } else {
        alert(encrpyMsg.msg);
    }
}
export {redToTrusteeship}