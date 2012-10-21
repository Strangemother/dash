$(document).ready(function(){
	 $(".gridster ul").gridster({
        widget_margins: [10, 10],
        widget_base_dimensions: [140, 140]
    });



})

gridding = {};

gridding.addWidget = function(){
	
	var gridster = $(".gridster ul").gridster().data('gridster');	
	//var _gravel = $('.gravel-templates .add-widget').gravel()[0]

	wid = Widget(gridster)
	wid.addToGrid()
	//_gravel.addButton('Step One', function(){
//		this.close();
		//gridster.add_widget(li, width, height, column, row);
	///}, '#333')
 
}



Widget = function () {
	self = {};

	self.init = function(){
		self._grid = arg(arguments, 0, null)
		self.colorModule = Color;
		self._backgroundColor = '#FFF';
		self._color = null;

		self.options = {
			closedIcon: 'dna.svg',
			openIcon: 'openIcon',
			closed: true,
			closedIconColor: '#333',
			openIconColor: '#999',
			
			closedText: 'The closed widget',
			openText: 'Welcome to your message',
			
			openHandler: function(){
				console.log("Open Handler");
			},
			closedHandler: function(){
				console.log('Open Handler');
			},

			closedWidth: 1,
			closedHeight: 1,
			
			format: '<li class="new"><div class="icon">%(icon)s</div><div class="text">%(text)s</div></li>'
		}

		self.closed = self.options.closed;
		return self;
	}

	/*
	Set the width, height, icon and text of a closed state widget.
	width, height, icon, text, color
	 */
	self.closedState = function() {
		self.addWidgetToGrid(self.grid)
	}

	// Add this element to the grid that is passed 
	// or was passed in instantiation.
	self.addToGrid = function() {
		var grid = arg(arguments, 0, self._grid);
		if (grid) {
			var html = self.html();
			grid.add_widget(html, self.width(), self.height())
		}
	}

	self.grid = function(){
		return self._grid;
	}

	self.html = function(){
		var text = (self.closed)? self.options.closedText: self.options.openText;
		var icon = (self.closed)? self.options.closedIcon: self.options.closedIcon;
		self._html = arg(arguments, 0, self._html || text )
		return sprintf(self.options.format, {
			text: text,
			icon: icon
		})
	}

	self.height = function(){
		var optHeight = (self.closed)? self.options.closedHeight: self.options.openHeight;
		return self._height = arg(arguments, 0, self._height || optHeight);
	}

	self.width = function(){
		var optWidth = (self.closed)? self.options.closedWidth: self.options.openWidth;
		return self._width = arg(arguments, 0, self._width || optWidth);
	}

	/* text and default forcolor of widget */
	self.color = function(){
		self._color = arg(arguments, 0, null);

		// If the default has been changed.
		if(self._color != null) return self._color;

		var col = {
			'light': '#eee',
			'dark': '#333'
		};

		return col[self.colorModule.color(self.backgroundColor()).getContrastYIQ()]
	}

	/*
	The background color of the widget. 
	 */
	self.backgroundColor = function(){
		return arg(arguments, 0, self._backgroundColor);
	}

	/*
	Which row in int the widget should be placed
	 */
	self.row = function() {
		return self;
	}

	/*
	Width in int sizes
	 */
	self.width = function(){
		return self;
	}

	return self.init.apply(self, arguments)
}