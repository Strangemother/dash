/*
HTML:

<div class="popup_template">
    <div class="button_template" style='display: none'>
    	<input type='button'
    	name='%(name)s'	class='mini-button %(name)s %(cssStyles)s' id='%(id)s' style='background-color: %(color)s' value='%(text)s'/>
    </div>
    <div class="message_template" style='display: none'>
    	<div class="new_camera">
    		<h2 class="title">Add a new  camera</h2>
    		<div class="info">You're about to add a new camera to abacus. Well done.</div>
    	</div>
    </div>
	<div id='popup' class="reveal-modal popup" data-animation='fade'>
		<h2 class='title'>Popup Title</h2>
		<div class="info">This is a popup. Designed to display information to you quickly.</div>
		<div class="buttons">
			<input type='button' class='close-reveal-modal' name='cancel' value='X'/>
			<input type='button' name='okay' class='mini-button blue' value='Okay' />
			<input type='button' name='cancel' class='mini-button red' value='Cancel' />
			<input type='button' name='accept' class='mini-button green' value='Accept'/>
			<input type='button' name='lovely' class='mini-button purple' value='lovely'/>
			<input type='button' name='waiting' class='mini-button orange' value='Waiting'/>
			<input type='button' name='great' class='mini-button yellow' value='Great!'/>
        </div>
	</div>
</div>

JS:

a = new PopupButton('hi', function(){ console.log("hi"); })
b = new PopupButton('close')
b.color('#eee')
g = popButton('send', function(){ console.log('send'); }, '#555')
popup('title', 'message', [a,b,g])




 */
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


PopupButton = function(){

	var __id = '<zz><'
	var DEFAULT_COLOR = '#CCC'
	var FUNCTION = (function(){ return __id; }); // No reason!
	var self = this;

	this.init = function(){
	    var a = arguments
		this._text = arg(a, 0, 'Press');
	    this._func = arg(a, 1, FUNCTION); //Do nothing

	    this._color = arg(a, 2, null) // Sorta grey

	    if(this._color == null) {
			// Some color sensative words?
			var colorMap = {
				'cancel': 	'#800000', //	['no', 'cancel', 'false'],
				'close': 	'#800000',
				'okay': 	'blue'  //	['okay', 'yes', 'ok', 'true'],
			}

			for(var name in colorMap) {
				if(name == this._text.toLowerCase()) {
					console.log('color', colorMap[name])
					this._color = colorMap[name]
				}
			}
			if(this._color == null) {
				this._color = '#CCC'
			}
		}

	    this._id = arg(a, 3, "button_" + this.text());
	    this._action = arg(a, 4, 'button')
		this._position = arg(a, 5, 'left') //default left
		this.handlers = {}
		this.hooks = {}


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

	this.active = function(func){
		/* When the popup is called at requested for the view */
		this.registerHandler('active', func)
	}

	this.registerHandler = function() {
	    var a = arguments
		var name = arg(a, 0, '*');
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

		console.log("activating handler", name)

		for(var hook in this.hooks) {
			if(hook == name) {
				for(var i=0; i<this.hooks[hook].length; i++) {
					 var func = this.hooks[hook][i].apply(self, name)
				}
			}
		}

		if(this.hooks['*']) {
    		for(var i=0; i<this.hooks['*'].length; i++){
    			var func = this.hooks[hook][i].apply(self, name)
    		}
		}
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

	this.action = function(){
	    // Map an action to this button.
	    // Currently a button as standard or:
	    // pass action('cancel') for an automated close button
	    return this._action = arg(arguments, 0, this._action)
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
			temp = /^([a-f0-9])([a-f0-9])([a-f0-9])$/i.exec(temp).slice(1);
		    for (var i=0;i<3;i++) hex+=temp[i]+temp[i];
		 }
		 var triplets = /^([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})$/i.exec(hex).slice(1);
		 return [ parseInt(triplets[0],16),
			 	parseInt(triplets[1],16),
			 	parseInt(triplets[2],16)
		 	]
	}

	this.id = function(){
	   return this._id  = arg(arguments, 0, this._id)
	}

	this.text = function(){
	    return this._text = arg(arguments, 0, this._text)
	}

	this.color= function(){
		return this._color = arg(arguments, 0, this._color)
	}

	this.func = function(){
	    return this._func = arg(arguments, 0, this._func)
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

	this.htmlTemplate = function(parent){
		var buttonTemplate = $('.popup_template')
          .find('.button_template')
          .children('input[type="button"]')[0]
        return buttonTemplate.outerHTML;
	}

	this.renderObject = function() {
		var color = this.color();
		color = color
		cssStyles = self.getContrastYIQ() + '_text'
		pos = self.position() + '_pos'
		return {'name': self.text(),
			'cssStyles': cssStyles,
           'id': self.id(),
           'text': self.text(),
           'color': color,
           'position': "position_" + self.position()
           }
	}

	this.render = function(parent){
		// return the html of the button templated with associated
		// data.
       var html = sprintf(this.htmlTemplate(parent), this.renderObject())
       return html

       sel
	}

	this.renderTo = function(){
		// Append this button into the passed container
		var a = arguments;
		var parent = arg(a, 0, '')
		if(parent != '') {
			var render = self.render(parent)
			$(parent).append(render)
		}

		//activate click handlers

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
	var color = arg(a, 2, '#CCC');
	// 'button' as default - 'close' as a close popup button.
	var action = arg(a, 3, 'button');
	// Create id (allow class to do it)
	var id = null;

	var b = new PopupButton(name, func, color, id, action);
	return b;
}

/*
 * Passing a button array:
 *  There are two methods of button setup.
 *
 *  First - you have a canned set of buttons (branded and colored in the
 *     html template) by giving an array of arrays containing values
 *  css class name and click function
 *  [
 *      ['class-name', function(){}],
 *      ['okay', function(){}],
 *      ['accept', function(){}]
 *  ]
 *
 * The only example you'll need for closing the popup
 *
 *  ['okay', function(ev){
 *       $('.close-reveal-modal').click()
 *  }]
 *
 *  Or an array of PopupButtons:
 *
 *  button = new PopupButton('okay', function(){}, '#CCC')
 *  //...
 *
 *  Then you can pass an array of button objects.
 *  [button, otherPopupButton, etc... ]
 *
 *
 */
popupTemplated = function() {
	var a = arguments;
	var _parentDefault = '.popup_template'
	//selector / jquery object
	var template = arg(a, 0, '.message_template')
	var buttonArray = arg(a, 1, [])

    var parent = arg(a, 2, _parentDefault)

	var title = arg(a, 3, 'title')
	var text = arg(a, 4, '')
	var argData = arg(a, 5, {})

	if(parent instanceof jQuery) {
                    // is a parent.
    } else {
        // it could be an ovject
        if(typeof(parent) == 'object') {
            argData  = parent;
            parent = _parentDefault;
        }
    }

	if(template instanceof jQuery) {
		title = template.find('h2.title').html();
		text = template.find('.info').html();
	} else {
		title = $(template).find('h2.title').html();
		var data = $(template).find('.info');
		// check for repeatable type and field type

		//loop
		$(data).each(function(i,e){
            var _type = $(data).data('type') || ''

            if(_type == 'text') {
                text += data.html()

            } else if(_type == 'repeatable') {
                // need some sort of itterable data?
                var _field = $(data).data('field');
                if(_field) {
                    // do something
                    // check the data
                    if (_field in argData) {
                        // check if the field is itterable.
                        // else use the object on 1
                        // Check for data field 'count' == loop that
                        var d = argData[_field]
                        var dataLength = d.length || 1
                        var count = $(data).data('count') || dataLength;

                        if($.isArray(d)) {

                        } else {
                            //try templating once with a single object
                            d = [d]
                            count = 1;
                        }

                        for (var i=0; i < count; i++) {
                          $(data.data('context', d[i]))
                          var templatedHTML = sprintf(data[0].outerHTML, d[i]);
                          text += templatedHTML;

                        };


                    } else {
                        try {
                            console.warn('Could not find required data field "' + _field + '"')
                        } catch(e) {
                            //pass
                        }
                    }
                    // check field is repeatable
                    // template every node
                } else {
                    try {
                        console.warn('Repeatable field ' + $(data).attr('id') + ' required a data attribute of "field"')
                    } catch(e) {
                        //pass
                    }
                }

            }

        })

   		//.html()
	}

	return popup(title, text, buttonArray, parent)
}

popup = function() {
	var a = arguments

    var title = arg(a, 0, '')
    var text = arg(a, 1, '')
    var buttonsArray = arg(a, 2, [])
    var parent = arg(a, 3, '.popup_template')
    var titleType = typeof(title)
    var _text = text;

    if(titleType == 'object') {

        // Object has been given containing the data required.
        _text = title.text || title.question || text;
        buttonsArray = title.buttons || buttonsArray;
        title = title.name || title.title || 'Popup';
    }

    if(typeof(text) == 'object' && titleType == 'object')  {
        // Assume the user has passed the button content for the
        // second argument. Only if first arg was an object.
        buttonsArray = text || buttonsArray;
        text = _text;
    }

	var _popup = $(parent);
	_popup.find('h2.title').html(title);
	_popup.find('.info').html(text);

	$('#popup').reveal();
    var buttonContainer = $('#popup .buttons');
	var buttons = $(buttonContainer.find('.mini-button'));
	var show = [];

	for(var val in buttonsArray) {
	    // data of passed buttons
		var value = buttonsArray[val]
		var _button = null;

		try {
		    _button = $(value);
		} catch(e) {
		    // can't parse it
		}

		// If object passed is a function. Denote the passed values as:
		/*
		 * 'yes': function(){
		 *     // my actions...
		 * }
		 *
		 * Two processes will occur
		 *
		 * check for button name in existing button entites.
		 *
		 * else create a new button.
		 */

        if(typeof(value) == 'function') {
            // Probably object style def
            show.push(val, value);
        } else if(value['isButton']) {
			if(value.isButton()) {
    		        show.push(value);
    		}
    	} else if( _button.hasClass(value[0]) ) {
    		    show.push( [_button, value[1]] );
    	    } else if(_button['val'] &&
	        (_button.val().toLowerCase() == value[0].toLowerCase()) ){
	            show.push([_button, value[1]]);
        }
    }



	buttons.hide();
	if(show.length>0){

		for (var i = 0; i < show.length; i++) {
		    var obj = show[i];

		    if(obj['isButton']) {
		        if(obj.isButton()){
		           // Create a popup Button template
	               // Create better button scope
	               obj.renderTo(buttonContainer)

				   $('#' + obj.id()).die('click').live('click', obj.click);
		        }
		    }else{
		        if(typeof(obj[0]) == 'object') {
        			var el = obj[0];
        			el.data('onClick', show[i][1])
        			el.show()

        			el.die('click').click(function(ev){
        				$(this).data('onClick').apply(this, ev);
        			});
		        } else if(typeof(obj) == 'string') {
		            var name=obj;
		            var func = value;
		            var color = null;
		            var action = null;

		            var button = popButton(name, func, color, action);

                    // If this is the second button of two buttons
                    // put the last on the right
		            if(show.length == 4 && i == 2){
		                button.position("right")
		            }

		            // If second button of three, center.
		            // If third button of three, right.

		            button.renderTo('#popup .buttons')

		            $('#' + button.id()).data('onClick', func)

		            /*
		             * This isn't nice. This may override the users
		             * clicks. This should be written so the
		             * click handler is applied when the button
		             * exists (no need for live) then the click
		             * handler is add.
		             * The click handler should also be removed cleanly
		             * after popup has finished
		             */
		            $('#' + button.id()).die('click').live('click', function(ev){
                        $(this).data('onClick').apply(this, ev);
                    });
		        }
		    }
		};

	}

	return
}



function showTemplateMessage(){
	var a = arguments;
	var t = arg(a, 0, null);

	var v = '#' + t + '_template';

	if(t) t = $(v);

	var text = arg(a, 1, t.children('h2').html());
	var body = arg(a, 2, t.children('div').html());
	//console.log(text, body)
	showMessage(text, body);

}

var showMessageVisible = false;

function showMessage() {
	var a = arguments;
	var title = arg(a, 0, 'Abacus MK II');
	var data = arg(a, 1, 'Data');


	var options = {
		overlayClose: true,
		opacity:80,
		overlayCss: {backgroundColor:"#fff"},
		onOpen: function (dialog) {
			dialog.overlay.fadeIn('fast', function () {
				dialog.data.hide();
				dialog.container.fadeIn('fast', function () {
					dialog.data.fadeIn('slow');
					showMessageVisible = true;
				});
			});
		},
		onClose: function (dialog) {
			dialog.data.fadeOut('fase', function () {
				dialog.container.hide('fast', function () {
					dialog.overlay.fadeOut(300, function () {
						$.modal.close();
						showMessageVisible = false;
					});
				});
			});
		}
	};

	//if(!showMessageVisible){
    	$('#message-box .title h2').html(title);
    	$('#message-box .body').html(data);
    	$("#message-box").modal(options);
	//}
}
