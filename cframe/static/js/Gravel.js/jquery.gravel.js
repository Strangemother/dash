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
	} else {
		// if ia is just a value
		if(_a[ia]) v = _a[ia];
	}

	if( (v == null) && (def != undefined) ) {
		v = def
	}

	if(returnArray){
		return [v, ia[i]]
	}
	else {
		return v
	}

}
/*
Gravel is a google style popup designed to
look a lot like a Google style popup.
 */

(function($){

	var opts = null
	//Defaults:
	var defaults = {
		onComplete: function(){ console.log('complete') },

		/*
		The name used for the data object.
		 */
		dataName: 'gravel',
		/*
		The default title for the popup. This can be overridden

		 */
		title: 'ooh HAI!',
		/*
		Default data for the popup
		 */
		text: 'This popup is on Gravel',
		/*
		ID of the popup. This will be applied only when required. It's best
		not to rely on this for asset use.
		 */
		id: 'gStyle_popup',

		// reveal() show animation method.
		animation: 'fade',

		/*
		default classes for to the HTML object. You should use these
		for asset use.
		 */
		classes: 'reveal-modal gravel-popup',

		/*
		Class applied to the title when created.
		 */

		titleClasses: 'title',
		/*
		Classes applied to the main text data when the popup is created.
		 */
		textClasses: 'information',

		/*
		Classes used for the tools bar at the bottom of the popup.
		 */

		toolsClasses: 'buttons',

		/* The selector for jQuery wrapped objects; gravel will
		pull this entity to use as a title (and remove the original)
		 */
		titleObject: 'h2.title',

		/*
		Selector for the text object.
		 */
		textObject: 'div.information',

		/*
		The method of removal for the title method within
		jQuery wrapped elements. (Standard jQuery classes)
		 */
		titleRemovalMethod: 'hide', // remove

		/*
		The HTML to use as a popup template if no jQuery wrapped objects exist.
		 */
		html: '<div class="%(classes)s" id="%(id)s" data-animation="%(animation)s">' +
			  '<h2 class="%(titleClasses)s">%(title)s</h2>' +
			  '<div class="%(textClasses)s">%(text)s</div>' +
			  '<div class="%(toolsClasses)s">' +
			    '<input type="button" class="close-reveal-modal" name="cancel" value="X">' +
   			    '<span class="user-defined-buttons">%(buttons)s</span>' +
   			    '<div class="clear"></div>' +
			  '</div>' +
			'</div>',
		/*
		Default buttons to apply.
		 */
		buttons: []
	};

	function getDefs() {
		if(opts) {
			return opts
		}
		return defaults
	}

	//no desc
	function Gravel(el, options) {
		this.defaults = defaults
		//Extending options:
		opts = this.opts = $.extend({}, this.defaults, options);

		this.element = el;

	}

	// Separate functionality from object creation
	Gravel.prototype = {

		init: function() {
			var _this = this;
			_this.opts = arg(arguments, 0, {})
			// this.buttons = []
			console.log(arguments)
			_this._buttons = this.opts.buttons || []
			_this._width = null;
			_this._height = 0;
			return _this
		},

		getDefs: getDefs,

		//pass a message, an optional title and options buttons and reveal a popup
		popup: function(title, text) {
			var buttons = arg(arguments, 2, [])
			var _this = this;
			return this
		},

		popupSimpleTemplate: function(){
			//$('.backup-popup-template')
			var title 	= sprintf( $(template).children('h2').text(), data);
			var text 	= sprintf( $(template).children('.data')[0].outerHTML, data);
			popup(title, text, buttonArray);

		},

		// Get and set the buttons for this popup.
		// pass a name or id to receive a single button
		buttons: function(){
			which = arg(arguments, 0, null)

			if(which) {
				for (var i = 0; i < this._buttons.length; i++) {
					var _but = this._buttons[i];
					if(_but.id() == which || _but.text() == which || _but.value == which || _but == which) {
						return _but
					}
				};

				return null;
			}

			return this._buttons
			// render Buttons
		},


		// Append a button to the collection and ready for render by normalizing
		// string inputs.
		addButtons: function(){
			var button = arg(arguments, 0, null)

			if( button instanceof Array ) {
				for (var i = 0; i < button.length; i++) {
					var _button = button[i];
					this.addButton(_button)
				};
			}else {
				this.addButton(button)
			}
		},

		_getValue: function() {
			for (var i = 0; i < arguments.length; i++) {
				var item = arguments[i];

				if(item != undefined && (item != null) ) {
					if(item instanceof Function){
						var val = item();
						if(typeof(val) == 'string'){
							return val;
						};
					}else if(typeof(item) == 'string') {
						return item;
					}
				}
			};
			return item
		},

		//returns a PopupButton
		addButton: function(){
			var button = arg(arguments, 0, null)
			var action = arg(arguments, 1, null)
			var _color = arg(arguments, 2, null)
			var _button = button;

			if(button){

				var to = typeof(button)

				var func = action || button.func || button.click || button.press || button.onClick || button.onTouch || button.action || function(){
							console.log(button + ' has no function mapping.');
							this.close();
						}

				if(to == 'string') {
					// create buttons
					_button = popButton(button, func);
					this._buttons.push(_button)

				}else if(to == 'object') {
					if(button == PopupButton) {
						// add it
						this._buttons.push(button);
						_button = button
					} else {
						// Just some sort of object. Map it anyway

						var text = this._getValue( button.text, button.value, button.name, button.id, null);
						_color = this._getValue(_color, button.color, button.background, button.type, null);
						var action = button.func || button.action || button.value || button.name || button.type || func
						var id = button.id || 'gravel_' + button.name || 'gravel_' + button.value || 'noid';
						_button = popButton(text, func, _color, id, action)
						this._buttons.push(_button)
					}
				}
			}

			_button.parent = this

			if( $(this[0]).data('visible') ) {
				// display button
				var el = $(this[0]).find('.' + opts.toolsClasses)
				// Here error Popup cannot activate :633
				el.append(_button.render());
			};

			if($(this[0]).data('visible')){
				_button.active($(this[0]).find('.buttons').find('#' + button._id)[0])
			};
			// return _button;
			return this
		},

		// Use the provided buttons and render the tools section.
		// If this.buttons.length <= 0, tools bar will hide
		renderButtons: function(){
			this._buttons = arg(arguments, 0, this._buttons)

			return this;
		},


		activateHandlers: function(){
			for (var i = 0; i < this._buttons.length; i++) {
				var button = this._buttons[i];
				// pass the element to the button.
				button.parent = this

				button.active($(this[0]).find('.buttons').find('#' + button._id)[0])
			};
		},

		// function to apply when the popup has finished its open
		// animation
		openHandler: function(){
			this.onOpen()
		},

		//public closeHandler:
		onClose: function() {
			console.log("popup has closed")
		},

		onOpen: function(){
			console.log("Popup has opened")
		},

		_closeHandler: function(){
			// remove buttons

			// remove handlers
			$(this[0]).unbind()
			// remove html
			$(this[0]).remove()
			delete this[0]
			delete this.element;

			for (var i = 0; i < this.buttons.length; i++) {
				var button = this.buttons[i];
				button[0].unbind()
				delete button[0];
				delete button._handlers;

			};

			this.onClose()
		},

		// apply and or return the HTML used as a template.
		html: function(){

			opts.buttons = '';
			for (var i = 0; i < this._buttons.length; i++) {
				var button = this._buttons[i];
				var render = button.render()
				opts.buttons += render;
				// give an id to use so this element can be
				// used later.
				//
				console.log(button, render)
			};

			var _html = arg(arguments, 0, opts.html)
			return _html;
		},

		id: function(){
			//debugger;
			var _id = arg(arguments, 0, opts.id);
			if(_id != opts.id) {
				$('#' + opts.id).attr('id', _id)
				opts.id= _id;
			}
			return opts.id;
		},
		// Get return the title. This will also actively set the
		// current popup's title.
		title: function(){
			var _title = arg(arguments, 0, null);
			if(_title) {
				this._title = _title
			}else {
				_title = this._title;

				if(_title == undefined) {
					_title = this[0].find(opts.titleObject).html()
				}
			}

			return this[0].find(opts.titleObject).html(_title).html()

		},

		center: function(){
			var a = arguments;
			// First arg is passed as width or real width of object as default
			// width is them applied and returned
			var width = arg(a, 0, parseInt( this.width()) )
			var height = parseInt( this.height( this[0].css('height')) );
			console.log(height)
			var marginTop = parseInt( this.height( this[0].css('margin-top') ) );
			var padding = parseInt( this[0].css('padding-left') )
			var mLeft = width * -.5;
			var mTop = marginTop * -.5; 
			var animate = arg(a, 1, true);
 			if(animate) {	
				this[0].css('height', height);

				this[0].animate( {
					width: width,
					//height: height,
					marginLeft: mLeft-padding,
					marginTop: mTop
				}, 'slow')
				return true;
			}
			this[0].css('width', width);
			this[0].css('height', height);
			this[0].css('margin-left', mLeft - padding);
			this[0].css('margin-top', mTop);
		},



		height: function(){
			this._height = arg(arguments, 0, this._height);
			this[0].css('height', this._height);
			return this._height;
		},

		width: function() {
			this._width = arg(arguments, 0, this._width)
			this[0].css('width', this._width);
			if(this._width == null) {
				return  this[0].css('width');
			}
			return this._width;
		},

		// Set return the main information from the popup.
		text: function(){
			var _text = arg(arguments, 0, null);
			if(_text) {
				this._text = _text;
			} else {
				_text = this._text;
				if(_text == undefined) {
					_text = this[0].find(opts.textObject).html()
				}
			}

			return this[0].find(opts.textObject).html(_text).html()
		},

		renderedHtml: function(){
			return sprintf(this.html(), opts);
		}
	};

	// The actual plugin
	$.fn.gravel = function(options) {

		var title = defaults.title;
		var text = defaults.text;
		var _buts = arg(arguments, 2, defaults.buttons);


		var html = arg(arguments, 3, defaults.html);

		var perform = true;
		if(this.length <= 0) {
			perform = false;
		}

		if(!options) {
			// The popup has been applied using defaults.
			// (probably wrapping an element to use
			// as popup data.
			options = []
		}

		if(options.length == 2 && this.length == 0) {
			if(options[0] == 'gravel') {
				//use custom HTML
				//console.log("Custom button")
				perform = true
				// map the passed arguments to the options
				options = options[1]

			}
		}else if(this.length == 1 && typeof(options) == 'string') {
			options = [options]
		}else if(this.length == 1 && typeof(options) == 'object') {
			// jquery wrapped element with a title in the options.
			perform = true;
			title = options[0]
		}


		var els = []
		if(perform == true && this.length == 0) {
			els = $(defaults.html)
		}else {
			for (var i = this.length - 1; i >= 0; i--) {
				var el = this[i];
				els.push(el)
			};
		}

		if(perform) {
			revs = []
			$(els).each(function(i, e) {


				var rev = new Gravel(this, opts);

				// Do smart things with the arguments.
				switch(options.length) {
					case 0:
						// no options given

						// get the title (if exists)
						// from the wrapped object.
						var _title = $(this).find(opts.titleObject).html() || title

						if(_title != title) {

							title = _title;
						}

						text = $(this)[0].outerHTML;

						break;

					case 1:
						if(typeof(options) == 'string') {
							// just the title
							title = options
						} else {
							title = options[0]
						}
						text = $(this)[0].outerHTML;
						break;

					case 2:
						title = options[0]
						text = options [1]
						break;
				}


				// perform the reveal
				rev.init(options);

				opts.title = title;
				opts.text = text;


				if($('#' + opts.id).length > 0) {
					// remove old html
					// add new HTML
					$('#' + opts.id).remove()
				}

				// Append this popup to the html


				if(_buts.length <= 0) {
					$('#' + opts.id + ' .' + opts.toolsClasses).hide()
				} else {
					for (var i = 0; i < _buts.length; i++) {
						var button = _buts[i]
						rev.addButton(button)
					};
				}

				var html = rev.renderedHtml();
				$('body').append(html)
				//$('#' + defaults.id).hide()
				rev[0] = $('#' + opts.id)

				$(rev[0]).bind('reveal:lock', function(e){
					//rev.openHandler(e)
				})

				// open  action shim.
				$(rev[0]).bind('reveal:unlock', function(e){
					// activate the open handler
					rev.openHandler(e)
					// Remove this redundant handler to clear memory
					$(rev[0]).unbind('reveal:unlock');
					// activate the handlers
					rev.activateHandlers()
				})

				rev[0].reveal({
					animation: 'fadeAndPop', // fade, fadeAndPop, none
					animationSpeed: 300,
					closeonbackgroundclick: true
				});

				// Close action. Re-apply the unlock feature.
				$(rev[0]).bind('reveal:unlock', function(e){
					rev._closeHandler(e);
				})

				rev[0].data('visible', true)
				rev[0].data(opts.dataName, rev);

				//
				$('#' + opts.id + ' .' + opts.textClasses + ' ' + opts.titleObject).hide();

				revs.push(rev)

			});

		return revs
		}
	};

	$.fn.gravel.prototype.defaults = defaults;
	$.fn.gravel.prototype.getDefs = getDefs;
})(jQuery);

// hotwire for an easy popup wrapper
gravel = function(){
	jQuery.fn.gravel([
						'gravel',
						arguments
					])
	var d = jQuery('#' + jQuery.fn.gravel.prototype.getDefs().id)
			.data(jQuery.fn.gravel.prototype.getDefs().dataName)
	return d;
}

// --------------------------------------------


PopupButton = function(){

	var __id = '<zz><'
	var DEFAULT_COLOR = '#CCC'
	var FUNCTION = (function(){ return __id; }); // No reason!
	var self = this;

	this.init = function(){
	    var a = arguments
		this._text = arg(a, 0, 'Press');
	    this._id = 'button_' + this._text;
	    this._func = arg(a, 1, FUNCTION); //Do nothing
	    //debugger;
		this._color = arg(a, 2, null) // Sorta grey

		// The parent object (probably gravel)
		this.parent = arg(a, 3, null)

		// hooks for clicks and what not onHandlers.
		this.hooks  = {
						'click': [function(e){
							self._func(e, 'click')
						}]
					}

		if(this._color == null) {
			// Some color sensative words?
			var colorMap = {
				'cancel': 	'#800000', //	['no', 'cancel', 'false'],
				'close': 	'#800000',
				'okay': 	'#4F8335'  //	['okay', 'yes', 'ok', 'true'],
			}

			for(var name in colorMap) {
				if(this._text) {
					if(name == this._text.toLowerCase()) {
						console.log('color', colorMap[name])
						this._color = colorMap[name]
					}
				}

				if(this._color == null) {
					this._color = '#CCC'
				}
			}

		    this._id 		= arg(a, 3, "button_" + this.text());
		    this._action 	= arg(a, 4, 'button')
			this._position 	= arg(a, 5, 'left') //default left
			this.handlers 	= {}
			this.hooks 		= {}

	   }
	   return self
	}

	this.active = function(){
		/* When the popup is called at requested for the view */
		if(this.parent) {
			var container = this.parent.opts.toolsClasses || this.parent.defaults.toolsClasses
			var _but = $(this.parent[0]).find('.' + container).find('#' + this._id)[0]
		}
		var elem = arg(arguments, 0, _but);

		if(elem && this[0] == undefined) {
			this[0] = elem;
		}

		if(this[0]){
			var _el = this
			// handler can active
			console.log("Activate!!!", elem)

			$(elem).click(function(e){
				$(_el[0]).trigger('reveal:' + this._id)
				// activate the button click.
				console.log('click handler')
				_el.activateHandler('click')

				if(_el.func()) {
					_el.func().apply(_el)
				}
			})

		}else {
			console.error("PopupButton(" + this.text() + ").active() cannot be called until the html has been rendered by the parent")
		}

		this.colorText()
	}

	this.registerHandler = function() {
	    var a = arguments
		var name = arg(a, 0, 'click');
		var func = arg(a, 1, null)

		if(func){
			if( !this.handlers[name]) {
				this.handlers[name] = []
			}
			this.handlers[name].append(func)
		}
	}

	this.activateHandler = function(){
	    var a = arguments

		var name = arg(a, 0, '*');

		for(var hook in this.hooks) {

			if(hook == name) {
				for(var i=0; i < this.hooks[hook].length; i++) {
					 var func = this.hooks[hook][i];

					 func.call(self, name)
				}
			}
		}

		if(this.hooks['*']) {
    		for(var i=0; i< this.hooks['*'].length; i++){
    			var func = this.hooks[hook][i].apply(self, name)
    		}
		}
	}

	this.id = function(){
	   return this._id  = arg(arguments, 0, this._id)
	}

	this.text = function(){
		this._text = arg(arguments, 0, this._text)

		$(this[0]).val(this._text)

	    if(arguments[0]) {
	    	return this
	    }

	    return this._text

	}

	this.action = function(){
	    // Map an action to this button.
	    // Currently a button as standard or:
	    // pass action('cancel') for an automated close button
	    this._action = arg(arguments, 0, this._action)

	    if(arguments[0]) {
	    	return this
	    }

	    return this._action
	}

	this.func = function(){
	    this._func = arg(arguments, 0, this._func)

	    if(arguments[0]) {
	    	return this
	    }



	    return this._func
	}

	this.closePopup = function() {
	    return $('.close-reveal-modal').click();
	}

	this.close = function(){
		// This is some nice sugar giving the method
		// this.close() within a button function to close
		// the popup
		this.activateHandler('close')
		this.closePopup.apply(self, arguments)
	}

	this.click = function(ev){
		/*
		 * button click handler. you can pass this directly to a
		 * click handler
		 */
        if(self.action() == 'close' || self.text() == 'close') {
            return self.closePopup()
        } else {
            return self._func(ev)
        }
	}

	this.isButton = function(){
		return true;
	}

	this.position = function() {
		// pass and/or return the positional value.
		// left / right. default == left.
		var a = arguments
		return self._position = arg(a, 0, self._position)
	}

	this.htmlTemplate = function(){
		var parent = arg(arguments, 0, null)
		var buttonTemplate = "<input type='button' id='%(id)s' name='%(name)s' class='mini-button %(color)s' style='background-color: %(color)s;' value='%(text)s'>"
        return buttonTemplate;
	}

	this.renderObject = function() {
		var _color = this.color();
		// color = color
		cssStyles = self.getContrastYIQ() + '_text'
		pos = self.position() + '_pos'
		return {'name': self.text(),
			'cssStyles': cssStyles,
           'id': self.id(),
           'text': self.text(),
           'color': _color,
           'position': "position_" + self.position()
           }
	}

	this.render = function(){
		// return the html of the button templated with associated
		// data.
		var parent = arg(arguments, 0, null)
		var html = arg(arguments, 1,
						sprintf(this.htmlTemplate(parent), this.renderObject())
					)
       	return html;
	}

	this.renderTo = function(){
		var parent = arg(arguments, 0, this.parent)

		// Append this button into the passed container
		var a = arguments;
		var parent = arg(a, 0, '')

		if(parent != '' && parent != null && parent != undefined) {
			var render = self.render(parent)
			$(parent).append(render)
		}

		//activate click handlers

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


	// Correct color button text.
	this.colorText = function(){
		var _color = arg(arguments, 0, this.color())
		var c = this.getContrastYIQ(_color)
		if(c == 'dark') {
			$(this[0]).addClass('dark').removeClass('light')
		}else{
			$(this[0]).addClass('light').removeClass('dark')
		}
		return this;
	}

	this.lightContrast = function(){
		var color = arg(a, 0, DEFAULT_COLOR);
		var contrast = this.getContrastYIQ(this.convertColor(color))
		if(contrast == 'light') {
			return true;
		}
		return false;
	}

	this.darkContrast = function(){
		return !self.lightContrast.apply(self, arguments)
	}

	this.convertColor = function() {
		var a = arguments;
		// Convert a color to another representation of the same color

		// Which color to use. By default it's the button color
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
	}

	this.hexToRGB = function(hex){
		// pass a hex value a receive an array of 3 values [R, G, B]
		if (hex[0]=="#") hex=hex.substr(1);
		if (hex.length==3) {
			var temp=hex; hex='';
			temp = /^([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])$/i.exec(temp).slice(1);
		    for (var i=0;i<3;i++) hex+=temp[i]+temp[i];
		 }
		 var triplets = /^([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})$/i.exec(hex).slice(1);
		 return [ parseInt(triplets[0],16),
			 	parseInt(triplets[1],16),
			 	parseInt(triplets[2],16)
		 	]
	}


	this.color = function(){
		var _color = arg(arguments, 0, this._color);
		this._color = _color;

		if(arguments[0]) {
			$(this[0]).css('background-color', _color)
			this.colorText(_color)
		}

		if(arguments[0]) {
			return this
		}

		return this._color;
	}

    return this.init.apply(this, arguments)
}

/** Help util for the class **/
/*
 * popButton(name, func, color, action)
 */
popButton = function() {
	var a = arguments;
	// Button text. E.g. 'okay'
	var name = arg(a, 0, '');
	// Method to call
	var func = arg(a, 1, function(){});
	// Button color
	var color = arg(a, 2, null);
	// 'button' as default - 'close' as a close popup button.
	var action = arg(a, 3, 'button');
	// Create id (allow class to do it)
	var id = null;

	var b = new PopupButton(name, func, color, id, action);
	return b;
}


/*
	Examples.
	$(['message']).gravel()
	$(['title', 'message']).gravel()
	$(['title', 'message', buttonsArray ]).gravel()
	$(['title', 'message', button, button, button ]).gravel()
	$('.popupTemplate').gravel()
	$('.popupTemplate').gravel('title')
	$('.popupTemplate').gravel(['title'])
	$('.popupTemplate').gravel(['message', 'title'])
	$('.popupTemplate').gravel(['message', 'title', buttonsArray])
	# $('.popupTemplate').gravel(['message', 'title', button, button, button])
 */
