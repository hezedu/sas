var sas = require('../sas-debug');

var random = Math.random() * 1000;

var task = function(cb) {
  setTimeout(function() {
    cb(null);
  }, random);
}

var $goTask = function(cb) {
  setTimeout(function() {
    
    cb('$GO', -3);
    sas._color(93, '$GO:');
  }, random)
}


sas([task,
  task,
  task,
  $goTask,
  task,
  task,
  task,
  task
]);