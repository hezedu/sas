var fs = require('fs');
var sas = require('../sas-debug');

var random = function() {
 return  Math.random() * 1000;
}

var task = function(str){
  return function(cb){
    setTimeout(function(){
      cb(str);
    },random());
  }
}

function first(cb){
    setTimeout(function(){
      cb('$THIS=', 9);
    },random());
}


var th_is = function(cb){
  console.log('this[0]=='+this[0]);
  cb('$THIS=',this[0]);
}

sas({a: [first, task('1'),task('2'),task('3'),task('4'),th_is], b:task('5') },function(err,result){
  console.log(result)
})