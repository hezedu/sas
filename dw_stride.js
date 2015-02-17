/*!
 * v:0.0.1,
 * author:hezedu,
 * home:http://godmod.cn,
 * Released: jQuery.Released
 *  --2015-01-24 23:44, 北京
 */
//********** 数组是串行，对象是并行。 ***********
//parm  a ==－般为数组。
(function(namespace) {
  namespace[0][namespace[1]] = function stride(a) {
    var count_cb = 0,
      count_fn = 0,
      next_tick = [],
      C_stopall = false;
    _dis(a);

    function _dis(curr, index, preant) { //递归
      if (C_stopall) {
        return;
      }
      var ty = Object.prototype.toString.call(curr).slice(8, -1);
      switch (ty) {
        case 'Array':
          if (preant) {
            if (typeof index === 'number') {
              next_tick.push([index, preant]);
            }
          }
          _forArr(0, curr);
          break;
        case 'Object':
          if (preant) {
            if (typeof index === 'number') {
              next_tick.push([index, preant]);
            }
          }
          _forObj(curr);
          break;
        case 'Function':
          count_fn++;
          preant[index](_cb);
          break;
        default:
          throw new Error('dw_stride err:first params must be an array or object');
          break;
      }

      function _cb(err, result) {
        if (C_stopall) {
          return;
        }
        if (err === 'STRIDE_STOP') {
          return C_stopall = true;
        }
        var arr_tmp=[];
        for(var i=0,len=arguments.length;i<len;i=i+1){
          arr_tmp.push(arguments[i]);
        }
        preant[index] = arr_tmp;
        count_cb++;
        if (typeof index === 'number') {
          _forArr(index + 1, preant);
        } else if (count_cb === count_fn) {
          _forArr(index, preant);
        };
      }

      function _forArr(j, curr) {
        if (typeof j === 'string' || j >= curr.length) {
          var pop = next_tick.pop();
          return pop && _forArr(pop[0] + 1, pop[1]);
        }
        _dis(curr[j], j, curr);
      }

      function _forObj(curr) {
        for (var j in curr) {
          _dis(curr[j], j, curr);
        }
      }
    }
  }
})((function() {
  if (typeof(module) !== 'undefined' && module.exports) {
    return [module, 'exports'];
  }
  if (typeof window !== 'undefined') {
    return [window, 'dw_stride'];
  }
})());