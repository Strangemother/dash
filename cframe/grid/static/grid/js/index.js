$(document).ready(function(){
	gridding.createGrid(gridding.layout());
	page.appendWidgets([HelloWorldWidget, WeatherWidget]);
	$('.add-button').click(function(){
	 	$('.tools').show();

	});
	 
})
Sadie = {};
Sadie.model = {
	defaultBackgroundColor: '#fff',
	hammerTouchReceivers: [],
	spaceData: {},
	add: function(key, value) {
		/*
		Add a data key to the model =D
		*/
		return Sadie.model.spaceData[ String('default-' + key) ] = value;
	},
	get: function(key) {
		return Sadie.model.spaceData[ String('default-' + key) ];
	},
	addToSpace: function(namespace, key, value) {
		return Sadie.model.spaceData[ String(namespace + '-' + key) ] = value;
	},
	getFromSpace: function(namespace, key) {
		return Sadie.model.spaceData[ String(namespace + '-' + key) ];
	}
}

page = {};
gridding = {};
utils = {}
Sadie.page=page;
Sadie.gridding=gridding;

page.backgroundColor = function(){
	var col = arg(arguments, 0, Sadie.model.defaultBackgroundColor);
	$('body').css('background-color', col);
}

page.appendWidgets = function() {
	var widgets = arg(arguments, 0, []);
	for(var i=0; i < widgets.length; i++) {
		page.appendWidget(widgets[i])
	}
}

page.appendWidget = function() {
	var widgetData = arg(arguments, 0, null);

	if(widgetData == null) {
		return false;
	}

	page.createInterfaceButton(widgetData)
	return true;
}

page.fullalert = function(){
	var largeText = arg(arguments, 0, 'Important');
	var smallText = arg(arguments, 1, 'An important notice has taken place.');
	var icon = arg(arguments, 2, 'caution.svg');;
	var highlightColor = arg(arguments, 3, '#800000');
	var lowlightColor = arg(arguments, 4, '#333333');

	var colors=Color.convertColor(lowlightColor)
	
	var pc = sprintf('rgba(%s,%s,%s, %s)', colors[0], colors[1], colors[2], .2 )

	page.backgroundColor(pc)
	/*
	Method called when the alert opens
	 */
	var openHandler = arg(arguments, 5, function(){});

	/*
	Activates when the user closes the message.
	Return false to stop the message from closing, else true will
	allow the popup api to continue
	 */
	var closeHandler = arg(arguments, 6, function(){ return true; });
	var id = arg(arguments, 7, utils.randomId());
	$('body').uiji('div.fullalert{id=' + id + '}', function(){
		
		$(this).uiji('img{src=/static/img/icons/' + icon + '}', function(){
			$(this).fadeIn()
		});

		$(this).uiji('h1.large"' + largeText + '"');
		$(this).uiji('p.large"' + smallText + '"', function(){
			$(this).fadeIn('slow')
		});

		openHandler(this)

		$(this).click(function(e){
			
			var closeVal = closeHandler(e);
			if(closeVal === true) {
				page.backgroundColor()
				$('.fullalert#' + id).fadeOut('fast', function(){
					$(this).remove()
				});
			} else {
				console.log('User cannot close this popup as closeHandler for ' + id +' returned', closeVal)
			}
		})

	})
	/*
	Show a large page alert
	 */
}

page.createTouchHandlers = function(parent){

    //parent.hammer.ondragstart = function(ev) {
    //	page.touchHandler.call(parent, ev);
    //};
	//parent.hammer.ondrag = function(ev) {
	//	page.touchHandler.call(parent, ev);
	//};
	//parent.hammer.ondragend = function(ev) {
	//	page.touchHandler.call(parent, ev);
	//};
	parent.hammer.onswipe = function(ev) {
		page.touchHandler.call(parent, ev);
	};
	parent.hammer.ontap = function(ev) {
		page.touchHandler.call(parent, ev);
	};
	parent.hammer.ondoubletap = function(ev) {
		page.touchHandler.call(parent, ev);
	};
	parent.hammer.onhold = function(ev) {
		page.touchHandler.call(parent, ev);
	};
	parent.hammer.ontransformstart = function(ev) {
		page.touchHandler.call(parent, ev);
	};
	parent.hammer.ontransform = function(ev) {
		page.touchHandler.call(parent, ev);
	};
	parent.hammer.ontransformend = function(ev) {
		page.touchHandler.call(parent, ev);
	};
	parent.hammer.onrelease = function(ev) {
		page.touchHandler.call(parent, ev);
	};
}

// Give this method a function (from context of a widget)
// and it will recieve all the parent.hammer events
page.addEventReceiver = function(func) {

	this.hammer = new Hammer(this.element[0]);
	page.createTouchHandlers(this);
	Sadie.model.hammerTouchReceivers.push(func)
}


page.removeEventReceiver = function(func) {
	// pas a function with the same sig and it'll be removed from
	// the stack
	for (var i = Sadie.model.hammerTouchReceivers.length - 1; i >= 0; i--) {
		//Call the hooked function.
		if(Sadie.model.hammerTouchReceivers[i] == func) {
			Sadie.model.hammerTouchReceivers[i] = null;
		}
	};
}


/* has scope of the widget self */
page.touchHandler = function(ev) {
	// console.log(ev.type);
	for (var i = Sadie.model.hammerTouchReceivers.length - 1; i >= 0; i--) {
		//Call the hooked function.
		var func = Sadie.model.hammerTouchReceivers[i];
		if( func ) {
			func.call(this, ev);
		}
	};
}



page.createInterfaceButton = function(){
	var widgetData = arg(arguments, 0, null);

	// <li><a href='javascript:;' id='createWeatherWidget'>Weather</a></li>
	$('div.tools ul').uiji('li', function(){
		$(this).uiji('a{href=javascript:;}.interface-button"' + widgetData.name  + '"', function(){
			$(this).click(function(){
				gridding.addWidget(widgetData);
			})
		})
	})
}

utils.randomId = function() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length)); 
    return text;
}

gridding.createGrid = function(serializeParams){
	$(".gridster ul").gridster({
        widget_margins: [10, 10],
        widget_base_dimensions: [200, 200],
        serialize_params: serializeParams
    });
    gridding.grid = $(".gridster ul").gridster().data('gridster');
}

gridding.addWidget = function(){
	var widget = arg(arguments, 0, null);
	var gridster = $(".gridster ul").gridster().data('gridster');	
	
	wid = Widget(gridster, widget);
	wid.addToGrid();
	//var _gravel = $('.gravel-templates .add-widget').gravel()[0]
	//_gravel.addButton('Step One', function(){
//		this.close();
		//gridster.add_widget(li, width, height, column, row);
	///}, '#333')
 
}

gridding.saveLayout = function(){
	var name = arg(arguments, 0, 'default');
	localStorage.setItem('layout-' + name,JSON.stringify(gridding.grid.serialize()))
}

gridding.layout = function(){
	var name = arg(arguments, 0, 'default');
	return l = JSON.parse(localStorage.getItem('layout-' + name))
	
}

/// =============================================================================================

HelloWorldWidget = {
	/* By default this is true unless set false */
	
	name: 'Hello World',
	closedIcon: 'hello.svg',
	closedText: 'Hello',
	openIcon: 'world.svg',
	openText: 'World.',
	highlightColor: '#2E454D',

	visibleHandler: function(){
		page.fullalert('Hello World Widget Created',
			'Some widgets can show a popup when they are first created.' , 'creation.svg')
	},
	touchHandler: function(ev){
		if(ev.type != 'release') {
			this.text().text(ev.type);
			//console.log('Hello world heard', ev.type);
			//console.log(this)

			if(ev.type == 'doubletap') this.toggleState();
		}
	},
	onClick: function(event, options) {
		this.toggleHighlight()
	},
	onDoubleClick: function(event, options) {
 		this.toggleState();
	}
}

WeatherWidget = {
	name: 'Weather',
	closedIcon: 'weather.svg',
	closedText: 'Weather Widget',
	closedIconColor: '#CCCCCC',
	config: {
		// list of woeid for yahoo api
		locations: []
	}
}

AddWidgetWidget = {
	name: 'Add'
}

ExampleWidget = {
	/* annotated */

	/* the name of your widget for use with the add button
	and interface alerts */
	name: 'Example',

	/*
	Icon displayed when closed 
	<img>
	*/
	closedIcon: 'image.ext',

	/*
	closed text
	*/
	closedText: 'closed example widget',


}

Widget = function () {
	var self = {};

	self.init = function(){
		self._grid = arg(arguments, 0, null);
		self._options = arg(arguments, 1, {});
		self.colorModule = Color;
		
		self._color = null;
		self.element = null;

		self.options = {

			// Color of the background.
			backgroundColor: '#FFF',

			// Color to highlight when the element is selected (single click)
			highlightColor: '#EFEFEF',

			// Icon used when the widget is in it's closed state
			closedIcon: 'dna.svg',

			// Icon used when the widget is in it's open state
			openIcon: 'fire.svg',

			// If the widget is open or closed. Also used for the widgets initial state.
			closed: true,
			
			// Color of the icon when the widget is in closed mode.
			closedIconColor: '#333',

			// Color of the icon when the widget is in open mode
			openIconColor: '#999',
			
			// Text used  when widget is in closed mode.
			closedText: 'The closed widget',

			// Text to display on open mode (not data container)
			openText: 'Welcome to your message',
			
			//Color of text used when the widget is in a low contrast mode.
			lightTextColor: '#FFF',

			//Color of the text when the widgets backgroound is in high contrast mode.
			darkTextColor: '#333',

			openHandler: function(){
				console.log("Open Handler");
			},
			closedHandler: function(){
				console.log('Open Handler');
			},
			onClick: function(){
				console.log('on click.');
			},
			visibleHandler: function(){
				console.log("visible");
			},
			closedWidth: 1,
			closedHeight: 1,
			openWidth: 4,
			openHeight: 3,
			textElementClass: 'text',
			format: '<li class="new"><div class="spinner"></div><div class="icon">%(icon)s</div><div class="text">%(text)s</div></li>',
			// When this widget is open
			onLoad: function(){
				console.log('on load')
			},
			visible: true
		}

		self.closed = self.options.closed;
		self.visible = self.options.visible;	
		self.options.onClick.prototype.close = function(){
			//back to close state.
		}

		//debugger;
		self.options = $.extend( self.options, self._options);

		return self;
	}

	/*
	Set the width, height, icon and text of a closed state widget.
	width, height, icon, text, color
	 */
	self.closedState = function() {
		self.addWidgetToGrid(self.grid)
	}

	self.text = function(){
		var defEl = self.element.find('.' + self.options.textElementClass)
		self._text = arg(arguments, 0, self._text || defEl);
		return self._text;

	}

	self.showLoader = function() {
		self.element.find('.spinner').fadeIn()
		return self
	}

	self.hideLoader = function(){
		self.element.find('.spinner').fadeOut();
		return self;
	}

	self.toggleState = function() {
		if(self.closed) {
			self.showOpenState()	
		} else {
			self.showClosedState()
		}
	}


	// Add this to the grid that is passed 
	// or was passed in instantiation.
	self.addToGrid = function() {
		var grid = arg(arguments, 0, self._grid);
		
		if (grid) {
			var html = self.html();
			self.element = grid.add_widget(html)
			self.element.hide()
			
			// Click Handler
			self.element.click(function(e){
				self.options.onClick.call(self, e, self.options);
			});
			
			self.element.dblclick(function(e){
				self.options.onDoubleClick.call(self, e, self.options);
			});



			self.store = {};
			self.store.set = function(key, value){
				Sadie.model.addToSpace(self.options.name, key, value);
				return value;
			}

			self.store.getCreate = function(key, value) {
				var val = Sadie.model.getFromSpace(self.options.name, key);
				if(val == undefined) {
					Sadie.model.addToSpace(self.options.name, key, value);
					return value;
				};
				return val;
			}

			self.store.get = function(key){
				var returnVal = arg(arguments, 1, null);
				var val = Sadie.model.getFromSpace(self.options.name, key);
				if(val == undefined) {
					return returnVal;
				};
				return val;
			}
		}


        var $img = self.element.find('img.svg')
        var imgID = $img.attr('id');
        var imgClass = $img.attr('class');
        var imgURL = $img.attr('src');

        self.showClosedState()

        jQuery.get(imgURL, function(data) {
            // Get the SVG tag, ignore the rest
            var $svg = jQuery(data).find('svg');

            // Add replaced image's ID to the new SVG
            if(typeof imgID !== 'undefined') {
                $svg = $svg.attr('id', imgID);
            }
            // Add replaced image's classes to the new SVG
            if(typeof imgClass !== 'undefined') {
                $svg = $svg.attr('class', imgClass+' replaced-svg');
            }

            // Remove any invalid XML tags as per http://validator.w3.org
            $svg = $svg.removeAttr('xmlns:a');

            // Replace image with new SVG
            $img.replaceWith($svg);

            self.iconColor();
            
            // Hook the events to self.

			//page.addEventReceiver.call(self, self.options.touchHandler);

            self.element.fadeIn('slow', function(){
            	self.options.visibleHandler();
            })
        });

	}

	/*
	Display a state of highlight by colouring the objects 
	background
	*/
	self.toggleHighlight = function(){
		var mod = self.store.getCreate('toggleHighlight', 1);
		var val = self.store.set('toggleHighlight', mod+=1);

		if(mod % 2 == 0) {
			self.backgroundColor(self.options.highlightColor);
		}
		else 
		{
			self.backgroundColor(self.options.backgroundColor);
		}
	}

	self.showOpenState = function(){
		//debugger;
		self.height(self.options.openHeight);
		self.width(self.options.openWidth);
		// self.text() returns jquery element
		self.text().css('font-size', '24px');
		// hence the ugly syntax
		self.text().text(self.options.openText);
		self.closed = false;
		self.open = true;
		self.icon(self.options.openIcon)
		self.options.openHandler()
		return self;
	}

	self.showClosedState = function(){
		self.width(self.options.closedWidth);
		self.height(self.options.closedHeight);
		//self.icon()[0].src = self.closedIconUrl();
		self.text().css('font-size', '12px');
		self.text().text(self.options.closedText);
		self.closed = true;
		self.icon(self.options.closedIcon)
		self.open = false;
		self.options.closedHandler()
		return self;
	}

	self.iconColor = function(){
		self.options.closedIconColor = arg(arguments, 0, self.options.closedIconColor)
		self.options.openIconColor = arg(arguments, 1, self.options.openIconColor)
		$(wid.element).find('.svg')[0].style.fill = (self.closed)? self.options.closedIconColor: self.options.openIconColor;
		return [self.options.closedIconColor, self.options.openIconColor]
	}

	self.grid = function(){
		return self._grid;
	}

	self.html = function(){
		var text = (self.closed)? self.options.closedText: self.options.openText;
		var icon = (self.closed)? self.closedIcon(): self.options.closedIcon;
		self._html = arg(arguments, 0, self._html || text )
		return sprintf(self.options.format, {
			text: text,
			icon: icon
		})
	}

	self.closedIcon = function(){
		self.options.closedIcon = arg(arguments, 0, self.options.closedIcon);
		return sprintf('<img src="%(url)s" class="svg closed"/>', {url: self.closedIconUrl()});
	}

	self.openIcon = function(){
		self.options.openIcon = arg(arguments, 0, self.options.openIcon);
		return sprintf('<img src="%(url)s" class="svg open"/>', {url: self.openIconUrl()});
	}

	self.openIconUrl = function(){
		return self.options.openIconUrl = arg(arguments,0, sprintf( '/static/img/icons/%(icon)s', {icon: self.options.openIcon} ) )
	}
	
	self.closedIconUrl = function(){
		return self.options.closedIconUrl = arg(arguments,0, sprintf( '/static/img/icons/%(icon)s', {icon: self.options.closedIcon} ) )
	}

	// Return a jquery element of the img tag
	self.icon = function(){
		var el = self.element.find('.svg');
		var _iconName = arg(arguments, 0, null);

		if(_iconName != null) {
		
			self.element.find('.icon').empty();
			var img =self[(self.closed)? 'closedIcon': 'openIcon'](_iconName)
			self.element.find('.icon').append(img)
		}

		return el
	}

	self.height = function(){
		var optHeight = (self.closed)? self.options.closedHeight: self.options.openHeight;
		// self.options[(self.closed)? 'closedHeight': 'openHeight'] = height;
		self._height = arg(arguments, 0, self._height || optHeight);
		if(self.visible) {
			self.grid().resize_widget(self.element, self._width, self._height);
			//fix the picture.
			
			self.icon().css('height', ( self.element.height() * .75 ) + 'px' )
		}

		return self._height;
	}



	self.width = function(){
		var optWidth = (self.closed)? self.options.closedWidth: self.options.openWidth;
		var width = arg(arguments, 0, optWidth);
		// self.options[(self.closed)? 'closedWidth': 'openWidth'] = width;
		self._width = arg(arguments, 0, self._width || optWidth);
		if(self.visible) {
			self.grid().resize_widget( self.element, self._width, self._height)
			self.icon().css('width', ( self.element.width() * .75) + 'px' )
		}
		return self._width;
	}

	/* text and default forcolor of widget
	If no custom value is passed, this will report
	'light' or 'dark' based upon the current background color

	Passing your own value will always override this and only pass the one color.
	If you want to override the basic light and dar text colours, it's best doing
	that be editing self.options.lightTextColor and self.options.darkTextColor
	Pass null to reset to default. 
	 */
	self.contrast = function(){
		self._contrast = arg(arguments, 0, self.backgroundColor());

		var col = {
			'light': self.options.lightTextColor,
			'dark': self.options.darkTextColor
		};

		return col[self.colorModule.getContrastYIQ(self._contrast)]
	}

	self.iconColor = function(){
		//debugger
	}

	self.textColor = function(){
		var _textColor = arg(arguments, 0, null);
	
		if(_textColor == null) {
			if(self._textColor) { return self._textColor; };
			return self.contrast();

		} else {
			self._textColor = _textColor;
			self.element.find('.text').css('color', self._textColor);
			return self
		}
	}

	/*
	The background color of the widget. 
	Change the background color of the widget. Then change the color of the icon to its
	counterpart
	 */
	self.backgroundColor = function(){
		var _bc = arg(arguments, 0, null);
		if(_bc != null){
			// self.options.backgroundColor = _bc;
			this.element.css('background-color', _bc);
			
			self.textColor(self.contrast(_bc));
			self.iconColor(self.contrast(_bc));
			return self;
		}

		return this.element.css('background-color')
	}

	/*
	Which row in int the widget should be placed
	 */
	self.row = function() {
		return self;
	}

	return self.init.apply(self, arguments)
}

