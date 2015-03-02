function test(cb){
  setTimeout(function(){
    //cb('tset');
    console.log('11111111111');

  },200);
}

test(function(str){
  console.log(str);
});