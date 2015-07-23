//*********************************** 主 ***********************************

function sas(tasks, opts, end) {
  //参数样式: 根据参数个数 判定函数的 api样式
  var ite;
  if (typeof opts !== 'object') {
    switch (arguments.length) {
      case 2:
        end = opts;
        break;
      case 3:
        ite = opts;
        break;
      default:
        opts = {};
    }
  } else {
    ite = opts.iterator;
    end = end || opts.allEnd;
  }
  //参数样式完
  new sas.min(tasks, ite, end, opts);
}

//*********************************** 主静态方法 ***********************************

sas.type = Object.prototype.toString;

sas.ARR = '[object Array]';
sas.FN = '[object Function]';
sas.OBJ = '[object Object]';

//复制tasks, 深递归
sas.copy = function(t) {
  var c = [];
  sas._copy([t], 0, c);
  return c[0];
}

sas._copy = function(t, i, c) {
    switch (sas.type.call(t[i])) {
      case sas.OBJ: //obj
        c[i] = {};
        for (var j in t[i]) {
          sas._copy(t[i], j, c[i]);
        }
        break;
      case sas.ARR: //arr
        c[i] = [], len = t[i].length;
        for (var j = 0; j < len; j++) {
          sas._copy(t[i], j, c[i]);
        }
        break;
      default:
        c[i] = t[i];
    }
  }
  //<DWDEBUG1######################## color
sas._color = function(c, str, b) {
    b = b || 39;
    if (typeof window !== 'undefined') {
      console.log(str);
    } else {
      console.log('\u001b[' + c + 'm' + str + '\u001b[' + b + 'm');
    }
  }
  //##############################DWDEBUG>
  //*********************************** min ***********************************

//min
sas.min = function(tasks, ite, end, opts) {
  //<DWDEBUG2###################### start
  sas._color(1, '\n开始', 22);
  this.debug_start = Date.now();
  this.debug_time = 0;
  //##############################DWDEBUG>
  this.tasks_count = 0;
  this.tasks_count_cb = 0;
  this.STOP = false;
  this.error = null;
  this.end = end;
  this.ite = ite;
  this.process = opts.process;
  this.process_interval = opts.process_interval || 1000;
  this.plan = opts.copy ? sas.copy(tasks) : tasks;
  this.init();
}

//min 初始化
sas.min.prototype.init = function() {
  var _count = [1, 0];
  this.dis(_count[1], [this.plan], _count);
}

//递归
sas.min.prototype.dis = function(i, t, count, parents) {
  if (this.STOP) {
    return;
  }
  switch (sas.type.call(t[i])) {

    //Function Ctrl
    case sas.FN:

      this.forFn(i, t, count, parents);
      break;

      //Object Ctrl
    case sas.OBJ:
      var keys = Object.keys(t[i]),
        keys_len = keys.length,
        _count = [keys_len, 0];
      for (var o = 0; o < keys_len; o++) {
        //_count[0] ++;
        this.dis(keys[o], t[i], _count, arguments);
      }
      break;

      //Array Ctrl
    case sas.ARR:
      var _count = [t[i].length, 0];
      this.dis(_count[1], t[i], _count, arguments);
      break;

    default:
      //other Ctrl:
      if (this.ite) {
        t[i] = this.ite(t[i]);
        this.forFn(i, t, count, parents);
      } else {
        count[1]++;
        this.next_tick(i, t, count, parents);
      }
  }
}

//处理 tasks
sas.min.prototype.forFn = function(i, t, count, parents) {
  this.tasks_count++;
  var ext = null,
    self = this;
  if (t[i].length > 1) {
    ext = new sas.Index(i, t, count, parents);
  }
  //<DWDEBUG3################################# cb前
  if (!ext) {
    ext = new sas.Index(i, t, count, parents);
  }
  var path = ext.path.join('/');
  var _start = Date.now();
  var a_or_sa_c = 90,
    a_or_sa_str = 'AS';
  if (typeof i === 'number') {
    a_or_sa_c = 37;
    a_or_sa_str = 'S ';
  }
  //########################################DWDEBUG>
  t[i](cb, ext);

  function cb(result, pream) {
    self.tasks_count_cb++;
    if (self.STOP) {
      return;
    }
    //<DWDEBUG4################################# cb 后
    var time = Date.now() - _start;
    self.debug_time += time;
    sas._color(a_or_sa_c, a_or_sa_str + ':[' + count[0] + '/' + count[1] + ']\t' + path + '\t' + time + 'ms');
    //########################################DWDEBUG>
    //if (typeof result === 'string') {
    switch (result) {
      //==================魔法字==================
      case '$STOP': //中止整个程序
        self.error = pream;
        self._end();
        return self.STOP = true;
        break;
      case '$THIS=': //替换掉 this
        parents[1][parents[0]] = pream;
        count[1] = count[0];
        break;
      case '$END': //结束 this
        count[1] = count[0];
        break;
      case '$HOLD': // 新加功能：2015-3-23 保持原来的。
        count[1]++;
        break;
      case '$RELOAD': //重载当前任务
        t[i] = pream || t[i];
        self.dis(i, t, count, parents);
        break;
        //==================魔法字结束==================
      default:
        count[1]++;
        if (arguments.length < 2) {
          t[i] = result;
        } else { //如果大于2的话，把arguments变成正常数组，保存
          var result_tmp = [];
          for (var r_i = 0, len = arguments.length; r_i < len; r_i++) {
            result_tmp.push(arguments[r_i]);
          }
          t[i] = result_tmp;
        }
        self.next_tick(i, t, count, parents);
    }
    //}
  }
}

//下一步
sas.min.prototype.next_tick = function(i, t, count, parents) {

  if (count[0] === count[1]) {
    if (parents) {
      parents[2][1]++;
      this.next_tick.apply(this, parents);
    } else { //完结
      //<DWDEBUG5####################################### end
      var time2 = Date.now() - this.debug_start;
      sas._color(1, '结束', 22);
      sas._color(96, '回调个数：' + this.tasks_count + '/' + this.tasks_count_cb);
      sas._color(96, '回调统计：' + this.debug_time + 'ms'); //所有回调的时间,有可能因为过快或其它原因统计失误
      sas._color(96, '实计用时：' + time2 + 'ms');
      time2 = this.debug_time - time2;
      sas._color(36, '节省：' + (time2 >= 0 ? time2 : '--') + 'ms');
      //########################################DWDEBUG>
      this._end();
    }
  } else {
    if (typeof i === 'number') {
      this.dis(count[1], t, count, parents);
    }
  }
}

//进度条
sas.min.prototype._process = function() { //over
  if (this.process) {
    this._t = setInterval(function() {
      this.process(this.tasks_count, this.tasks_count_cb);
    }, this.process_interval);
  }
}

//程序结束
sas.min.prototype._end = function() { //over
  if (this.process) {
    clearInterval(this._t);
    this.process(this.tasks_count, this.tasks_count_cb);
  }
  if (this.end) {
    this.end(this.error, this.plan); //国际惯例
  }
}

//*********************************** Index ***********************************

sas.Index = function(i, t, count, parents) {
  this.index = i;
  this.path = [i];
  this.count = count;

  var j = 0,
    ps, isSP = false;
  ps = parents;
  this.parent = parents[1];
  this.pIndex = parents[0];

  while (ps[3]) {
    j++;
    if (!isSP && typeof ps[0] === 'number') {
      this.Sparent = ps[1];
      this.SpIndex = ps[0];
      isSP = true;
    }
    this.path.splice(0, 0, ps[0]);
    ps = ps[3];
  }
  /*      this.parents = function(num) {
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

sas.Index.prototype.fspath = function() {
  var fspath_arr = [],
    path_arr = this.path;
  for (var path_i = 0, path_len = path_arr.length; path_i < path_len; path_i++) {
    if (typeof path_arr[path_i] === 'string') {
      fspath_arr.push(path_arr[path_i]);
    }
  }
  return fspath_arr;
}

sas.Index.prototype.push = function(a) {
  this.count[0]++;
  this.parent[this.pIndex].push(a);
}

//*********************************** module ***********************************

if (typeof module === 'object' && typeof module.exports === 'object') {
  module.exports = sas;
}