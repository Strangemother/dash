
Widget = function () {
    var self = {};

    self.jsonGet = function(){
        return 
    }


    self.init = function(){
        self._options = arg(arguments, 0, {});
        self._context = arg(arguments, 1, {});
        self.colorModule = Color;
        self._closedIcons = [];
        self._color = null;
        // The HTML gridding li element
        self.element = null;
        // Manifest file populated via ajax as an object
        self.manifest = {};
        // The parent widget that performed the lock
        self.lockParent = null;
        // If this widget has been locked by another widget
        self.locked = false;
        // Hold the iframe page
        self.currentPage = null;
        // If this element has been highlighted through toggleHighlight()
        self.highlighted = false;
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

            /*
            List of widget names required for this widget to function
            Such as 'socket', 'pinpad' or 'ip' - it's a rudimentary form
            of application resource sharing. If this widget is missing,
            The gridding options will determine if widget installs should 
            happen.

            It's probably best to add a failureHandler for this.
            */
            required: [],

            /*
            requirejs module dependecies 
            */
            dependencies: [],

            /* if multiple icons are set for open or closed, define the
            length in ms for cycling between icons 
            Set to <= 0 to stop autocycling.
            */
            iconCycleDelay: 3500,
            initHandler: function(){
                /* widget initialised. This is the very first
                method to be called after the widget has handled the data 
                received. 

                Method overrides and setup should be done here.
                */
            },
            returnHandler: function() {
                /*
                handler called when a widget requests data from another widget.
                */
            },
            toValue: function(){ 
                /*
                Returns contextual information for another js based call.
                RPC, widget, console may access this information. 

                This should be coded to return a value or perform logic 
                and return a value

                >>> Sadie.getWidget('example_ip').toValue()
                */
            },
            openHandler: function(){
                /*
                Called when the widget opens to display it's main content
                widget.showOpenHandler()
                */
                console.log("Open Handler");
            },
            closedHandler: function(){
                // console.log('Closed Handler');
            },
            onClick: function(event, options) {
                /* Handles click event */
                /*
                if(!self.dragging()) {
                    this.toggleHighlight()
                }
                */
            },
            onDoubleClick: function(event, options) {
                /* Handle double click event */
                this.toggleState();
            },
            pageLoadHandler: function(element){

            },
            visibleHandler: function(){
                console.log("visible");

            },
            lockHandler: function() {

            },
            column: 1,
            row: 1,
            closedWidth: 1,
            closedHeight: 1,
            openWidth: 4,
            openHeight: 3,
            textElementClass: 'text',
            content_1: 'content_1',
            content_2: 'content_2',
            format: '<li class="new"> \
            <div class="spinner"></div> \
            <div class="icon">%(icon)s</div> \
            <div class="text">%(text)s</div> \
            <div class="content_1">%(content_1)s</div> \
            <div class="content_2">%(content_2)s</div> \
            </li>', 

            // When this widget is open
            onLoad: function(){
                console.log('on load')
            },
            visible: true
        }

        self.closed = self.options.closed;
        self.visible = self.options.visible;
        // overwrtable return handler for returning js data to contextual
        // requirements

        self.options.onClick.prototype.close = function(){
            //back to close state.
        }

        //debugger;
        self.renderoptions(self._options)
        // fetch and load manifest
        
        self.loadManifest(self.context().name)

        var initHandler = self.options.initHandler || function(){}
        self.name = self.options.name;
        initHandler.call(this)
        return self;
    }

    self.toValue = function(){
        return self.options.toValue.apply(this, arguments);
    }
    self.getValue = function() {
        /*
        Perform widgets method of perform, returning 
        contextual information for use with the called object.
        Note - This information may be passed through the a
        socket layer, thus getValue return data should reflect this

        Methods of callback.
        getValue({ options }, callback(data))
        getValue(callback(data))
        getValue() // return the toValue() method
        */
        var arg1 = arg(arguments, 0, {});
        // return the 2nd arg, else return the first, otherwise return null
        var callback =  arg(arguments, 1, arg(arguments, 0, null))
        var val = null;

        if(typeof(arg1) == 'function') {
            callback = arg1;
            arg1 = {}
        }
        val = self.toValue(arg1, function(pin){
            return callback.call(this, pin);

        });
        
        return val;
    }

    self.centerPoint = function(){
        var el = arg(arguments, 0, null)
        /* returns an object {top, left}
        denoting the center point of the widget in px 
        pass an element and the top and left will be 
        correctly ajusted for the elements scope. Allowing
        direct pass to the child object.
        */
        var _width = (self.element.width() * .5);
        var _height = (self.element.height() * .5);

        if(el) {
            _width -= el.width() * .5;
            _height -= el.height() * .5;
        }

        return {  
            left: _width,
            top: _height
        }
    }

    self.context = function(){
        return self._context;
    }

    self.lock = function(parent){
        /*
        Lock this widget to be owned by another.
        This is useful for spawning children widgets to receive or
        send data.

        returns true and applies the lock if available
        returns false if cannot be locked.
        */

        if(this.locked == false || this.locked == undefined) {
            if(this.lockParent == null) {
                this.lockParent = parent;
                // Provide the outline width color as the width of the lock parent.
                // Using outline ensures width isn't affected.
                var color = parent.options.highlightColor || parent.backgroundColor();
                
                this.element.css('outline', 'solid 2px ' + color);
                
                // Light up parent widget
                
                if(parent.closed) {
                    parent.highlight(true)
                }
                return this.locked = true;
            } else {
                if(parent == this.lockParent) {
                    return this.locked = true;
                } else {
                    return false;
                }
            }

        } else if(parent == this.lockParent) {
            // The lock has been applied by the given parent.
            // therefore, it's okay to return true
            return this.locked = true
        }

        return false;
    }

    self.unlock = function(parent){ 
        /*
        remove the lock on this widget. 
        For auth, the original parent must be passed.
        
        returns true if unlocked
        returns true if no lock
        returns false if not unlocked
        */

        this.element.css('outline', '');

        if(parent.highlighted) {
            parent.toggleHighlight(false)
        }
        if(this.locked == false) {
            this.lockParent = null;
            return true;
        } else {
            if(parent == this.lockParent) {
                this.locked = false;
                this.lockParent = null;
                return true;
            } else {
                return false;
            }
        }
    }

    self.loadManifest = function(name) {
        // load a manifest file into this class as a dictionary of data.
        var url = '/widget/manifest/' + name + '/';
        jsonResponse(url, 'GET', {}, function(data){
            self.manifest = data;
        })
    }

    self.renderoptions = function(opts){
        if(!self._renderedOptions) {
            self._renderedOptions = true;
            self.options = $.extend( self.options, opts);
        }
        return self.options
    }

    /*
    Set the width, height, icon and text of a closed state widget.
    width, height, icon, text, color
     */
    self.closedState = function() {
        self.addWidgetToGrid(self.grid)
    }

    self.text = function(){

        // Try the passed text, then the title, then closed or open text based upon
        // current state.

        /*
        Collects current state text. 
           self._closedText or options.closedText
        or self._openText or options.openText.

        save stored value into _closedText or _openText
        */
        var currentStateText = (self.closed)? (self._closedText || self.options.closedText): (self._openText || self.options.openText);
        self[(self.closed)? '_closedText': '_openText'] = self._text = arg(arguments, 0, self._text || self.options.title || currentStateText);
        self.textElement().text(self._text);
        if(arguments[0]) {
            return self;
        }
        return self._text;
    }

    self.textElement = function(){
        var defEl = self.element.find('.' + self.options.textElementClass);
        self._textElement = arg(arguments, 0, self._textElement || defEl);
        if(self._textElement) {
            self._textElement.css('font-size', self.fontSize())
        }
        return self._textElement;
    }

    self.fontSize = function(){
        self._fontSize = arg(arguments, 0, self._fontSize || self.options.fontSize || 12)
        if(self._textElement) {
            self._textElement.css('font-size', self._fontSize);
        }
        if(arguments[0] != undefined) {
            return self
        }

        return self._fontSize;
    }

    self.content_1 = function(){
        var defEl = self.element.find('.' + self.options.content_1)
        self._content_1 = arg(arguments, 0, self._content_1 || defEl);

        return self._content_1;

    }

    self.content_2 = function(){
        var defEl = self.element.find('.' + self.options.content_2)
        self._content_2 = arg(arguments, 0, self._content_2 || defEl);

        return self._content_2;

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


    /*
    Display a state of highlight by colouring the objects 
    background
    */
    self.toggleHighlight = function(){
        var initStateValue = arg(arguments, 0, 1);
        var mod = self.store.getCreate('toggleHighlight', initStateValue);
        var val = self.store.set('toggleHighlight', mod+=1);
        self.highlight( (mod % 2 == 0) )
        return val;
    }

    self.unhighlight = function(){
        /*
        unhighlight the widget and return to the 
        options.backgroundColour
        */
        var unhl = arg(arguments, 0, true);

        if(unhl === true) {
            self.backgroundColor(self.options.backgroundColor);
            self.highlighted = false;
        } else {
            // double negative request unhighlight(false) un-unhighlight
            self.highlight()
        }

        if(arguments[0]) {
            return self;
        } else {
            return self.highlighted;
        }
    }

    self.highlight = function(){
        /*
        highlight the widget with it's options.highlightColor

        highlight(true) will turn on highlighting
        highlight(false) will turn off highlighting
        */
        var hl = arg(arguments, 0, true);
        
        if(hl=== true) {
            self.backgroundColor(self.options.highlightColor);
            self.highlighted = true;
        } else {
            self.unhighlight(true);
        };

        if(arguments[0]) {
            return self;
        } else {
            return self.highlighted;
        }
    }

    self.dragging = function(){
        return self._dragging = arg(arguments, 0, self._dragging || false);
    }

    self.store = {
        'set': function(key, value){
            Sadie.model.addToSpace(self.options.name, key, value);
            return value;
        },

        'has': function(key) {
            var k= '';
            for (var i in Sadie.model.spaceData) {
                k = self.options.name + '-' + key;
                if(i ==k) {
                    return true;
                }
            };

            return false;
        },

        'getCreate': function(key, value) {
            var val = Sadie.model.getFromSpace(self.options.name, key);
            if(val == undefined) {
                Sadie.model.addToSpace(self.options.name, key, value);
                return value;
            };
            return val;
        },

        'get': function(key){
            var returnVal = arg(arguments, 1, null);
            var val = Sadie.model.getFromSpace(self.options.name, key);
            if(val == undefined) {
                return returnVal;
            };
            return val;
        }
    }

    // Add this to the grid that is passed 
    // or was passed in instantiation.
    self.addToGrid = function() {
        self.showLoader('load');
        self._grid = arg(arguments, 0, self._grid);
        
        /*
        If the grid exists generate the HTML and hook the 
        visible element
        */
        if (self._grid) {
            var html = self.html();

            // Add the widget to the grid interface, returning the
            // dom object
            self.element = self._grid.add_widget(html, self.options.closedWidth, 
                                                    self.options.closedHeight,
                                                    self.options.column,
                                                    self.options.row
                                                    )
            // Store the name of the widget into the jQuery data space
            $(self.element).data('name', this.name);

            // Store a callback method in the jQuery data space to easily
            // collect this widget.
            // Using this method means you not storing hard references to the
            // widget
            $(self.element).data('reference', function(){
                for (var i = 0; i < Sadie.gridding.widgets.length; i++) {
                    // collect from the global widget storage
                    var w = Sadie.gridding.widgets[i];
                    if (w.name == self.name) {
                        return w;
                    }
                };
            })

            // self.element.opacity(.5)
            self.backgroundColor(self.options.backgroundColor);
            
            // Click Handler
            self.element.click(function(e){
                self.options.onClick.call(self, e, self.options);
            });
            
            self.element.dblclick(function(e){
                self.options.onDoubleClick.call(self, e, self.options);
            });
            self.returnHandler = self.options.returnHandler;
            self.pageLoadHandler = self.options.pageLoadHandler;
        }

        var closed = true;

        if(closed) {
            self.showClosedState()

            if(self.options.closedIcon != null) {

                var $img = self.element.find('img.svg')
                var imgID = $img.attr('id');
                var imgClass = $img.attr('class');
                var imgURL = $img.attr('src');

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
                    self.show.call(self);
                    //$svg.parent().width($svg.parent().width() + 'px')
                    $svg.width(($svg.parent().width() * .75 )+ 'px')

                });

            } else {
                self.show.call(self);
            }
        } else {
            self.showOpenState()
        }
    }

    self.show = function(){
        self.element.fadeIn('slow', function(){
            self.hideLoader('load');
            self.options.visibleHandler.apply(self);
        })
    }

    self.kill = function(){
        /*
        Delete a widget from the interface and the memory.
        This should give the ability to reaload the object.
        */
        // remove from interface,
        self.showClosedState();
        // perform unlock, tell the lockParent.
        if(self.locked) {
            self.unlock(self.lockParent);
        }
        wid.grid().remove_widget(wid.element)
        // remove locks
        // remove from memory
        // remove from requirejs
    }

    self.showOpenState = function(){
        /* Open a template provided or load the default
        main.html (coded at server level) */
        var data = arg(arguments, 0, {});
        
        if(typeof(data) == 'string') {
             data = {
                page: data,
                name: self.options.name
            }
        } else {
            data.name = data.name || self.options.name;
            data.path = data.path || 'main.html';
            data.cache = data.cache || true;

        }
        
        var width = arg(arguments, 1, self.options.openWidth);
        var height = arg(arguments, 2, self.options.openHeight);
        self.width(width);
        self.height(height);
        // self.text() returns jquery element
        self.textElement().css('font-size', '24px');
        // hence the ugly syntax
        self.closed = false;
        self.open = true;
        self._pagevisble = true
        
        self.text(self._openText || self.options.openText || self.text());

        if(self.options.openIcon != null) {
            self.icon(self.options.openIcon);
        }

        // data.icon = self.icon

        self.content_1().hide()
        self.content_2().hide()
        console.log('widget::showOpenState::called')
        self.showPage(data, null);
        self.options.openHandler.apply(self)
        
        return self;
    }

    self.showPage = function() {
        /*
        Open the iframe main.html page. All handlers and callbacks
        are defined.

        name - the application name to serve the template from
        path - assetPath of the template 'main.html'
        cache - force reload cache (false)
        */
        var data = arg(arguments, 0, data);
        var path = arg(arguments, 1, null);
        var cache = arg(arguments, 2, data.cache);

        var name = data;
        if(typeof(data) == 'object') { 
            name = data.name;
            if(path == null) path = data.path || '';
        };
        // If use cache, collect json data. else, make new data
        var jsonData = JSON.stringify(data);
        console.log("Displaying page", name, jsonData)
        // User has passed arg(2), 
        // or user has data.cache, 
        // or data is the same as the previous request data
        var useCache = cache || (jsonData == self._oldRequestData);

        if( (cache == null) 
            && self._oldRequestData != undefined 
            && self._oldRequestData != null
            && jsonData == self._oldRequestData) {
            // no cache provided. Provide old cache data as this request may
            // by lazy (iframe display)
            useCache = true
        } 
        // usecache check 
        console.log('Use cache', cache, useCache, self.open)
        if(useCache && self.currentPage) {
            console.log("Using cache infomation")
            self.iframe().show();
        } else if(self.open == true) {
            console.log("realoading data")
            // Make server request to show the requested page.
            self._oldRequestData = jsonData
            self.getOpenHtml({
                appname: name,
                data: jsonData,
                assetPath: path
            }, self.getOpenHtmlReceiver)
        }
    }

    self.showClosedState = function() {
       
        if(self._pagevisble == true) {
            $(self.element).find('iframe').hide();
            self._pagevisble = false;
        }

        self.content_1().show()
        self.content_2().show()

        self.width(self.options.closedWidth);
        self.height(self.options.closedHeight);
        //self.icon()[0].src = self.closedIconUrl();
        // self.text().css('font-size', '12px');
        self.closed = true;
        self.open = false;
        self.text(self._closedText || self.options.closedText || self.text());
        if(self.options.closedIcon != null) {
            self.icon(self.options.closedIcon);
        }
        self.options.closedHandler.apply(self);
        return self;
    }

    self.pageLoadHandler = function(element) {
        console.log('pageLoadHandler');
    }

    self.getOpenHtml = function(context) {
        // get request
        var url = 'widget/page/' + context.appname + '/';

        jsonResponse(url, 'GET', context, function(data){
            // data received from endpoint.
            // load asset path into view.

            if(data.error === true) {
                if(data.code == 1) {
                    // no template
                    console.log("No template");
                }
            } else {
                self.getOpenHtmlReceiver.call(self, context, data)
                
            }
        })
    }

    self.getOpenHtmlReceiver = function(context, data){
        // Receive data; present to 
        // create iframe, 
        // change interface style.
        // render site
        var iframe = $(self.element).find('iframe#' + self.options.name + '_page');

        if( (iframe.length <= 0) && (data != '') )  {
            // Create the iframe if it does not exist.
            $(self.element).uiji('iframe{id=' + context.appname +'_page}', function(){
                $(this).hide()
                 $(this).load(function(){


                    $(this).show(function(){
                        self._pagevisble = true;
                        // Pass the iframe as the arg. Which is nice.
                        self.currentPage = $(this).contents();
                        self.currentPage.find('body').html(data)
                        self.currentPage.find('.close').click(function(){
                            self.showClosedState();
                        });

                        self.pageLoadHandler(self.currentPage);
                    });
                })

                // self.iframeUrl('/widget/page/' + context.appname + '/', this, null, context);
                
            });
        } else {
             console.log("present data to existing iframe")
            self.iframe().contents().find('body').html(data)
            self.iframe().show()
            self.pageLoadHandler(self.currentPage);
             self.currentPage.find('.close').click(function(){
                 self.showClosedState();
            });
            // self.iframeUrl('/widget/page/' + context.appname + '/', null, context);
            if(self.dev == true) {
                // $(self.element).find('iframe').contents()[0].location.reload(true);
            }
            self._pagevisble = true;
        }
    }

    self.iframe = function() {
        return $(self.element).find('iframe');
    }

    self.iframeUrl = function(){
        var url = arg(arguments, 0, null)
        var iframe = arg(arguments, 1, _iframe)
        var context = arg(arguments, 2, {})

        if(_iframe == null) {
            var _iframe = $(self.element).find('iframe#' + self.options.name + '_page');
            
        }


        if(_iframe.length > 0) {
            _iframe = null;
        }
        var iframe = arg(arguments, 1, _iframe);
        var str = "";
        for (var key in context) {
            if (str != "") {
                str += "&";
            }
            str += key + "=" + context[key];
        }

        if(iframe) {
             iframe.src = url + '?' + str; 
        }
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
            content_1: '',
            content_2: ''
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
                // console.log( 'all images has finished with loading, do some stuff...' );
            });

            // Resolved
            dfd.done( function( $images ){
                // callback provides one argument:
                // $images: the jQuery object with all images
                // console.log( 'deferred is resolved with ' + $images.length + ' properly loaded images' );

                func.apply(self, $images);
            });
            
            // Rejected
            dfd.fail( function( $images, $proper, $broken ){
                // callback provides three arguments:
                // $images: the jQuery object with all images
                // $proper: the jQuery object with properly loaded images
                // $broken: the jQuery object with broken images
                // console.log( 'deferred is rejected with ' + $broken.length + ' out of ' + $images.length + ' images broken' );
            });

            // Notified
            dfd.progress( function( isBroken, $images, $proper, $broken ){
                // function scope (this) is a jQuery object with image that has just finished loading
                // callback provides four arguments:
                // isBroken: boolean value of whether the loaded image (this) is broken
                // $images:  jQuery object with all images in set
                // $proper:  jQuery object with properly loaded images so far
                // $broken:  jQuery object with broken images so far
                //console.log( 'Loading progress: ' + ( $proper.length + $broken.length ) + ' out of ' + $images.length );
            });

        });
            
    }

    // get asset path here

    self.openIconUrl = function(){
        return self.options.openIconUrl = arg(arguments, 0, 
            sprintf( '%(iconpath)s/%(icon)s', {
                                        icon: self.options.openIcon,
                                        iconpath: self.context().path + '/icons'
                                    } ) )
    }
    
    self.closedIconUrl = function(){
        return self.options.closedIconUrl = arg(arguments, 0, 
            sprintf( '%(iconpath)s/%(icon)s', {
                                        icon: self.options.closedIcon,
                                        iconpath: self.context().path + '/icons'
                                    } ) )
    }

    // Return a jquery element of the img tag
    self.icon = function(){
        var el = self.element.find('.svg');
        var _iconName = arg(arguments, 0, null);
        var iconEl = self.element.find('.icon');
        if(_iconName != null) {
            iconEl.empty();
            var img =self[(self.closed)? 'closedIcon': 'openIcon'](_iconName);
            iconEl.show();
            iconEl.append(img);
            iconEl.parent().removeClass('no-icon');
        } else {
            self.element.find('.icon').hide();
            iconEl.parent().addClass('no-icon');
            var textEl = self.element.find('.text');
            var point = self.centerPoint(textEl);
            textEl.position(point);

        }
        return el;
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
            var contrast = self.contrast(_bc)
            // console.log("Widget::backgroundColor::contrast", contrast, _bc)
            self.textColor(contrast);
            self.iconColor(contrast);
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

define(function(){

    return Widget;
})