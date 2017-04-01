//Sas development edition
//Author: dw
//Version: 3.0
//Repository: https://github.com/hezedu/sas
//Note's <DWDEBUG ... DWDEBUG> will be remove on the official edition

var realType = Object.prototype.toString;
//params style:
// sas(tasks);
// sas(tasks, end);
// sas(tasks,iterator, end);
// sas(tasks, opts);
// sas(tasks, opts, end);

function sas(tasks, opts, end) {
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
  }
  new Main(tasks, ite, end, opts);
}

//<DWDEBUG1######################## color
function _colorLog(c, str, b) {
  b = b || 39;
  if (typeof window !== 'undefined') {
    console.log(str);
  } else {
    console.log('\u001b[' + c + 'm' + str + '\u001b[' + b + 'm');
  }
}
//##############################DWDEBUG>

function Main(tasks, ite, end, opts) {
  //<DWDEBUG2###################### start
  _colorLog(1, '\nStart', 22);
  this._debugStart = Date.now();
  this._debugTime = 0;
  //##############################DWDEBUG>
  this.tasksCount = 0;
  this.tasksCbCount = 0;
  this._stop = false;
  this.error = null;
  this.end = end;
  this.ite = ite;
  this.process = opts.process;
  this.processInterval = opts.processInterval || 1000;

  this.init(tasks);
}


Main.prototype.init = function(tasks) {
  var _count = [1, 0];
  this.tasks = [tasks];
  this.dis(_count[1],this.tasks, _count);
  this._process();
}

//Recursion
Main.prototype.dis = function(i, t, count, parents) {
  if (this._stop) {
    return;
  }
  // var ty = typeof t[i];
  // if(ty === 'function'){
  //   this.forFn(i, t, count, parents);
  // }else if(ty === 'object'){

  // }else{

  // }
  var _count;
  switch (realType.call(t[i])) {

    //Function control
    case '[object Function]':
      this.forFn(i, t, count, parents);
      break;
      
      //Object control
    case '[object Object]':
      var keys = Object.keys(t[i]),
        keys_len = keys.length;
      _count = [keys_len, 0];
      for (var o = 0; o < keys_len; o++) {
        this.dis(keys[o], t[i], _count, arguments);
      }
      break;

      //Array control
    case '[object Array]':
      _count = [t[i].length, 0];
      this.dis(_count[1], t[i], _count, arguments);
      break;

    default:
      //Other control:
      if (this.ite && t[i] !== undefined) {
        t[i] = this.ite(t[i]);
        this.forFn(i, t, count, parents);
      } else {
        count[1]++;
        this.nextTick(i, t, count, parents);
      }
  }
}

//Handle tasks
Main.prototype.forFn = function(i, t, count, parents) {
  this.tasksCount++;
  var ext = null,
    self = this;
  if (t[i].length > 1) {
    ext = new I(i, t, count, parents);
  }
  //<DWDEBUG3################################# Before callback
  if (!ext) {
    ext = new I(i, t, count, parents);
  }
  var path = ext.path.join('/');
  var _start = Date.now();
  var a_or_sa_c = 90,
    a_or_sa_str = 'P '; //parallel
  if (typeof i === 'number') {
    a_or_sa_c = 37;
    a_or_sa_str = 'S '; //sequence
  }
  //########################################DWDEBUG>
  t[i](cb, ext);

  function cb(pream, opts) {
    self.tasksCbCount++;
    if (self._stop || count[0] === count[1]) {
      return;
    }
    //<DWDEBUG4################################# cb 后
    var time = Date.now() - _start;
    self._debugTime += time;
    _colorLog(a_or_sa_c , a_or_sa_str + ':[' + count[0] + '/' + count[1] + ']\t' + path + '\t' + time + 'ms');
    //########################################DWDEBUG>
    
    if(pream){
      switch (pream) {
        case '$reload':
          t[i] = opts || t[i];
          return self.dis(i, t, count, parents);
        case '$end':
          count[1] = count[0];
          break;

        default: //error:
          self.error = pream;
          self._end();
          return self._stop = true;
      }
    }else{
      count[1]++;
      t[i] = opts;
    }

    self.nextTick(i, t, count, parents);
  }
}


Main.prototype.nextTick = function(i, t, count, parents) {
  if (count[0] === count[1]) {
    if (parents) {
      parents[2][1]++;
      this.nextTick.apply(this, parents);
    } else { //end
      this._end();
    }
  } else {
    if (typeof i === 'number') {
      this.dis(count[1], t, count, parents);
    }
  }
}


Main.prototype._process = function() { //over

  if (this.process) {
    var self = this;
    self._t = setInterval(function() {
      self.process(self.tasksCount, self.tasksCbCount);
    }, self.processInterval);
  }
}

//Program end
Main.prototype._end = function(){

  //<DWDEBUG5####################################### end
  var time2 = Date.now() - this._debugStart;
  _colorLog(1, 'End', 22);
  _colorLog(96, 'Time cost:\t' + time2 + 'ms');
  _colorLog(96, 'Callbacks count:\t' + this.tasksCount + '/' + this.tasksCbCount);
  _colorLog(96, 'Callbacks time count:\t' + this._debugTime + 'ms');
  //########################################DWDEBUG>
  if (this.process) {
    clearInterval(this._t);
    this.process(this.tasksCount, this.tasksCbCount);
  }
  if (this.end) {
    this.end(this.error, this.tasks[0]); //International practice: first error.
  }
}

//*********************************** I ***********************************

function I(i, t, count, parents) {
  this.index = i;
  this.path = [i];
  this.count = count;

  //var j = 0
  var ps, isSP = false;
  ps = parents;
  this.parent = parents[1];
  this.pIndex = parents[0];

  while (ps[3]) {
    //j++;
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

I.prototype.fsPath = function() {
  var fspath_arr = [],
    path_arr = this.path;
  for (var path_i = 0, path_len = path_arr.length; path_i < path_len; path_i++) {
    if (typeof path_arr[path_i] === 'string') {
      fspath_arr.push(path_arr[path_i]);
    }
  }
  return fspath_arr;
}

I.prototype.push = function(a) {
  this.count[0]++;
  this.parent[this.pIndex].push(a);
}

//*********************************** module ***********************************

if (typeof module === 'object' && typeof module.exports === 'object') {
  module.exports = sas;
} 

