function test(){
	var d=Date.now()+2000;
	var obj={
		t1:'t1',
		t2:'t2',
		t3:'t3',
		t4:'t4'
	}
	for(var i in obj){
		setTimeout(function(){
			console.log('i== '+i);
		},100)
	}
	while(Date.now()<d){
		
	}
	console.log('go');
}
test()