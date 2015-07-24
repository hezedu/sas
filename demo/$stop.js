var sas = require('../sas-debug');

var random = Math.random() * 1000;

var task = function(cb) {
  setTimeout(function() {
    cb();
  }, random);
}

var $stopTask = function(cb) {
  setTimeout(function() {
    cb('$STOP');
  }, random)
}

sas._color(93,'同步$STOP:');
sas([task,
  task,
  $stopTask,
  task,
  task
], function() {
  sas._color(93,'异步$STOP:');
  sas({
    k1: task,
    k2: task,
    k4: $stopTask,
    k3: task,
    k5: task
  });
});