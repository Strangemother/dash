
Widget = function () {
    var self = {};

    self.init = function(){
        self._grid = arg(arguments, 0, null);
        self._options = arg(arguments, 1, {});
        self.colorModule = Color;
        self._closedIcons = [];
        self._color = null;
        self.element = null;

        self.options = {

            // Color of the background.
            backgroundColor: '#FFF',

            // Color to highlight when the element is selected (single click)
            highlightColor: '#EFEFEF',

            // Icon used when the widget is in it's closed state
            closedIcon: '/static/img/icons/dna.svg',

            // Icon used when the widget is in it's open state
            openIcon: '/static/img/icons/fire.svg',

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

            /* if multiple icons are set for open or closed, define the
            length in ms for cycling between icons 
            Set to <= 0 to stop autocycling.
            */
            iconCycleDelay: 3500,

            openHandler: function(){
                console.log("Open Handler");
            },
            closedHandler: function(){
                console.log('Open Handler');
            },
            onClick: function(event, options) {
                this.toggleHighlight()
            },
            onDoubleClick: function(event, options) {
                this.toggleState();
            },
            visibleHandler: function(){
                console.log("visible");

            },
            closedWidth: 1,
            closedHeight: 1,
            openWidth: 4,
            openHeight: 3,
            textElementClass: 'text',
            content_1: 'content_1',
            format: '<li class="new"> \
            <div class="spinner"></div> \
            <div class="icon">%(icon)s</div> \
            <div class="text">%(text)s</div> \
            <div class="content_1">%(content_1)s</div> \
            </li>', 

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

    self.content_1 = function(){
        var defEl = self.element.find('.' + self.options.content_1)
        self._content_1 = arg(arguments, 0, self._content_1 || defEl);

        return self._content_1;

    }

    self.showLoader = function(id) {
        //debugger;
        self._loaderCalls.push(id);
        if(self.element && self.loaderVisible==false) {
            self.loaderVisible=true;
            self.element.find('.spinner').show();
        }
        return self
    }

    self._loaderCalls = [];
    self.loaderVisible=false;

    self.hideLoader = function(id){
     
        for (var i = 0; i < self._loaderCalls.length; i++) {
            var el = self._loaderCalls[i];
            if (el == id) {
                // slice
                self._loaderCalls.splice(i)
                break;
            }
        };

        if(self._loaderCalls.length <= 0 || id == '*') {
            self._loaderCalls = [];
            self.loaderVisible=false;
            this.element.find('.spinner').hide();
        }
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
        self.showLoader('load');
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

            self.store.has = function(key) {
                var k= '';
                for (var i in Sadie.model.spaceData) {
                    k = self.options.name + '-' + key;
                    if(i ==k) {
                        return true;
                    }
                };

                return false;
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
                self.hideLoader('load')
                self.options.visibleHandler.apply(self);
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
        self.text().text(self._openText || self.text().text() || self.options.openText);
        self.closed = false;
        self.open = true;
        self.icon(self.options.openIcon)
        self.options.openHandler.apply(self)
        return self;
    }

    self.showClosedState = function(){
        self.width(self.options.closedWidth);
        self.height(self.options.closedHeight);
        //self.icon()[0].src = self.closedIconUrl();
        self.text().css('font-size', '12px');
        self.text().text(self._closedText || self.text().text() || self.options.closedText);
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
            icon: icon,
            content_1: ''
        })
    }

    /* Get set an array of icons to automatically cycle through closed icons. */
    self.closedIcons= function() {
        return self._iconsSet.call(self, '_closedIcons', arguments);
    }
    
    /* Get set an array of icons to automatically cycle though open icons. */
    self.openIcons= function() {
        return self._iconsSet.call(self, '_openIcons', arguments);
    }

    self._iconsSet = function(ref, args) {
        /* Apply a set of closed icons to cycle through 
        This function will get/set an array of icons the widget
        will cycle through. 
        Upon each cycle call, self.closedIcon() is called passing the
        new string val.

        To get/set the current icon use closedIcon
        */

        var icons = arg(args, 0, self[ref] || null);
        var delay = arg(args, 1, self.options.iconCycleDelay);

        if(args[0] == undefined) {
            // nothing passed, return val
            return self[ref];
        } else {
            self[ref] = icons;
            self[ref + '_iconCycleDelay'] = delay;
            self.iconTimer(ref, delay);
        }

        return self;
    }

    /* cycle though a number of icons, under a timer reference. 
    calling callback function in context of this (self)
    passing the icon string and reference */
    self.iconTimer = function(ref) {
        var icons = self[ref];
        var delay = arg(arguments, 1, self[ref + '_iconCycleDelay']);

        var ticker = 0;
        self.stopIconTimer(ref);
        self[ref + '_timer'] = window.setInterval(function(ref, icons){
            ticker++;
            console.log("images tick")
            if(delay >= (1000 / 25) && icons.hasOwnProperty('length')) {
                //debugger;
                if(icons.length == 1) {
                    // change icontype to current icon
                    self.stopIconTimer(ref)
                    self[ref.slice(1, -1)](icons[0]);
                    ///self._iconsSet.call(self, ref, arguments)
                } else if (icons.length < 1) {
                    self.stopIconTimer(ref);
                } else {
                    self[ref.slice(1, -1)](icons[ticker % icons.length]);
                }
                //console.log(ref, icons, ticker);

            }
        }, delay, ref, icons);
            /*
            for (var i = 0; i < icons.length; i++) {
                icons[i]
            };*/
    }

    self.stopIconTimer = function(ref) {
        window.clearInterval(self[ref + '_timer'])
    }

    self.iconDelay = function() {
        self.iconCycleDelay = arg(arguments, 0, self.iconCycleDelay || self.options.iconCycleDelay);
        return (arguments[0])? self: self.iconCycleDelay;
    }

    self.closedIcon = function(){
        self.options.closedIcon = arg(arguments, 0, self.options.closedIcon);
        var html = sprintf('<img src="%(url)s" class="svg closed"/>', {url: self.closedIconUrl()});

        if(self.closed && self.element) {
            var oldsrc = self.element.find('.icon img').attr('src');

            if(oldsrc != self.closedIconUrl()) {
                //self.showLoader('closedIcon');
                self.loadImage(self.closedIconUrl(), function(image){
                        self.element.find('.icon').html(html);
                })
            }
        } else {
        }
        if(arguments[0]) {
            return self;
        } else {
            return html;
        }
    }

    self.openIcon = function(){
        self.options.openIcon = arg(arguments, 0, self.options.openIcon);
        var html = sprintf('<img src="%(url)s" class="svg open"/>', {url: self.openIconUrl()});
        
        if(self.open && self.element) {
            var oldsrc = self.element.find('.icon img').attr('src');

            if(oldsrc != self.openIconUrl()) {
                self.loadImage(self.openIconUrl(), function(image){
                        self.element.find('.icon').html(html);
                })
            }
        }else {
        }
        if(arguments[0]) {
            return self;
        } else {
            return html;
        }
    }

    self.loadImage = function(url, func) {
        
        $('.cacheImageContainer').uiji('img{src=' + url + '}', function(){
        

            var dfd = $('.cacheImageContainer').imagesLoaded();
                // Always
            dfd.always( function(){
                console.log( 'all images has finished with loading, do some stuff...' );
            });

            // Resolved
            dfd.done( function( $images ){
                // callback provides one argument:
                // $images: the jQuery object with all images
                console.log( 'deferred is resolved with ' + $images.length + ' properly loaded images' );

                func.apply(self, $images);
            });
            
            // Rejected
            dfd.fail( function( $images, $proper, $broken ){
                // callback provides three arguments:
                // $images: the jQuery object with all images
                // $proper: the jQuery object with properly loaded images
                // $broken: the jQuery object with broken images
                console.log( 'deferred is rejected with ' + $broken.length + ' out of ' + $images.length + ' images broken' );
            });

            // Notified
            dfd.progress( function( isBroken, $images, $proper, $broken ){
                // function scope (this) is a jQuery object with image that has just finished loading
                // callback provides four arguments:
                // isBroken: boolean value of whether the loaded image (this) is broken
                // $images:  jQuery object with all images in set
                // $proper:  jQuery object with properly loaded images so far
                // $broken:  jQuery object with broken images so far
                console.log( 'Loading progress: ' + ( $proper.length + $broken.length ) + ' out of ' + $images.length );
            });

        });
            
    }

    self.openIconUrl = function(){
        return self.options.openIconUrl = arg(arguments,0, sprintf( '%(icon)s', {icon: self.options.openIcon} ) )
    }
    
    self.closedIconUrl = function(){
        return self.options.closedIconUrl = arg(arguments,0, sprintf( '%(icon)s', {icon: self.options.closedIcon} ) )
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
            self.element.find('.content_1').css('color', self._textColor);
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

