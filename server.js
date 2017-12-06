var express = require('express');
var app = express();
var dataJson = require('./dataJson.json');
var proxy = require('http-proxy-middleware');

app.use(express.static('build'))
/**
* get： 请求
* url： http://127.0.0.1:8088/getData
*/

app.use('/hongcai', proxy({target: 'http://m.test321.hongcai.com', changeOrigin: true}))
app.get('/getData',function(req,res){
	  var resData = {
			err:0,
			data:dataJson
		}
		res.end(JSON.stringify(resData));
})
app.get('/', function (req, res) {
	res.sendFile(__dirname + '/build/index.html')
})
var server = app.listen(8088, function () {
	console.log('正常打开8088端口');
})
