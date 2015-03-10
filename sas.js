/*!
 *version:0.1.19,
 *author:hezedu,
 *Released: jQuery.Released,
 *Date:2015-2-11
*/
function sas(arr, opt) {
  opt = opt || {};
  var C_stop = false;
  var task_count = 0,
    task_count_cb = 0; //任务计数。
  

  var C_count = [arr.length, 0];
  _dis(C_count[1], arr, C_count);

  function _dis(i, t, count, parents) {

    if (C_stop) {
      return;
    }
    var ty = Object.prototype.toString.call(t[i]).slice(8, -1);

    switch (ty) {
      case 'Object':
        var keys = Object.keys(t[i]),
          keys_len = keys.length,
          _count = [keys_len, 0];
        for (var o = 0; o < keys_len; o++) {
          //_count[0] ++;
          _dis(keys[o], t[i], _count, arguments);
        }
        break;
      case 'Array':
        var _count = [t[i].length, 0];
        _dis(_count[1], t[i], _count, arguments);
        break;
      case 'Function':
        task_count++;
        

        var args = arguments;

        if (t[i].length > 1) {

          //************ ext扩展**********************************
          var ext = {
              index: i,
              path: [i]
            },

            j = 0,
            ps, isSP = false;
          if (parents) {
            ps = parents;
            ext.parent = parents[1];
            ext.pIndex = parents[0];

            while (ps) {
              j++;
              if (!isSP && typeof ps[0] === 'number') {
                ext.Sparent = ps[1];
                isSP = true;
              }
              ext.path.splice(0, 0, ps[0]);
              ps = ps[3];
            }
            /*      ext.parents = function(num) {
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
          ext.push = function(a) {
            count[0] ++;
            if (ext.parent) {
              ext.parent[ext.pIndex].push(a);
            } else { //没有父级，就是到顶了。
              arr.push(a);
            }
          }
          ext.fspath = function(dir) {
            var fspath_arr = [],
              path_arr = this.path;
            for (var path_i = 0, path_len = path_arr.length; path_i < path_len; path_i++) {
              if (typeof path_arr[path_i] === 'string') {
                fspath_arr.push(path_arr[path_i]);
              }
            }
            return fspath_arr;
          }

          //************ ext扩展结束**********************************

          

          t[i](_cb, ext);
        } else {

          

          t[i](_cb);
        }

        function _next_tick(i, t, count, parents) {
          if (count[0] === count[1]) {
            if (parents) {
              parents[2][1] ++;
              _next_tick.apply(null, parents);
            } else { //完结
              

              if (opt.allEnd) {
                opt.allEnd(null, arr); //国际惯例
              }
            }
          } else {
            if (typeof i === 'number') {
              _dis(count[1], t, count, parents);
            }
          }
        }

        function _cb(result, pream) {
          task_count_cb++;
          if (C_stop) {
            return;
          }
          switch (result) {

            //==================魔法字==================
            case '$STOP': //中止整个程序
              if (opt.allEnd) {
                opt.allEnd(pream); //国际惯例，第一个参数err.
              }
              return C_stop = true;
              break;
            case '$THIS=': //替换掉 this
              if (parents) {
                parents[1][parents[0]] = pream;
              }
              count[1] = count[0];
              break;
            case '$END': //结束 this
              count[1] = count[0];
              break;
            case '$RELOAD': //重载当前任务
              t[i] = pream || t[i];
              return _dis.apply(null, args);
              break;
              //==================魔法字结束==================

            default:
              count[1] ++;
              if (arguments.length < 2) {
                t[i] = result;
              } else { //如果大于2的话，把arguments变成正常数组，保存
                var result_tmp = [];
                for (var r_i = 0, len = arguments.length; r_i < len; r_i++) {
                  result_tmp.push(arguments[r_i]);
                }
                t[i] = result_tmp;
              }
          }
          if (opt.process) {
            if (typeof setImmediate !== 'undefined') {
              setImmediate(function() {
                opt.process(task_count, task_count_cb);
              });
            } else {
              setTimeout(function() {
                opt.process(task_count, task_count_cb);
              }, 0);
            }
          }

          

          _next_tick.apply(null, args);
        }
        break;
      default:
        if (opt.iterator) {
          t[i] = opt.iterator(t[i]);
          _dis.apply(null, arguments);
        } else {
          throw new Error('SAS:类型错误:' + ty + '。 任务必须是一个function。');
          //count[1] ++;
        }
    }
  }
}
if (typeof module === 'object' && typeof module.exports === 'object') {
  module.exports = sas;
}