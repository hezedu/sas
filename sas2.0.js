/*
作者:hezedu
https://github.com/hezedu/sas
*/
function sas(tasks, opt, end) {

  //参数样式: 根据参数个数 判定函数的 api样式
  var ite;
  if (typeof opt !== 'object') {
    switch (arguments.length) {
      case 2:
        end = opt;
        break;
      case 3:
        ite = opt;
        break;
      default:
        opt = {};
    }
  } else {
    ite = opt.ite;
    end = end || opt.end;
  }
  //参数样式完

  return new sas.min(tasks, ite, end, opt);
}

sas.typeArr = ['[object,Function]', '[object,Object]', '[object,Array]'];
sas.typeFn = Object.prototype.toString;

sas.min = function(tasks, ite, end, opt) {
  this.tasks_count = 0;
  this.tasks_count_end = 0;
  this.stop = false;
  var i = {},
  result;



}

sas.min.prototype.dis = function(task) {
  var ty = sas.typeFn(task);
  switch (ty) {
    case sas.typeArr[0]: //function
      break;
    case sas.typeArr[1]: //Object
      break;
    case sas.typeArr[1]: //Array
      break;
    default:
  }
}

sas.min.prototype.forObj = function() {

}

sas.min.prototype.forArr = function() {

}

sas.min.prototype.taskCb = function() {

}

sas.min.prototype.index = function() {

}