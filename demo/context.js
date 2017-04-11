var sas = require('../index');

function topTask(callback){
    this.topData = 10;
    setTimeout(callback);
}

function deepestTask(callback){
    console.log('I\'m here. I can get the top\'s data:', this.topData);
    this.count += this.topData;
    setTimeout(callback);
}

function bottomTask(callback){
    console.log('this\'s', this);
    setTimeout(callback);
}

sas([topTask, 
{p: [deepestTask]}, 
     bottomTask],
{ context: {count: 0}}, function(err, result){
  console.log('result\'s', result);
});