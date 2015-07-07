var sas = require('../sas-debug');

var test = {
  a:'a'
}
var test2 = sas.copy(test);
test.a = 'b';
console.log(test2.a);