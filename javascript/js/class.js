class Animal{
	constructor() {
	    this.type='animal';
	}
	say(say){
		console.log(this.type +' say '+say);
	}
}

let ani=new Animal();
ani.say('hello,i am animal');

class Cat extends Animal{
	constructor(){
		super();
		this.type='cat';
	}
}
let cat=new Cat();
cat.say('hello ,i am cat');
