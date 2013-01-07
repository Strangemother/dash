$(document).ready(function(){
    require(['gridding'], function(){
        gridding.createGrid(gridding.layout());
    })

    page.appendWidgets(['add']);

    if(page.__interfaceButtons.length <= 0) {
        $('.add-button').hide();
    }
    
    $('.add-button').click(function(){
        $('.tools').show();
    });
})


Sadie = {
    allowInstall: true
};
utils = {};

Sadie.getWidget = function(name) {
    /*
    Look through widgets and return the widget matching the name provided.
    If widget does not exist. It will be installed.
    */
    var callback = arg(arguments, 1, function(widget){ return widget; })
    var ws = Sadie.getWidgets(name);
    var self = (function(){
        return this;
    }.apply({
        callback: callback,
    }));

    if(ws.length >= 1) {
        return callback.call(this, ws[0]);
    }

    if(Sadie.allowInstall) {
        // MEthod isnt called correctly.
        
         page.appendWidgets.call(this, [name], function(widgets){
            // context should be ee
            console.log("index::getWidgetCalling callback with ", widgets)
            // callback missing
            self.callback.call(widgets[0], widgets[0])
        });
    }
    return null;
}

Sadie.getLockedBy = function(name) {
    /* return all widget locked by name passed */
    var ws = [];
    for (var i = 0; i < Sadie.gridding.widgets.length; i++) {
        var w = Sadie.gridding.widgets[i];
        if(w.lockParent.name == name) {
            ws.push(w)
        }
    };

    return ws;
}

Sadie.getWidgets = function(name) {
    var ws = []
    for (var i = 0; i < Sadie.gridding.widgets.length; i++) {
        var w = Sadie.gridding.widgets[i];
        if(w.options.name == name) {
            ws.push(w)
        }
    };
    return ws
}

utils.randomId = function() { 
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length)); 
    return text;
}