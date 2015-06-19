function sas(tasks, opt, end) {
  var ite;
  //参数样式: 根据参数个数 判定函数的 api样式
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

  var tasks_count = 0,
    tasks_count_cb = 0,
    C_stop = fasle,
    index = {},
    typeArr = ['[object,Function]', '[object,Object]', '[object,Array]'],
    typeFn = Object.prototype.toString;


  function _dis(tasks, index) {
    var ty = typeFn.call(tasks);
    switch (ty) {
      case typeArr[0]:
        tasks_count += 1;

        break;
      case typeArr[1]:
        break;
      case typeArr[2]:
        break;
      default:
        if (ite) {
          ite(tasks)(_cb, index)
        }
    }

  }

  function fn_ctrl() {

  }

  function obj_ctrl() {

  }

  function arr_ctrl() {

  }

  function _cb() {

  }
}