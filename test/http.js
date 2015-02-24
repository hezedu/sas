var sas = require('../sas');
var http = require('http');

function httpCreate(cb) {
	http.createServer(cb).listen(1337, '127.0.0.1');
	console.log('Server running at http://127.0.0.1:1337/');
}
function OK(cb) {
	var res= this[0][1];//注意：this指向的不是全局。
	res.end('OK');
}
var line = [
	httpCreate,
	OK
];
sas(line);