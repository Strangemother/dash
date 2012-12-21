$(document).ready(function(){
	 gridding.createGrid(gridding.layout());
	 page.appendWidgets([HelloWorldWidget, WeatherWidget]);

})
Sadie = {};
page = {};
gridding = {};
utils = {}
Sadie.page=page;
Sadie.gridding=gridding;

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
	console.log("Append widget", widgetData.name)
	page.createInterfaceButton(widgetData)
	return true;
}

page.fullalert = function(){
	var largeText = arg(arguments, 0, 'Important');
	var smallText = arg(arguments, 1, 'An important notice has taken place.');
	var icon = arg(arguments, 2, 'caution.svg');;
	var highlightColor = arg(arguments, 3, '#800000');
	var lowlightColor = arg(arguments, 4, '#333333');

	/*
	Method called when the alert opens
	 */
	var openHandler = arg(arguments, 5, function(){});

	/*
	Activates when the user closes the message.
	Return false to stop the message from closing, else true will
	allow the popup api to continue
	 */
	var closeHandler = arg(arguments, 6, function(){ return false; });
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

utils.randomId = function()
{
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
	name: 'Hello World',
	closedIcon: 'hello.svg',
	closedText: 'Hello',
	openIcon: 'world.svg',
	openText: 'World.',
	visibleHandler: function(){
		page.fullalert('Hello World Widget Created',
			'Some widgets can show a popup when they are first created.', 'creation.svg')
	}
}

WeatherWidget = {
	name: 'Weather',
	closedIcon: 'weather.svg',
	closedText: 'Weather Widget',
	closedIconColor: '#CCCCCC',

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

		$.extend( self.options, self._options);

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
				self.options.onClick(e)
			});
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

            self.iconColor()

            self.element.fadeIn('slow', function(){
            	self.options.visibleHandler()
            })
        });

        

	}

	self.showOpenState = function(){
		self.height(self.options.openHeight);
		self.width(self.options.openWidth);
		self.text().css('font-size', '24px');
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
		self._contrast = arg(arguments, 0, null);
		// If the default has been changed.
		if(self._contrast != null) return self._contrast;

		var col = {
			'light': self.options.lightTextColor,
			'dark': self.options.darkTextColor
		};

		return col[self.colorModule.getContrastYIQ(self.backgroundColor())]
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
			self.options.backgroundColor = _bc;
			this.element.css('background-color', _bc);
			
			self.textColor(self.contrast())
			return self;
		}

		return self.options.backgroundColor
	}

	/*
	Which row in int the widget should be placed
	 */
	self.row = function() {
		return self;
	}

	return self.init.apply(self, arguments)
}

