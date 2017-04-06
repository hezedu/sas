/*!
  *Version: 3.0.0
  *Released: MIT
  *Repository: https://github.com/hezedu/sas
*/
var realType = Object.prototype.toString;

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
//The code between the two dwdebug tags in the comments 
//will be deleted in the official version
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
  this.tasks = tasks;
  this.tasksCount = 0;
  this.tasksCbCount = 0;
  this.error = null;
  this.end = end;
  this.ite = ite;
  this.process = opts.process;
  this.processInterval = opts.processInterval || 1000;
  this.init(tasks);
}


Main.prototype.init = function(tasks) {
  var _count = [1, 0];
  this.dis(_count[1],[this.tasks], _count);
  this._process();
}

//Recursion
Main.prototype.dis = function(i, t, count, parents) {
  if (this.error) {
    return;
  }
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
    ext = new I(i, t, this.tasks, parents);
  }
  //<DWDEBUG3################################# Before callback
  if (!ext) {
    ext = new I(i, t, this.tasks, parents);
  }
  var path = ext.indexs().join('/');
  var _start = Date.now();
  var _s_or_p_stype = 90,
    _s_or_p_info = 'P '; //parallel
  if (typeof i === 'number') {
    _s_or_p_stype = 37;
    _s_or_p_info = 'S '; //sequence
  }
  //########################################DWDEBUG>
  t[i](cb, ext);

  function cb(pream, opts) {
    self.tasksCbCount++;
    if (self.error || count[0] === count[1]) {
      return;
    }
    //<DWDEBUG4################################# cb 后
    var time = Date.now() - _start;
    self._debugTime += time;
    _colorLog(_s_or_p_stype , _s_or_p_info + ':[' + count[1] + '/' + count[0] + ']\t' + path + '\t' + time + 'ms');
    //########################################DWDEBUG>
    
    if(pream){
      switch (pream) {
        case '$reload':
          t[i] = opts || t[i];
          return self.dis(i, t, count, parents);
        case '$up':
          count[1] = count[0];
          t[i] = opts;
          break;
        case '$rise':
          parents[1][parents[0]] = opts;
          count[1] = count[0];
          break;
        default: //error:
          self.error = pream;
          self._end();
          return;
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
  _colorLog(96, 'Callbacks count:\t' + this.tasksCount + '/' + this.tasksCbCount);
  _colorLog(96, 'Callbacks time count:\t' + this._debugTime + 'ms');
  _colorLog(96, 'Real time cost:\t' + time2 + 'ms');
  //########################################DWDEBUG>
  if (this.process) {
    clearInterval(this._t);
    this.process(this.tasksCount, this.tasksCbCount);
  }
  if (this.end) {
    this.end(this.error, this.tasks); //International practice: first error.
  }
}

//*********************************** I ***********************************

function I(i, t, root, parents) {
  this.index = i;
  //this.context = t;
  this.ROOT = root;
  this._parents = arguments;
  this._indexs = null;
}

I.prototype.indexs = function(key){
  if(!this._indexs){
    var ps = this._parents, indexs = [];
    //if(ps){
      while (ps[3]) {
        indexs.splice(0, 0, ps[0]);
        ps = ps[3];
      }
    //}
    this._indexs = indexs;
  }
  return this._indexs;
}

I.prototype.upper = function(i) {
  i = i || 1;
  var ps = this._parents;
  while(i > 0 && ps[1] !== this.ROOT){
    ps = ps[3];
    i--;
  }
  if(i === 0) {
    return {
      context: ps[1],
      index: ps[0]
    }
  }
}

I.prototype.fsIndexs = function() {
  var arr = [],
    indexArr = this.indexs();
  for (var i = 0, len = indexArr.length; i < len; i++) {
    if (typeof indexArr[i] === 'string') {
      arr.push(indexArr[i]);
    }
  }
  return arr;
}

module.exports = sas;