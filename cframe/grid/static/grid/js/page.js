page = {}
Sadie.page = page;

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