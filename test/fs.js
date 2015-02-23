var sas = require('../sas');
var fs = require('fs');

var plan;
var count = 0;

var mktree = function(path) {
	return function(cb,ext) {
			if(typeof ext.index ==='string'){
	
				path=ext.parent[0]+path;
				console.log('ext.parent[0]== '+ext.parent[0])
			}
			console.log('path=='+path);
		fs.mkdir(path, 777, function(err, result) {
			if (err) {
				return cb('$STOPALL');
			}
			cb(path);
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


sas(plan,{debug:true});