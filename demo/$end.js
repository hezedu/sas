var sas = require('../sas-debug');

var random = Math.random() * 1000;

var task = function(cb) {
  setTimeout(function() {
    cb();
  }, random)
}

var $endtask = function(cb) {
  setTimeout(function() {
    cb('$END');
  }, random)
}

sas([task,
  task,
  task,
  $endtask,
  task
]);

sas({
  k1: task,
  k2: task,
  k3: task,
  k4: $endtask,
  k5: task
});