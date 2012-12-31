requirejs.config({
    //By default load any module IDs from js/lib
    baseUrl: '/static/grid/js',
    //except, if the module ID starts with "app",
    //load it from the js/app directory. paths
    //config is relative to the baseUrl, and
    //never includes a ".js" extension since
    //the paths config could be for a directory.
    paths: {
        'static': '../../js',
        'widget': '/media/unpacked'
    }
});
 
registerWidget = function (widgetData){
    /*method used to import a Custom widget through require.js*/
    //also scoped
    // console.log("registerWidget");
    /*
    Provide a scope to the widget.
    */
    var callback = arg(arguments, 1, function(){});
    console.log("register widget")
    var _w = widgetData;

    // TODO: It's a bad idea to execute the function here.
    // consider removing this functionality so dependencies are correctly
    // attributed.

    // get name
    jsonResponse('/widget/data/' + widgetData.name + '/', 'GET', {}, function(data){
        if(typeof(widgetData) == 'function') {
            // execute function passing context of paths and data
            console.log('registerWidget::f')
            _w = widgetData(data);

        }else {
            console.log('registerWidget::object')
            _w.context = data
        }
        callback(_w)       
        
        var dependencies = ['app/Widget'];
        /* 
        // Push user defined dependencies (if any) into a stack to be called.
        // Cool huh! Depedencies . O.o...
        var _access = _w.dependencies || [];
        for (var i = 0; i < _access.length; i++) {
            dependencies.push(_access[i]);
        };

        define(dependencies, function(){
            return function() { return _w; };
        })
       */
       return _w
    })

}

ASSET_IMG_URL = '/static/grid/img/';