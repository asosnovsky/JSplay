function FactorObj (name, freq) {
	if(!name) throw new Error('FactorObj defined without a name!');
	if(!freq) throw new Error('FactorObj defined without a freq!');

	var __properties = {
		name: name,
		freq: freq
	};

	this.__defineSetter__('setProp', function (val) {
		if(typeof val === 'number') {
			if(__properties.freq < 0) val = 0;
			if(__properties.freq > 1) val = 1;
			__properties.freq = val;

		} else if(typeof val === 'string') {
			__properties.name = val

		} else {
			throw new Error('setProp is for numbers or strings!!');
		}
	});
	this.__defineSetter__('properties', function () {
		throw new Error('You may not override \'properties\'!');
	});
	this.__defineGetter__('properties', function () {
		var o = {name: __properties.name, freq: __properties.freq};
		return o;
	});
};

function FactorList () {
	var __list = [];

	this.__defineSetter__('add',function (Obj) {	
		if( Obj instanceof FactorObj ) {
			__list.push(Obj);
		} else if( Obj.name && Obj.freq ) {
			__list.push(new FactorObj( Obj.name , Obj.freq ) )
		} else {
			throw new Error('Wrong instance! Must be a FactorObj!');
		}
	});

	this.__defineGetter__('get', function(){
		return __list;
	});

	this.__defineGetter__('look', function(){
		var retArray = [];
		for (var i = __list.length - 1; i >= 0; i--) {
			retArray[i] = __list[i].properties;
		};
		return retArray;
	});
};

function Helper () {}
Helper.prototype.fixFreq = function(brick, newInput) {
	if(!brick instanceof FactorList) throw new Error('Must pass a FactorList into fixFreq!');
	console.log(brick);

	if( brick.look.length !== 0 ) {
		var sum = 0;
		for (var i = brick.look.length - 1; i >= 0; i--) {
			console.log(brick.look[i], brick.look[i].freq - ( newInput / brick.look.length ));
			brick.get[i].setProp = brick.look[i].freq - ( newInput / brick.look.length );
			sum += brick.look[i].freq;
		};
		newInput = 1 - sum;
	} else {
		newInput = 1;
	}
	
	return newInput;
};


function Sex (name, freq) {
	
	//-----------------------------------------
	//	Configure Sex
	//-----------------------------------------
	var helper = new Helper();
	Sex.__list = Sex.__list || new FactorList();
	Sex.__defineGetter__('list', function(){
		return Sex.__list.look;
	});

	//-----------------------------------------
	//	Fix freq
	//-----------------------------------------
	freq = helper.fixFreq(Sex.__list,freq);

	//-----------------------------------------
	//	Define Properties
	//-----------------------------------------
	var __prop = new FactorObj(name, freq);

	//-----------------------------------------
	//	Configure returned Object
	//-----------------------------------------
	this.__defineSetter__('newName',function(val){
		if(!typeof val === 'string') throw new Error('new name must be string!');
		__prop.setProp = val;
	});

	//-----------------------------------------
	//	Save new properties
	//-----------------------------------------
	Sex.__list.add = __prop;
	this.properties = __prop.properties;
}