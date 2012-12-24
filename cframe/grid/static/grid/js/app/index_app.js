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
    var f = function(widgetData){

        define(['app/Widget'], function(){ 
            return widgetData;
        })
    }

    f(widgetData)
}

ASSET_IMG_URL = '/static/grid/img/';