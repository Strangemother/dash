

/*
 * A little help function for when I'm creating functions
 *
 * When I pluck values from function arguments I tend to
 * write content of this function repeatedly.
 *
 * e.g.
 * a = arguments
 * this.id = arg(a, 0)
 * this.name = arg(a, 3)
 *
 * this.id == 6
 * this.name == null
 */
function arg(_a, ia, def, returnArray) {
	var v = null

	// if ia is an array, find the
	// first correct definition
	if (ia.constructor  == Array) {
		/*
		 * Each item is checked. if the
		 * item in the array is
		 * a definition within the oaet
		 * arguments or object - pass it
		 */
		for(var i=0; i<ia.length; i++) {
			if(_a[ia[i]]){

				 v = _a[ia[i]];
				break;
			}
		}
	}
	else {
		// if ia is just a value
		if(_a[ia]) v = _a[ia];
	}

	if( (v == null) && (def != undefined) ) {
		v = def
	}

	if(returnArray){
		return [v, ia[i]]
	}
	else
	{
		return v
	}

}


Color = (function() {
	var self = {}
	var scope = function(){

		this.init = function(){
			this._color = arg(arguments, 0, '#FFF')
			return self;
		}

		this.color = function(){
			var a1 = arg(arguments, 0, null)
			if(a1 == null) return this._color;
			this._color = a1;
			return this;
		}

		this.getContrastYIQ = function(){
			var a = arguments;
			var color = arg(a, 0, this.color());
			var hexcolor = this.convertColor(color, 'rgb')

			var r = hexcolor[0];
			var g = hexcolor[1];
			var b = hexcolor[2];


			var yiq = ((r*299)+(g*587)+(b*114))/1000;

			return (yiq >= 128) ? 'dark' : 'light';
		}

		this.lightContrast = function(){
			var a = arguments;
			var color = arg(a, 0, self.color());
			var contrast = this.getContrastYIQ(this.convertColor(color))

			if(contrast == 'light') {
				return true;
			}
			return false;
		}

		this.darkContrast = function(){
			return !self.lightContrast.apply(self, arguments)
		}

		// convert hex to rgb.
		this.convertColor = function() {
			var a = arguments;
			// Convert a color to another representation of the same color

			// Which color to use. By default it's the color
			var color = arg(a, 0, this.color())

			// What type to return.
			// RGB,
			var returnType = arg(a, 1, 'rgb')

			if(color[0] == '#') {
				var rt = String(returnType).toLowerCase()
				if(rt == 'rgb') {
					return this.hexToRGB(color)
				}
			}
			return color;
		}

		this.hexToRGB = function(hex){
			// pass a hex value a receive an array of 3 values [R, G, B]
			if (hex[0]=="#") hex=hex.substr(1);
			if (hex.length==3) {
				var temp=hex; hex='';
				temp = /^([a-f0-9])([a-f0-9])([a-f0-9])$/i.exec(temp).slice(1);
			    for (var i=0;i<3;i++) hex+=temp[i]+temp[i];
			 }
			 var triplets = /^([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})$/i.exec(hex).slice(1);
			 return [ parseInt(triplets[0],16),
				 	parseInt(triplets[1],16),
				 	parseInt(triplets[2],16)
			 	]
		}

		return this.init.apply(this, arguments)
	}

	return (scope).apply(self, arguments)
})()