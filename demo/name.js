var fs = require('fs');
var sas = require('../index');

var $readMe = cb => fs.readFile('someFile', 'utf-8', cb);

sas([$readMe,
  function(callback){
    console.log(this);
    callback();
}], function(err){
  if(err) console.error(err.message);
});