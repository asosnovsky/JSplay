var city = (function () {
	var _timeInc = 0.1;
	var _sex = ['male', 'female'];

	var __people = [
		{name: 'Alex', age: 22, sex: _sex[Math.floor(Math.random() * 2 )]},
		{name: 'Miranda', age: 25, sex: _sex[Math.floor(Math.random() * 2 )]},
		{name: 'Nuke', age: 5, sex: _sex[Math.floor(Math.random() * 2 )]},
		{name: 'Ghoul', age: 29, sex: _sex[Math.floor(Math.random() * 2 )]},
		{name: 'Bingo', age: 29, sex: _sex[Math.floor(Math.random() * 2 )]},
		{name: 'Rey Rey', age: 30, sex: _sex[Math.floor(Math.random() * 2 )]},
		{name: 'Shlomo', age: 40, sex: _sex[Math.floor(Math.random() * 2 )]},
		{name: 'Joey', age: 50, sex: _sex[Math.floor(Math.random() * 2 )]},
		{name: 'Tim', age: 22, sex: _sex[Math.floor(Math.random() * 2 )]},
	];
	
	//-----------------------------------------
	//	Death
	//-----------------------------------------
	function Death () {}

	/**
	 * Computes P(death due to oldAge) ~ mixed Exponential
	 * 
	 * @param  {Number} age 
	 *
	 * @return {Bollean}     true: dead, false: alive
	 * 
	 */
	Death.prototype.oldAge = function(age) {
		var death = false;
		var p = 0;
		var x = Math.random() * 1.3 ;

		if( age < 20 ){
			p = ( 1 - Math.exp(-age/100000) );
		}else if( age >= 20 && age < 40){
			p = ( 1 - Math.exp(-age/10000) );
		}else if( age >= 40 ){
			p = ( 1 - Math.exp(-age/100) );
		}

		if(x <= p){
			var death = true;
		}
		return death;
	};

	/**
	 * Overal P(death)
	 * 
	 * @param  {Number} age 
	 * 
	 * @return {Bollean}     true: dead, false: alive
	 * 
	 */
	Death.prototype.death = function(age) {
		var death = false;
		if(this.oldAge(age)) death = true;
		return death;
	};

	/**
	 * P(Surivial at Age X)
	 * 
	 * @param  {Number} age 
	 * 
	 * @return {Number}     
	 * 
	 */
	Death.prototype.survivalAtAge = function(age) {
		var sums = [0,0];
		for(var i=0; i <= 1000; i++){
			if(new Death().death(age)){
				sums[0]++;
			}else{
				sums[1]++;
			}
		}
		return (sums[1]/(sums[1]+sums[0]));
	};

	/**
	 * E[age of death]
	 * 
	 * @return {Number} 
	 * 
	 */
	Death.prototype.expectedAge = function() {
		var sum = 0;
		var sums = [];
		var fin = 0;

		for (var i = 100; i >= 0; i--) {
			sum += new Death().survivalAtAge(i);
			sums[i] = (new Death().survivalAtAge(i));
		};
		for (var i = sums.length - 1; i >= 0; i--) {
			sums[i] = sums[i]/sum
			fin += (sums[i])*i;
		};
		return [fin,sums];
	};

	//-----------------------------------------
	//	Town
	//-----------------------------------------
	function Town() {}

	/**
	 * New Born
	 * 
	 * @param  {String} name 
	 * 
	 * @param  {String} sex  
	 * 
	 * @return {Null}   
	 *    
	 */
	Town.prototype.newBorn = function(name, sex) {
		if(!name) name = Math.random(10).toString(36).substring(7);
		if(!sex) sex = _sex[Math.floor(Math.random() * 2 )];

		__people.push({name:name, age:0, sex:sex});
		new Town().aging();
		console.log(name + ' was born!');
	};

	/**
	 * Ages Villagers
	 * 
	 * @return {null} 
	 * 
	 */
	Town.prototype.aging = function() {
		if(aging){
			clearInterval(aging);
		}

		var aging = setInterval(function () {

			for (var person = 0; person < __people.length; person++) {

				__people[person].age += _timeInc;// age

				if(new Death().death(__people[person].age)) {
					//-----------------------------------------
					//	Kill that person!
					//-----------------------------------------
					console.log(__people[person].name + ' has died! at age ' + __people[person].age);
					__people.splice(person,1);
					new Town().aging();

				}

			};

		}, 500);
	};

	Town.prototype.attemptToKill = function(person) {
		new Death(person).death();
	};
	/**
	 * Returns a list of villagers
	 * 
	 * @return {null} 
	 * 
	 */
	Town.prototype.checkVillagers = function() {
		return __people;
	};

	return new Town();
})()

city.aging();