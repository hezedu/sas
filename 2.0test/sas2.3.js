function sas(tasks, opt, end) {
  var ite;
  if (typeof opt !== 'object') {
    switch (arguments.length) {
      case 2:
        opt = {
          end: opt
        }
        break;
      case 3:
        opt = {
          ite: opt,
          end: end
        }
        break;
      default:
        opt = {};
    }
  } else {
    opt.end = opt.end || end;
  }
  opt.stop = false;
  opt.error = null;
  opt.tasksCount = 0;
  opt.tasksCountCb = 0;
  tasks = opt.copy ? sas.copy(tasks) : tasks;

}
sas.copy = function(t) {
  var c = [];
  sas._copy([t], 0, c);
  c = c[0];
  return c;
}
sas._copy = function(t, i, c) {
  ty = sas.type.call(t[i]);
  switch (ty) {
    case sas.typeArr[1]: //obj
      c[i] = {};
      for (var j in t[i]) {
        sas._copy(t[i], j, c[i]);
      }
      break;
    case sas.typeArr[2]: //arr
      c[i] = [], len = t[i].length;
      for (var j = 0; j < len; j++) {
        sas._copy(t[i], j, c[i]);
      }
      break;
    default:
      c[i] = t[i];
  }
}