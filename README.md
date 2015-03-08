# sas
S代表sync AS代表async。

Sas 是一个javascript程序，用以处理(同/异)步，它最大的特点是可以递归.

它的目地就是破解callback hell;
#安装
[Node.js](http://nodejs.org)： `npm install sas`

浏览器直接src,不支持IE8.
#项目说明
项目目录下:

sas.js 主要的.

sas-debug.js debug版,默认会生成log,影响性能.用于开发和示例.

sas-min.js 压缩好的,前端用.

demo 示例文件夹.本文所引用示例均出自此.

#快速示例

异步创建文档树 (demo文件夹下mktree.js):
```javascript
var sas = require('../sas-debug');
var fs = require('fs');
var dir = __dirname + '/root' + Date.now();//根目录名字: root+当前时间

function _mkTree(data) { //iterator
  return function(cb, t) {
    var fspath = dir + '/' + t.fspath().join('');
    if (t.index === 0) { //根据this 的index 判定是否为目录
      fs.mkdir(fspath, 777, function(err, result) {
        if (err) {
          return cb('$STOP');
        }
        cb();
      });
    } else { //创建文件并写入。
      fs.writeFile(fspath, data, function(err) {
        if (err) {
          return cb('$STOP');
        }
        cb();
      });
    }
  }
}

var tree = [
  null, {
    '/1': [null, {
      '/1-1': 'hello!1-1',
      '/1-2': 'hello!1-2',
      '/1-3': 'hello!1-3'
    }],
    '/2': [null, {
      '/2-1': 'hello!2-1',
      '/2-2': 'hello!2-2',
      '/2-3': 'hello!2-3'
    }],
    '/3': [null, {
      '/3-1': 'hello!3-1',
      '/3-2': 'hello!3-2',
      '/3-3': 'hello!3-3'
    }]
  }
];

sas(tree, {
  iterator: _mkTree
});
```
结果:将会在当前目录创建一个root开头的文件夹,里面有1,2,3三个文件夹,三个文件下各有三个文件,文件内容是hello! 加上文件名字.

#使用说明
用法很简单,sas只有一个function

###sas(arr,opt);

##`arr`:数组,包含三种元素:

对象Object:代表异步.
```javascript
{ //异步同时执行
  'key1': task1,
  'key2': task2,
  'key3': task3
}
```
数组Array:代表同步.
```javascript
[//同步挨个执行
   task1,
   task2,
   task3
] 
```
函数Function:基础单位,代表任务.
```javascript
function(cb,t){
  cb();
}
```
`cb`回调,任务完成后必须返回.

`t`可选参数,智能对象,像this但又不是this,所以叫t,用不着的话就不要选,会有一些性能开销,这个后面再详解.

---------------------------------------

支持无限嵌套,但是要注意一些风格问题:
```javascript
//异步内嵌套异步,毫无意义.
{
  'attr1': task1,
  {
    'key1': task2,
    'key2': task3
  }
}
////////////////
//同步内嵌套同步,多此一举.
[
  task1, [
  task2, task3
  ]
]
```
以上都不会出错,但是都是些冗余的嵌套,因此不推荐.

---------------------------------------

###有效率的正确示例:
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
[多重嵌套](#快速示例)

这样的好处是很直观,如快速示例tree,跟文件系统结构是一样的,这样再多层也不怕.只要记住array是同步,object是异步就行.

---------------------------------------
##`opt`可选
opt.iterator 用来替换每一个`arr`不是function的基础单位.

结构为:
```javascript
opt.iterator=function(opt){
 return function(cb,t){//return一个task.
  cb();
 }
}
```
###示例:
```javascript
var rdom = function() { //随机time
  return Math.random() * 1000;
}
var hello = function(opt){
  return function(cb){
    setTimeout(function(){
    	cb('hello'+opt);
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
sas(plan);

```
结果为 `[ 'hello你好!', 'hello world', '我是一个原生的task' ]`

如果基础单位不是函数而又没用opt.iterator的话,sas就会抛出一个错误.


###示例:
```javascript


```






第一个参数是一个数组,第二个参数为可选


#数组是同步



#快速示例
nodejs全部用异步方法`mkdir`创建目录树。

先创建一个根目录，再在根目录下创建三子目录，再在三子目录下各创建三子目录。
```javascript
var sas = require('sas');
var fs = require('fs');

var mktree = function(path) {
  return function(cb, ext) {
    if (ext.Sparent) {
      path = ext.Sparent[0] + path;
    }
    fs.mkdir(path, 777, function(err, result) {
      if (err) {
        return cb('$STOP');
      }
      cb(path);
    });
  }
}
var plan = [
	mktree(__dirname + '/root' + Date.now()), {
		'1': [mktree('/1'), {
			'1-1': mktree('/1-1'),
			'1-2': mktree('/1-2'),
			'1-3': mktree('/1-3')
		}],
		'2': [mktree('/2'), {
			'2-1': mktree('/2-1'),
			'2-2': mktree('/2-2'),
			'2-3': mktree('/2-3')
		}],
		'3': [mktree('/3'), {
			'3-1': mktree('/3-1'),
			'3-2': mktree('/3-2'),
			'3-3': mktree('/3-3')
		}]
	}
];
sas(plan);
```
#详细说明

## sas只有一个function: 
#sas(arr,opt);
##arr

第一个参数是一个数组,包含三种元素:
- 数组Array:代表同步sync(因为有序)
- 对象Object:代表异步async(因为有key,顺序乱了也没事)
- 函数Function:基本元素。结构为：
```javascript
function(cb,ext){

}
```
###cb 
回调，必须。如果arguments.length<=1的话，当前元素会被替换为result。例：
```javascript
var line;

line = [
  function(cb) {
    setTimeout(function() {
      cb('first');
    }, 200);
  },
  function(cb) {
    setTimeout(function() {
      cb('last');
      console.log(line);
      // line =  ['first', 'last']
    }, 200);
  }
]
sas(line);
```
__魔法字$__：

`$STOP`: 中止程序

`$END`: 中止this

如果arguments.length>1，当前元素会被替换为一个数组。
###ext是一个对象，可选。提供当前元素导航。目前有：

	`index` 当前元素index;
	`path` 是一个数组，包含所有当前元素到root的key和index值。
	`parent` 父元素
	`pIndex` 父元素 index
	`Sparent` 是当前元素第一个同步的父级。如第一个例子：
```javascript
    if (ext.Sparent) {
      path = ext.Sparent[0] + path;
    }
```

---------------------------------------

基本元素若为其它类型而##opt属性iterator不为true的话，会抛出一个错误。

##opt

第二个参数是一个对象,可选：

`debug:bool` 强大的追踪。不管是异步还是同步都能追踪到，默认为false。
第一个的例子:
```javascript
sas(plan,{debug:true});
```
console将会显示log：

![image](https://github.com/hezedu/SomethingBoring/blob/master/sas/saslog.png?raw=true)

其中灰色代表异步，白色代表同步。

`iterator:Function` 返回一个function.结构为：
```javascript
function test(opt){
  return function(cb,ext){
  
  }
}
```
如果 ##arr 里的基本元素type不为function，iterator将会被调用。
第一个例子:
```javascript
var plan = [
	__dirname + '/root' + Date.now(), {
		'1': ['/1', {
			'1-1': '/1-1',
			'1-2': '/1-2',
			'1-3': '/1-3'
		}],
		'2': ['/2', {
			'2-1': '/2-1',
			'2-2': '/2-2',
			'2-3': '/2-3'
		}],
		'3': ['/3', {
			'3-1': '/3-1',
			'3-2': '/3-2',
			'3-3': '/3-3'
		}]
	}
];
sas(plan,{iterator:mktree});
```
将会得到相同的结果。
#其它
如果`sas.debug＝true`,则debug默认为true。
