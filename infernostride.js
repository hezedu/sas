var dw_com = require('dw_com');

function Istride(plan) {

  var next_tick = 0;
  var fn_len = 0;
  var count = 0;
  var isObj = false;
  var obj_preant;
  function loop(arr, preant, ikeys) {
    var ty = dw_com.is(arr);
    switch (ty) {
      case 'Array':
        obj_preant = arr;
        _forarr(next_tick, arr);
        break;
      case 'Object':
        isObj = true;
/*        var keys = Object.keys(preant),
          len = keys.length;*/
        for (var i in arr) {

          loop(arr[i], arr, i);

        }

        break;
      case 'Function':
        if (isObj) {
          fn_len = fn_len + 1;
        }
        arr(_cb);
        break;
      default:
        throw new Error('格式不对');
    }


    //callback
    function _cb(err, result) {
      if (isObj) {
        count = count + 1;
      }
      if (preant) {

        var ty = dw_com.is(preant);

        if (ty === 'Array') {

          preant[next_tick] = result;
          next_tick = next_tick + 1;
          _forarr(next_tick, preant);


        } else if (ty === 'Object') {

          preant[ikeys] = result;

          if (count === fn_len) {
            fn_len = count = 0;
            isObj = false;
            //console.log('next_tick===' + next_tick + ' obj_preant==' + JSON.stringify(obj_preant));

            next_tick = next_tick + 1;

            _forarr(next_tick, obj_preant);

          }
        } else {
          next_tick = next_tick + 1;
        }

      }

      //var key= ikeys || next_tick;
      console.log(' result===' + JSON.stringify(plan));
      //console.log(next_tick+' ' +ikeys +' ok');

    }


  };

  loop(plan);

  function _forarr(i, arr) {
    if (i < arr.length) {
      loop(arr[i], arr);
    }
  }
}



_dispath(opt){
  var ty=dw_com.is(opt);
  var C_i = 0;

  switch(ty){
  case 'Array':
    _for_arr(i,opt);
  break;
  
  case 'Object':
  _for_obj(C_i,opt,arr);
  break;
  default:
  break;
}


}


_for_arr(i,arr){
  var len = arr.length,ty=dw_com.is(arr[i]);
  if(i<len){
    switch(ty){
      case 'Array':
      break;
      case 'Object':
      _for_obj(i,arr[i],arr);
      break;
      default:
      break;
    }

  }
}
_for_obj(i,obj,preant){


}

module.exports = Istride;