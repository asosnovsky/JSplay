var City = (function(cityName) {
	//-----------------------------------------
	//	Check there is a city name
	//-----------------------------------------
	if(!cityName) cityName = 'New Town';

	//-----------------------------------------
	//	Define Classes
	//-----------------------------------------
	// function FactorObj (name, freq) {
	// 	if(!name) throw new Error('FactorObj defined without a name!');
	// 	if(!freq) throw new Error('FactorObj defined without a freq!');

	// 	if(freq < 0) freq = 0;
		
	// 	this.name = name;
	// 	this.freq = freq;
	// }

	//-----------------------------------------
	//	Define Defaults
	//-----------------------------------------
	// var __future_factors = {
	// 	sexes: [new FactorObj('male',0.5), new FactorObj('female',0.5)],
	// 	names: [new FactorObj('Jack',0.5),new FactorObj('Jill',0.5)]
	// };
	var __factors = {
		sex : ['male', 'female'],
		sex_freq : [0.5, 0.5],
		names : [
			'Josh','Jake', 'Julian','Robert','Mike','Andrea','Anna','Nicole','Ember', 
			'Stacy','Hally','Alex','Miranda','Nuke','Bingo','Rey Rey','Shlomo','Joey',
			'Tim'
		],
		names_freq : [
			0.05263157894736842, 0.05263157894736842, 0.05263157894736842,
			0.05263157894736842, 0.05263157894736842, 0.05263157894736842,
			0.05263157894736842, 0.05263157894736842, 0.05263157894736842, 
			0.05263157894736842, 0.05263157894736842, 0.05263157894736842, 
			0.05263157894736842, 0.05263157894736842, 0.05263157894736842, 
			0.05263157894736842, 0.05263157894736842, 0.05263157894736842, 
			0.05263157894736842
		]
	};
	var __started = false;
	//-----------------------------------------
	//	Configure Start Point
	//-----------------------------------------
	var _aging_factor = 0.1;
	var _timeInc = 10000;
	var _people = [];
	
	//-----------------------------------------
	//	Define Modules
	//-----------------------------------------
	function Death() {}
	function Birth() {}
	function Age() {}
	function Culture() {}
	function Town() {}

	//-----------------------------------------
	//	Helpers
	//-----------------------------------------
	Culture.prototype.addNewFactor = function (type, name, freq) {
		if(!freq) freq = (1 / __factors[type].length);
		if(!name) throw new Error('Needs a name to continue!');

		var sum = 0;
		for (var i = __factors[type].length - 1; i >= 0; i--) {
			__factors[type + '_freq'][i] = __factors[type + '_freq'][i] - freq / (__factors[type].length);
			sum += __factors[type + '_freq'][i];
		};
		__factors[type + '_freq'][__factors[type].length] = 1 - sum;
		__factors[type][__factors[type].length] = name;
		console.log('New ' + type + ' were introduced to ' + cityName + ': ' + name + '!');
	};
	
	Culture.prototype.checkOrigins = function(type, name) {
		if(__factors[type].indexOf(name) < 0){
			this.addNewFactor(type, name);
		};
	};

	//-----------------------------------------
	//	Death Module Configuration
	//-----------------------------------------
	Death.prototype.oldAge = function(age) {
		var death = false;
		var p = 0;
		var x = Math.random();

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

	Death.prototype.death = function(id) {
		var death = false;
		if(this.oldAge(_people[id].age)) death = true;
		return death;
	};
   
	//-----------------------------------------
	//	Age Module Configuration
	//-----------------------------------------
	Age.prototype.aging = function() {
		new Birth().newborn();
	   
		for( var i = 0; i <= _people.length - 1; i++){
	   
				_people[i].age = _people[i].age + _aging_factor;
			   
				if(_people[i].age% 1 === 0) console.log(_people[i].name + ' of ' + cityName + ' is now ' + _people[i].age);
			   
				if ( new Death().death(i) ) {
						console.log( _people[i].name + ' of ' + cityName + ' has died at age ' + _people[i].age);
						_people.splice(i,1);
				}
		};
	   
		setTimeout(function(){
				new Age().aging();
		}, _timeInc);
	};
   	
	//-----------------------------------------
	//	Birth Module Configuration
	//-----------------------------------------
	Birth.prototype.determine = function(type) {
		var cdf = [];
		var sum = 0;
		var i;

		for (var i = 0; i < __factors[type].length; i++) {
			sum += __factors[type + '_freq'][i];
			cdf[i] = sum;
		};

		var x = Math.random();

		for ( i=0 ; i<cdf.length && x >= cdf[i] ; i++ );

		return __factors[type][i];
	};

	Birth.prototype.newborn = function() {
		var newborn = false;
		var x = Math.random();
	   
		if( x < ( 2/_people.length ) ) {
			this.makeBaby();
		};
	};

	Birth.prototype.makeBaby = function(name, sex) {
		if(!name) name = this.determine('names');
		if(!sex) sex = this.determine('sex');

		_people.push({name:name, age:0, sex:sex});
		console.log( name + ' (' + sex + ') was Born in ' + cityName + '!');
	};

	//-----------------------------------------
	//	Town Module Configuration
	//-----------------------------------------
	Town.prototype.checkPeople = function() {
		return _people;
	};

	Town.prototype.createTown = function() {
		if(__started) throw new Error('City already started, can\'t start again!');
		__started = true;

		for (var i = 0; i <= Math.ceil(Math.random() * 20); i++) {
			_people.push({
				name: __factors.names[(Math.round(Math.random() * (__factors.names.length - 1)))],
				age: Math.floor(Math.random() * 100 ), 
				sex: __factors.sex[(Math.round(Math.random() * (__factors.sex.length - 1)))]
			});
		};
		new Age().aging();
	};

	Town.prototype.makeBaby = function(name, sex) {
		new Culture().checkOrigins('sex',sex);
		new Culture().checkOrigins('names',name);
		new Birth().makeBaby(name, sex);
	};

	Town.prototype.addFactors = function(factors) {
		if(!factors) {
			return this.checkFactors();
			throw 'addFactors is called for no reason!';
		
		} else {
			var keys = Object.keys(factors);
			for (var i = keys.length - 1; i >= 0; i--) {
				if(factors[keys[i]] && factors[keys[i]] instanceof Array && ( keys[i] === 'names' || keys[i] === 'sex' )) {
					
					for (var k = factors[keys[i]].length - 1; k >= 0; k--) {
						if(factors[keys[i]][k] instanceof Object){
							if(!factors[keys[i]][k].freq) throw new Error('If you are adding an Object, freq should be included!');
							
							new Culture().addNewFactor(keys[i], factors[keys[i]][k].name, factors[keys[i]][k].freq);
						
						} else if(typeof factors[keys[i]][k] === 'string') {
							new Culture().addNewFactor(keys[i], factors[keys[i]][k]);
						}
					};

				}else{
					throw new Error('Could not add factor, check that it is defined properly or that it is a valid factor;');
				}
			};// for (var i = keys.length - 1; i >= 0; i--)
		
		}
	};

	Town.prototype.changeFactors = function(factors) {
		if(!factors) {
			return this.checkFactors();
			throw 'changeFactors is called for no reason!';
		
		} else {
			var keys = Object.keys(factors);
			for (var i = keys.length - 1; i >= 0; i--) {
				//-----------------------------------------
				//	Names / Sex
				//-----------------------------------------
				if( keys[i] === 'names' || keys[i] === 'sex' ) {
					
					if(factors[keys[i]] instanceof Array){

						__factors[ keys[i] ] = factors[keys[i]];
						__factors[ keys[i] + '_freq' ] = Array.apply(null, new Array(factors[keys[i]].length)).map(function(){return 1/factors[keys[i]].length});

					} else if(factors[keys[i]] instanceof Object) {

						if(!factors[keys[i]].freq) throw new Error('If you are passing an Object, freq should be included!');
						if(factors[keys[i]].freq.length !== factors[keys[i]].names.length) throw new Error('names and freq should be of equal length');

						__factors[ keys[i] ] = factors[keys[i]].names;
						__factors[ keys[i] + '_freq' ] = factors[keys[i]].freq;
						
					} else {
						throw new Error(keys[i] + 'must be an Array or Object!');
					}
				
				}else if(factors.time || factors.aging_factor){

					//-----------------------------------------
					//	Time / Aging Factor
					//-----------------------------------------
					if(factors.time && typeof factors.time === 'number' && factors.time > 0) _timeInc = factors.time;
					if(factors.aging_factor && typeof factors.aging_factor === 'number' && factors.aging_factor > 0) _aging_factor = factors.aging_factor;
				
				} else {
					throw new Error('Could not change factor, check that it is defined properly or that it is a valid factor;');
				}
			};// for (var i = keys.length - 1; i >= 0; i--)

		}
	};

	Town.prototype.checkFactors = function() {
		return __factors;
	};

	Town.prototype.checkStats = function() {
		
		var retObj = {
			number_of_people_alive: _people.length,
			name_count: {},
			sex_count: {},
			max_age: 0,
			min_age: 0,
			mean_age: 0
		}

		for(var i = 0; i <= _people.length - 1; i++){
			//-----------------------------------------
			//	Count Names
			//-----------------------------------------
			for(var nameId = 0; nameId <= __factors.names.length - 1; nameId++){
				if(_people[i].name === __factors.names[nameId]){
					if(retObj.name_count[__factors.names[nameId]]){
						retObj.name_count[__factors.names[nameId]]++;
					}else{
						retObj.name_count[__factors.names[nameId]] = 1;
					}
				}
			}
			//-----------------------------------------
			//	Count Sexes
			//-----------------------------------------
			for(var sexId = 0; sexId <= __factors.sex.length - 1; sexId++){
				if(_people[i].sex === __factors.sex[sexId]){
					if(retObj.sex_count[__factors.sex[sexId]]){
						retObj.sex_count[__factors.sex[sexId]]++;
					}else{
						retObj.sex_count[__factors.sex[sexId]] = 1;
					}
				}
			}
			//-----------------------------------------
			//	Analyzes Age
			//-----------------------------------------
			if(retObj.max_age < _people[i].age) {
				retObj.max_age = _people[i].age
			}
			if(retObj.min_age > _people[i].age) {
				retObj.min_age = _people[i].age
			}
			retObj.mean_age += _people[i].age;
		}
			retObj.mean_age = (retObj.mean_age / retObj.number_of_people_alive);
		return retObj;
	};

	return new Town();

});

var Luxemburg = new City('Luxemburg');
var Toronto = new City('Toronto');

Luxemburg.createTown();
Toronto.createTown();

Toronto.addFactors({names:[{name: 'Rob', freq: 0.01} , 'Trudeau' , 'Peter']});
