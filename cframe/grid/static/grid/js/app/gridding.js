gridding = {}
Sadie.gridding=gridding;

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
    if(typeof(widget) == 'string') {
        // Start the main app logic.
        require(['widget/'+ widget +'/main'],
            function (widget) {
                //jQuery, canvas and the app/sub module are all
                //loaded and can be used here now.
                console.log("Add after requiest");
                debugger
                // what is scope here.
                // make cstome scope.
                wid = Widget(gridster, widget);
                wid.addToGrid();
         });
    } else {
        wid = Widget(gridster, widget);
        wid.addToGrid();
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
