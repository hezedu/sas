# sas2.0.2
S代表sync,AS代表async。Sas 是一个javascript处理(同/异)步控制引挚.

使用sas寻找磁盘最深处:

![image](https://github.com/hezedu/SomethingBoring/blob/master/sas/140deep.png?raw=true)

#安装
[Node.js](http://nodejs.org)： `npm install sas`

浏览器直接src,不支持IE8.

#API
###sas(tasks,end)
###sas(tasks,iterator,end)
###sas(tasks,opts)

##tasks

包含三种元素:

___Array___代表同步.
```javascript
[//同步挨个执行
   task1,
   task2,
   task3
] 
```

___Object___代表异步.
```javascript
{ //异步同时执行
  'key1': task1,
  'key2': task2,
  'key3': task3
}
```

___Function___代表任务.
```javascript
function(cb,t){
  cb();
}
```
`cb`回调,任务完成后必须返回.

`t`可选参数,智能对象,用不着的话就不要选,你不用选了会有浪费一点性能.这个后面再详解.

---------------------------------------

###嵌套示例:
```javascript
//同步内异步
[{
  'key1': task1,
  'key2': task2
}, {
  'key1': task3,
  'key2': task4
}]

//异步内同步
{
  'key1': [task1, task2],
  'key2': [task1, task2]
}
```
多重嵌套:[mktree](https://github.com/hezedu/sas/blob/master/demo/mktree.js)

---------------------------------------
##`opt`可选
opt.iterator 用来替换每一个`tasks`中不是function的基础单位.

结构为:
```javascript
opt.iterator=function(param){
  return function(cb,t){//return一个task.
    cb();
  }
}
```
###示例:
```javascript
var sas = require('../sas-debug');
var rdom = function() { //随机time
  return Math.random() * 1000;
}

var hello = function(param){//iterator
  return function(cb){
    setTimeout(function(){
    	cb('hello'+param);
    },rdom());
  }
}

var end = function(cb) {
  setTimeout(function() {
    cb('我是一个原生的task');
    console.log(plan);
  }, rdom());
}

var plan = [
  '你好!',
  hello(' world'),
  end
]
sas(plan,{iterator:hello});

```
结果为

`[ 'hello你好!', 'hello world', '我是一个原生的task' ]`

---------------------------------------

`opt`还有两个属性,这个放最后说.我们先来看一下重点,任务function的两个参数:

##`cb`
整个程序运行起来就像导火索一样,自动将当前任务替换为cb的值.
```javascript
////////////后面一直用到的
var sas = require('../sas-debug');
var rdom = function() { //随机time
  return Math.random() * 1000;
}
var test = function(param){
  return function(cb){
    setTimeout(function(){
    	cb(param);
    },rdom());
  }
}
var end = function(cb){
    cb('end');
    console.log(this);
  }
/////////////////////////////////


sas([
  test(123),
  function(cb) {
    cb('参数个数大于1的话 ', '会生成一个数组');
  },
  test(), //什么都没有 undefined
  end
]);

//////////////////////////////////////
log结果:
[ 123, [ '参数个数大于1的话 ', '会生成一个数组' ], undefined, 'end' ]
//
```
他有一些实用的魔法字参数:

`cb('$STOP',err)`

中止当前程序.同步的会立刻停住,异步的返回结果不做任何处理.

err将会传给`opt.allEnd`（如果有的话） ,作为第一个参数。opt.allEnd本文见最后。
```javascript


sas([
  test('aaa'),
  test('$STOP'),
  test('不会被执行')
]);
```
`cb('$END')`

中止 `this`
```javascript
sas([{
    key1: [test('aaa'), test('$END'), test('bbb')], //test('bbb')将不会执行.
    key2: [test('$END'), test('aaa'), test('bbb')]//后面两都不会执行
  },
  end
]);


//////////////////////////////////////
log结果:
[ { key1: [ 'aaa', [Function], [Function] ],
    key2: [ [Function], [Function], [Function] ] },
  undefined ]
```
`cb('$RELOAD',param)`

会重载当前任务为 param || 它自身.
```javascript
var test = {
key1:test('key1'),
key2:test('key2')
}


sas([
  function(cb) {
    cb('$RELOAD',test);
  },
  end
]);


//////////////////////////////////////
//log结果
[ { key1: 'key1', key2: 'key2' }, undefined ]

```
`cb('$THIS=',result)`

将结果直接保存到 `this`里!
```javascript

sas([{
    key1: [test('aaa'),

      function(cb) {
        cb('$THIS=', '我直接存到this里拉!');
      },

      test('bbb')
    ],
    key2: [test('aaa'), test('bbb')]
  },
  end
]);

//////////////////////////////////////
//log结果
[ { key1: '我直接存到this里拉!', key2: [ 'aaa', 'bbb' ] }, 'end' ]
//好处是少了一层嵌套,用起来方便.
```
`cb('$HOLD')`

保持原来数据。

最后别忘了一定要cb哦.

---------------------------------------

##`t`
###t是一个智能对象.像this但又不是this,所以叫t.

不用它的时候不要选,选了它一定要用.

`t.index`: 返回当前任务的index;

`t.parent` 返回`this`的父级

`t.pIndex`: 返回`this`的父级的index

`t.Sparent` 返回`this`的第一个Sync父级

`t.SpIndex` 返回`this`的第一个Sync父级index

`t.path`: 返回当前任务到根的索引数组.

`t.fspath()`: 返回一个去掉数字索引的数组,像文件路径,所以叫fspath

`t.push(tasks)`: 将一些元素添加到`this`里,以继续运行.只能数组元素用.


---------------------------------------

最后,我们再来说一下___`opt`___另外属性:

`opt.allEnd`

只在返回cb('$STOP') 或程序完全结束时触发.
```javascript
opt.allEnd(err,result){ //国际惯例,第一个err,第二个结果

};
```

第一个参数`err`:只有cb('$STOP')才会有值,否则一直都是null;

第二个参数`result`:只有程序完全结束才会有值,值为完成后的`arr`.
```javascript
sas([
  test('aaa'), {
    key1: test('ccc'),
    key2: test('ddd')
  },
  test('bbb')
], {
  allEnd: function(err, result) {
    //不可能err,因为我程序里没有cb('$STOP').
    console.log(result);
  }
});


//////////////////////////
//log结果
[ 'aaa', { key1: 'ccc', key2: 'ddd' }, 'bbb' ]
```
`opt.process`

返回程序进度:
```javascript
opt.process= function(count1,count2){
  //count1 已轮询的计数
  //count2 已回调的计数.
}
```
异步进度条的实现详见demo process.html

注:如果回调很多的话,可能会有影响性能.

`opt.debug`

只有sas-debug.js里有这个属性,默认是`true`.

将会显示如下追踪:

![image](https://github.com/hezedu/SomethingBoring/blob/master/sas/saslog.png?raw=true)

其中白色为Sync,灰色为Async.

在回调很多的情况下,log过多会造成严重阻塞.

想要关闭掉也可以这样:

`sas.debug = false`

---------------------------------------

#项目说明
项目目录下:

___sas.js___   主要的.

___sas-debug.js___   debug版,默认会生成log,影响性能.用于开发和示例.

___sas-min.js___   压缩好的,前端用.

___/demo___   示例文件夹.

---------------------------------------





















