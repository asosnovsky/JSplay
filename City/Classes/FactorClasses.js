var FactorList = (function () {
	
	var __properties = {};
	var __list = {};

	function FactorObj (name, freq) {
		if(!name || name.constructor !== String ) throw new Error('FactorObj defined without a name!');
		if( ( !name && name !== 0 ) || freq.constructor !== Number ) throw new Error('FactorObj defined without a freq!');

		
		if( freq > 1 ) freq = 1;

		/**
		 * Sets Properties
		 * 
		 * @param  {Number || String}
		 * 
		 */
		this.__defineSetter__('setProp', function (val) {
			if(val.constructor === Number) {
				
				if(val > 1) val = 1;

				if(val > 0) {
					__properties[name] = val;
				} else {
					delete __list[name];
					delete __properties[name];
				}

			} else if(val.constructor === String) {
				__properties[val] = __properties[name];
				delete __properties[name];
				name = val;

			} else {
				throw new Error('setProp is for numbers or strings!!');
			}
		});

		this.init = function() {
			if( freq > 0 ) {
				__properties[name] = freq;

			} else {
				__list[name].setProp = 0;
				
			}
		}
	};

	function Methods () {

		function fixaddFreq(freq) {
			if( freq > 1 ) freq = 1;
			if( freq < 0 ) freq = 0;

			var sum = 0;
			var f = 0;
			Object.keys(__list).forEach(function(key){
				f = __properties[key];
				__list[key].setProp = f * ( 1 - freq );
				sum += f * ( 1 - freq );
			});

			return 1 - sum;
		}

		function fixremFreq(freq) {
			if( freq > 1 ) freq = 1;
			if( freq < 0 ) freq = 0;

			var sum = 0;
			var f = 0;
			Object.keys(__list).forEach(function(key){
				f = __properties[key];
				__list[key].setProp = f / ( 1 - freq );
				sum += f / ( 1 - freq );
			});

			return 1 - sum;
		}

		function removeOne(key) {
			if(__list[key]) {
				__list[key].setProp = fixremFreq(__properties[key]);
			}
		}

		function addOne() {
			var s = ''; var n = 0;

			if ( arguments.length !== 2 ) return;

			if (arguments[0].constructor === String && arguments[1].constructor === Number) {

				s = arguments[0];
				n = arguments[1];

			};

			if (arguments[1].constructor === String && arguments[0].constructor === Number) {

				s = arguments[1];
				n = arguments[0];

			};

			if(!__list[s]) {

				__list[s] = new FactorObj( s , fixaddFreq(n) );
				__list[s] .init();

			}
		}

		function editOne() {
			var s = ''; var n = 0;
			console.log(arguments,'[][][][][]');
			if ( arguments.length !== 2 ) return;

			if (arguments[0].constructor === String && arguments[1].constructor === Number) {

				s = arguments[0];
				n = arguments[1];

			};

			if (arguments[1].constructor === String && arguments[0].constructor === Number) {

				s = arguments[1];
				n = arguments[0];

			};

			if(__list[s]) {
				console.log('%c ' + s,'background:red;colr:white;');
				removeOne(s);
				__list[s] = new FactorObj( s , fixaddFreq(n) );
				__list[s] .init();

			}			
		}
		return {
			add : function (valArr) {
				for (var i = 0; i < valArr.length; i++) {
					if( valArr[i] && valArr[i].constructor === Array ) {
						addOne( valArr[i][0] , valArr[i][1] );
					}
				};
			},
			remove : function (keys) {
				if(keys.constructor === String) {
					removeOne( keys );
					return;
				}

				for (var i = 0; i < keys.length; i++) {
					if( keys[i] && keys[i].constructor === String ) {
						removeOne( keys[i] );
					}
				};
			},
			edit : function (valArr) {
				for (var i = 0; i < valArr.length; i++) {
					if( valArr[i] && valArr[i].constructor === Array ) {
						editOne( valArr[i][0] , valArr[i][1] );
					}
				};
			}
		}
	};

	function FactorList() {

		var methods = new Methods();
		methods.add(arguments[0]);

		/*Methods*/
		this.remove = methods.remove;

		this.add = function() {
			methods.add(arguments);
		};

		this.edit = function() {
			methods.edit(arguments);
		};

		/*Returns Property List*/
		this.__defineGetter__('look', function(){
			var retObj = {};
			Object.keys(__properties).forEach(function(key){
				retObj[key] = __properties[key];
			});
			return retObj;
		});
	};

	return new FactorList(arguments)
});

// /*Methods of Initilizing*/
// console.log('Methods of Initilizing');
// var list = new FactorList(['Joe',1]);
// var list2 = new FactorList(['Joe',1],['Mike',0.5]);
// 	console.log('list1', list.look);
// 	console.log('list2', list2.look);

// // // Methods of Edition
// console.log('Methods of Edition');
// list.edit(['Joe',0.4]);
// list2.edit(['Joe',0.4]);
// 	console.log('list1', list.look);
// 	console.log('list2', list2.look);

// // Methods of Deletion
// console.log('Methods of Deletion');
// list2.remove(['Joe']);
// list.remove('Joe');
// 	console.log('list2', list2.look);
// 	console.log('list1', list.look);

// // //	Methods of Creation
// console.log('Methods of Creation');
// list.add(['Dylan',0.4],['Mike',0.4]);
// 	console.log('list1', list.look);
