var sas = require('../sas-debug');

var random = Math.random() * 1000;

var task = function(cb) {
  setTimeout(function() {
    cb();
  }, random);
}

var $endtask = function(cb) {
  setTimeout(function() {
    cb('$END');
  }, random)
}
sas._color(93, '同步$END:');
sas([task,
  task,
  $endtask,
  task,
  task
], function() {
  sas._color(93, 'OK');
  sas._color(93, '异步$END:');
  sas({
    k1: task,
    k2: task,
    k4: $endtask,
    k3: task,
    k5: task
  }, function() {
    sas._color(93, 'OK')
  });
});