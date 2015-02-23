function test(){
	for(var i=0;i<10;){
		console.log(i);
		i++;
		if(i===5){
			return console.log('end')
		}
	}
}
test()