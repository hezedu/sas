function is(v) {
    return Object.prototype.toString.call(v).slice(8, -1);
}

function v4(a){


  function _dp(a,cbre){

    var ty = is(a);
    var i = 0;

    switch(ty){
      case 'Array':

      _for_arr(i,a);
      break;

      case 'Object':
      break;

      case 'function':
      break;

      default:
      break;
    }

    function _nexttick(re){

      cbre=re;

      _for_arr(i+1,a);

    }

    function _for_arr(i, a) {
      if (i < Max) {

        _dp(a[i],a[i]);

      } 
    }






  }

}