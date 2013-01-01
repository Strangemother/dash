gridding = {}
Sadie.gridding=gridding;

gridding.createGrid = function(serializeParams){
    var unDragHooks = [];
    $(".gridster ul").gridster({
        widget_margins: [10, 10],
        widget_base_dimensions: [200, 200],
        draggable: {
            start: function(e, ui) { 
                $(ui.helper).data().reference().dragging(true)
            },
            stop: function(e, ui) { 
                for (var i = 0; i < unDragHooks.length; i++) {
                    unDragHooks[i].dragging(false);
                };
                //$(ui.helper).data().reference(ui).dragging(false)
            }
        },
        serialize_params: serializeParams
    });
    gridding.grid = $(".gridster ul").gridster().data('gridster');
}

gridding.widgets = [];

gridding.addWidget = function(){
    /*
    Receive wudget data to be applied to a Widget class
    and placed on the current grid.
    */
    var widget = arg(arguments, 0, null);
    var context = arg(arguments, 1, {})

    var gridster = $(".gridster ul").gridster().data('gridster');  
    
    if(typeof(widget) == 'string') {
        var widgetName = widget;
        require(['app/Widget', 'widget/'+ widgetName +'/main'],
            function () {
                require(['app/Widget'], function(){
                    wid = Widget(widget, context);
                    wid.addToGrid(gridster); 
                    gridding.widgets.push(wid)
                })
         });

    } else {
        require(['app/Widget'], function(){
            wid = Widget(widget, context);
            wid.addToGrid(gridster); 
            gridding.widgets.push(wid)
        })


    }


    //var _gravel = $('.gravel-templates .add-widget').gravel()[0]
    //_gravel.addButton('Step One', function(){
//      this.close();
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
