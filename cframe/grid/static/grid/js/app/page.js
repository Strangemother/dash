page = {}
Sadie.page = page;

page.backgroundColor = function(){
    var col = arg(arguments, 0, Sadie.model.defaultBackgroundColor);
    $('body').css('background-color', col);
}

page.appendWidgets = function() {
    var widgets = arg(arguments, 0, []);
    var callback = arg(arguments, 1, function(){});
    var wids = []
    for(var i=0; i < widgets.length; i++) {
        page.appendWidget(widgets[i], {}, function(widget){
            console.log('Page::appendWidgets, appendWidget callback', widget)
            wids.push(widget);
            if(wids.length == widgets.length) {
                if(typeof(callback) == 'function') {
                    return callback.call(this, wids);    
                }   
            }
        })
    }
    
    return null;
}

page.appendWidget = function() {
    var widgetPathData = arg(arguments, 0, null);
    var context = arg(arguments, 1, {});
    var callback = arg(arguments, 2, function(widget){ return widget; });

    if(widgetPathData == null) {
        return false;
    }
    // make a call to the model for a pk's path to main.js
    // WidgetData: pk
    if(widgetPathData.hasOwnProperty('path')) {
        // import main.js from path point
        // as widget name 

        // name of widget
        var name = widgetPathData['name'];
        /*
        Call and include the widget from it's path.
        */
        var contxt = '/widget/data/' + widgetPathData.name;
        var widgetPath = '/media/unpacked/' + widgetPathData.path + '/main.js'

        require([contxt, widgetPath, 'gridding'], function(context, widgetData){
                // widget lib importedrequire(['gridding'], function()
                if(widgetData == undefined) {
                    // Something went wrong with the custome widget
                    throw new Error("Missing widget data at: '" + widgetPath + "'")
                }   

                if(context == undefined || context == {}) {
                    // Something went wrong with the custome widget
                    throw new Error("Missing context data at: '" + context + "'")
                }

                // Reigster widget here, allowing a custom context ro be
                // ready inside the context of the object before loosing scope.

                // RegisterWidget can accept an object or a function.
                // callcabk should be called.
                gridding.addWidget(widgetData, context, callback)
                //gridding.createGrid(gridding.layout());
        });
        
    } else {
        // make call - receive endpoint.
        // add to require masking extension random id to api call
        var contxt = '/widget/data/' + widgetPathData;
        var widgetPath = '/media/unpacked/' + widgetPathData + '/main.js';
        require([contxt, widgetPath, 'gridding'], function(context, widget){
            gridding.addWidget(widget, context, callback);
            //gridding.createGrid(gridding.layout());
        });
        
    }
    //page.createInterfaceButton(widgetData)

    // callback needs to be called.
    return null
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
    //  page.touchHandler.call(parent, ev);
    //};
    //parent.hammer.ondrag = function(ev) {
    //  page.touchHandler.call(parent, ev);
    //};
    //parent.hammer.ondragend = function(ev) {
    //  page.touchHandler.call(parent, ev);
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

page.__interfaceButtons = []

page.createInterfaceButton = function(){
    var widgetData = arg(arguments, 0, null);

    // <li><a href='javascript:;' id='createWeatherWidget'>Weather</a></li>
    $('div.tools ul').uiji('li', function(){
        var name =  (widgetData.name || widgetData).replace('_', ' ');
        $(this).uiji('a{href=javascript:;}.interface-button"' + name + '"', function(){
            page.__interfaceButtons.push([this, widgetData]);
            $(this).click(function(){
                console.log("createInterfaceButton");
                gridding.addWidget(widgetData);
            })
        })
    })
}