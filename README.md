# sas2.1.0
S代表sync,AS代表async。Sas 是一个javascript处理(同/异)步控制流.

使用sas寻找磁盘最深处:

![image](https://github.com/hezedu/SomethingBoring/blob/master/sas/140deep.png?raw=true)

# 安装
[Node.js](http://nodejs.org)： `npm install sas`

浏览器直接src,不支持IE8.

# API
sas(tasks);

sas(tasks,opts);

sas(tasks,opts.allEnd);

sas(tasks,opts.iterator,opts.allEnd);

---------------------------------------

## tasks

包含三种元素:

___Array___代表同步.
```javascript
//同步挨个执行
[task1,task2,task3] 
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
function(cb){
  cb();
}
```

---------------------------------------

### 嵌套示例:
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

## cb

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
  test(null), 
  end
]);

//////////////////////////////////////
log结果:
[ 123, null, 'end' ]
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
`cb('$GO')`

跳转,只能在数组里用，`cb('$GO',-1)` 后退一步.
`cb('$GO',2)`  跳过下一个.

最后别忘了一定要cb哦.

---------------------------------------




## t
### t是一个智能对象.像this但又不是this,所以叫t.

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





## opts
opt.iterator 用来替换每一个`tasks`中不是function的基础单位.
结构为:
```javascript
opt.iterator=function(param){
  return function(cb,t){//return一个task.
    cb();
  }
}
```

opt.allEnd 只在返回cb('$STOP') 或程序完全结束时触发.
```javascript
opt.allEnd(err,result){ //国际惯例,第一个err,第二个结果

};
```

opt.process 任务进度。
```javascript
opt.process= function(count1,count2){
  //count1 已轮询的计数
  //count2 已回调的计数.
}
```
示例：[前端进度条](https://github.com/hezedu/sas/blob/master/demo/process.html)








---------------------------------------





# 追踪

使用项目目录下：___sas-debug.js___将会显示如下追踪:

![image](https://github.com/hezedu/SomethingBoring/blob/master/sas/saslog.png?raw=true)

其中白色为Sync,灰色为Async.







---------------------------------------




# 项目说明
项目目录下:

___sas.js___   主要的.

___sas-debug.js___   debug版,默认会生成log,影响性能.用于开发和示例.

___sas-min.js___   压缩好的,前端用.

___/demo___   示例文件夹.




---------------------------------------





















