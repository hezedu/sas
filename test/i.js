var sas = require('../index');
var task = function(cb,i){
  var indexs = i.indexs();
  console.log(indexs);
  console.log(0, i.index);
  for(let j = 1, len = indexs.length; j < len; j++){
    console.log(j, i.upperIndex(j));
  }
  cb();
}

sas([{h:[{e:[{l:[{l:[{o:[task]}]}]}]}]}]);