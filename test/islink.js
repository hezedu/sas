var fs = require('fs');
var zupu = require('./zupu.js');
//fs.stat('/proc/31847/root', function(err, stat) {
var http = require('http');
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});
  zupu.init(res);

var path = req.url.split('path=')[1];
fs.lstat('D:/git/sas/test/sasVsAsync', function(err, stat) {
  if(err){
    res.end(err)
  }
  res.write("path = "+path+'<br/>');
  res.write("stat.isSymbolicLink() = "+stat.isSymbolicLink());
  res.write(zupu(stat));
  res.end('OOO');

});



}).listen(1337);
console.log('Server running at http://127.0.0.1:1337/');



