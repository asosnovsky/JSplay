//-----------------------------------------
//	I am defining the variable "death"
//	as a "scope", which basically means
//	it is, its own independent environment.
//	
//	All the variables/functions/operators etc 
//	defined inside the scope
//	will only be visible by the functions inside
//	it.
//	
//-----------------------------------------
var death = (function () {
	//-----------------------------------------
	//	Defining some local variables to
	//	the scope
	//-----------------------------------------
	var _Sx = [0,100];//	Support Set
	var __cdf_memo = {};//	A caching memo for the cdf (this is needed for making the cdf calculations be faster)
	var _inc = 1;//	The increment

	function distribution() {}//	Defining a 'Class' called distribution

	/**
	 * Probability Mass Function
	 * 
	 * @param  {Number} x 
	 * 
	 */
	distribution.prototype.pmf = function (x) {
		return 1/(_Sx[1] - _Sx[0]);//	Uniform distribution (think about it ;) )
	};

	/**
	 * Cumulative Distribution Function
	 * 
	 * @param  {Number} x 
	 * 
	 */
	distribution.prototype.cdf = function(x) {
		var value;//	This will be the return value

		x = Math.round(x * (1/_inc)) * _inc;//	Rounding to nearest increment

		//-----------------------------------------
		//	if (value already exists and stored in _cdf_memo)
		//		then return that value
		//	else
		//-----------------------------------------
		if(x in __cdf_memo){

			value = __cdf_memo[n];

		}else{

			//-----------------------------------------
			//	if(x in our support set)
			//		then cdf(x-inc)+pmf(x)
			//	else
			//-----------------------------------------
			if( x > _Sx[0] && x < _Sx[1]){

				value = this.pmf(x) + this.cdf(x-_inc);	

			}else{

				//-----------------------------------------
				//	if(x is outside the set)
				//		then return 1 or zero
				//-----------------------------------------
				if(x <= _Sx[0]) value = 0;
				if(x >= _Sx[1]) value = 1;

			}
		}

		//-----------------------------------------
		//	return value;
		//-----------------------------------------
		return value;
	};

	/**
	 * Decumulative Distribution Function
	 * 
	 * @param  {Number} x
	 * 
	 */
	distribution.prototype.ddf = function(x) {
		return 1 - this.cdf(x);
	};

	/**
	 * Hazard Function (force of mortality)
	 * 
	 * @param  {Number} x
	 * 
	 */
	distribution.prototype.hazard = function(x) {
		var lnSX = Math.log(this.ddf(x));
		var lnSXh = Math.log(this.ddf(x + _inc));
		var hazard = - (lnSXh - lnSX)/_inc;

		if(isNaN(hazard)){
			hazard = - Math.log(0);
		}

		return hazard;
	};

	/**
	 * Change pmf
	 * 
	 * @param  {Function} pmf 
	 * 
	 * @param  {Array} Sx
	 * 
	 */
	distribution.prototype.changePMF = function(pmf, Sx) {
		//-----------------------------------------
		//	If (no support is defined)
		//		then set [0, infinity] the support
		//-----------------------------------------
		if(arguments.length === 1 ) {
			var Sx = [0,-Math.log(0)]; 
			console.log('No support, default support is :' , Sx);
		}


		_Sx = Sx;//	 Define global support set

		this.pmf = pmf;//	Define pmf

	};

	/**
	 * Shows an object with some basics
	 * 
	 * @return {Object} {SupportSet, Increment}
	 * 
	 */
	distribution.prototype.checkbasics = function() {
		return {
			SupportSet: _Sx,
			Increment: _inc
		}
	};

	return new distribution();
})();


//-----------------------------------------
//	Actual Work
//-----------------------------------------

death.pmf(100); //returns 0.01
death.pmf(50); //returns 0.01
death.pmf(0); //returns 0.01

death.cdf(100);	//returns 1
death.cdf(60);	//returns 0.60
death.cdf(0);	//returns 0

death.ddf(100);	//returns 0
death.ddf(60);	//returns 0.40
death.ddf(0);	//returns 1


//-----------------------------------------
//	This is where it gets weird...
//-----------------------------------------
death.hazard(100); //returns Infinity
death.hazard(60); //returns 0.0253178
death.hazard(0); //returns 0.01005033585350145

//-----------------------------------------
//	This is where it gets more odd
//-----------------------------------------

death.changePMF(function(x){
	return Math.exp(-x)
});// So I basically changes the pmf to e^(-x), the support will become [0, infinity]

death.hazard(1);	//returns 0.2409222419175417
death.hazard(10);	//returns 0.000039952268439114036
death.hazard(100);	//returns 0

//	bahh? 
//	does this have to do because I am moving from a discrete case
//	to a continuous one?

