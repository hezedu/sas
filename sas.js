/* 
 * author: hezedu,
 * Released: jQuery.Released,
 * Date: 2015 - 02 - 25,
 * site: 北京,
 * home: http: //godmod.cn
 * v 0.0.5
 */
(function(a) {
  if (typeof(module) !== 'undefined' && module.exports) {
    module.exports = a;
  } else if (typeof window !== 'undefined') {
    window.sas = a;
  }
})((function() {

  function _pathWeight(arr) {//log path 的 style
    var arr_tmp = [];
    for (var i = 0, len = arr.length; i < len; i++) {
      if (typeof arr[i] === 'number') {
        arr_tmp.push('[' + arr[i] + ']');
      } else {
        arr_tmp.push('.' + arr[i]);
      }
    }
    return arr_tmp;
  }

  function _color(c, str, b) { //console.log着色函数
    b = b || 39;
    if (typeof window !== 'undefined') {
      return str;
    } else {
      return '\u001b[' + c + 'm' + str + '\u001b[' + b + 'm';
    }
  }

  function _sOras(a) { //判定S还是AS，以改变log样式。
    if (typeof a === 'number') {
      return {
        color: 37,
        str: 'S '
      };
    }
    return {
      color: 90,
      str: 'AS'
    };
  }

  function _debugLog(sOras, count, path, time) {//log的 style
    if (typeof time ==='number') {
      time = '\t' + time + 'ms';
    } else {
      time = '';
    }
    console.log(_color(sOras.color, sOras.str + ':[' + count[0] + '/' + count[1] + ']\t' + path + time));
  }

  function sas(arr, opt) {
    opt = opt || {};
    var debug = opt.debug || sas.debug,
      C_stop = false; //是否中止
    //***********DEBUG 1 程序开始 ***********共七处
    if (debug) {
      console.log(_color(1, '\n开始', 22));
      var C_START = Date.now(),
        C_time = 0;
    }
    //***********DEBUG 1 end ***********
    var C_count = [arr.length, 0];
    _dis(C_count[1], arr, C_count);

    function _dis(i, t, count, parents) { //递归
      if (C_stop) {
        return;
      }
      var ty = Object.prototype.toString.call(t[i]).slice(8, -1); // type

      var nav = { //导航
          index: i,
          path: [i]
        },
        j = 0,
        ps, isSP = false;
      if (parents) {
        ps = parents;
        //nav.parent = parents[1];
        while (ps) {
          j++;
          if (!isSP && typeof ps[0] === 'number') {
            nav.Sparent = ps[1];
            isSP = true;
          }
          nav.path.splice(0, 0, ps[0]);
          ps = ps[3];
        }
        /*      nav.parents = function(num) {
                if (num >= j) {
                  return;
                }
                ps = parents;
                for (var x = 0; x < num;) {
                  ps = ps[3];
                }
                return ps;
              }*/
      }

      //***********DEBUG 2  先天 log ***********
      if (debug) {
        var _start = Date.now();
        var patharr = _pathWeight(nav.path);
        var path = patharr.join('');
        var sOras = _sOras(i);
        _debugLog(sOras,count,path);
        if (ty !== 'Function') {
          arguments['time'] = Date.now();
        }
      }
      //***********DEBUG 2 end ***********
      switch (ty) {
        case 'Object':
          var _count = [0, 0];
          for (var o in t[i]) {
            _count[0] ++;
            _dis(o, t[i], _count, arguments);
          }
          break;
        case 'Array':
          var _count = [t[i].length, 0];
          _dis(_count[1], t[i], _count, arguments);
          break;
        case 'Function':
          var args = arguments;
          t[i](_cb, nav);

          function _next_tick(i, t, count, parents) {
            if (count[0] === count[1]) {
              if (parents) {
                parents[2][1] ++;
                //**************DEBUG 6 当前层任务结束，返回父级 *******************
                if (debug) {
                  sOras = _sOras(parents[0]);
                  var time = Date.now() - parents['time'];
                  patharr.pop();
                  path = patharr.join('');
                  _debugLog(sOras,parents[2],path);
                }
                //***************DEBUG 6 end ******************
                _next_tick.apply(null, parents);
              } else if (debug) {
                //***********DEBUG 7  程序结束 ***********
                console.log(_color(1, '结束', 22));
                console.log(_color(96, '统计：' + C_time + 'ms'));
                var time2 = Date.now() - C_START;
                console.log(_color(96, '实计用时：' + time2 + 'ms'));
                time2 = C_time - time2;
                console.log(_color(36, '节省：' + (time2 >= 0 ? time2 : '--') + 'ms'));
              }
              //***********DEBUG 7 end ***********
            } else {
              if (typeof i === 'number') {
                _dis(count[1], t, count, parents);
              }
            }
          }

          function _cb(result) {
            if (C_stop) {
              debug && _color(91, path + '\t' + sOras.str + ':' + result); //DEBUG 3 停止 log红色
              return;
            }
            if (result === '$STOP') {
              debug && _color(91, path + '\t' + sOras.str + ':' + result); //DEBUG 4 跟 3 一样
              return C_stop = true;
            }
            if (arguments.length < 2) {
              t[i] = result;
            } else {
              var result_tmp = [];
              for (var r_i = 0, len = arguments.length; r_i < len; r_i++) {
                result_tmp.push(arguments[r_i]);
              }
              t[i] = result_tmp;
            }
            count[1] ++;
            //***********DEBUG 5 callback完成  log:异步灰色,同步白色 ***********
            if (debug) {
              var time = Date.now() - _start;
              C_time += time;
              _debugLog(sOras,count,path,time);
            }
            //***********DEBUG 5 end***********
            _next_tick.apply(null, args);
          }
          break;
        default:
          if (opt.iterator) { //迭代器
            t[i] = opt.iterator(t[i]);
            _dis.apply(null, arguments);
          } else {
            throw new Error('The first parameter not contains the type for the ' + ty + ' element.');
          }
      }
    }
  }
  return sas;
})());