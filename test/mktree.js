var sas = require('../sas');
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

var plan2 = [
	__dirname + '/root' + Date.now(), {
		'1': ['/1', {
			'1': '/1-1',
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
sas(plan, {
	debug: true,iterator:mktree
});