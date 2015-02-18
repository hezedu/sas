var dw_stride = require('../dw_stride');
var fs = require('fs');

var plan;
var count = 0;

var mktree = function(path) {
	if (path === 'root') {
		console.time('实际用时');
	}
	return function(cb) {
		var start = Date.now();
		if(path !==__dirname + '/root'){
			path=this['_preant']+path;
		}
		fs.mkdir(path, 777, function(err, result) {
			if (err) {
				console.log(err);
				return cb('$STOPALL');
			}
			console.log('dwpath===='+path);
			console.log('plan[0]===='+plan[0]);
			cb(path);
			var end = Date.now();
			var ms = end - start;
			count += (ms);
			console.log(result + ':' + ms + 'ms');
			if (path === __dirname + '/end') {
				console.log('result=' + JSON.stringify(plan));
				console.log('\n统计:' + count + 'ms');
				console.timeEnd('实际用时');
			}

		});
	}
}
plan = [
	mktree(__dirname + '/root'),
	{
		'1': [mktree('/1'), {
				'1-1': [
					mktree('/1-1'), {
						'1-1-1': mktree('/1-1-1'),
						'1-1-2': mktree('/1-1-2')
					}
				],
				'1-2': mktree('/1-2'),
				'1-3': mktree('/1-3')
			}

		],
		'2': mktree('/2'),
		'3': mktree('/3')
	},
	mktree(__dirname + '/end')
]


dw_stride(plan);