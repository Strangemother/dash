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
    var _w = widgetData;

    // get installed information
    console.log("index_app::registerWidget::making request for", widgetData.name);
    
    
    jsonResponse('/widget/data/' + widgetData.name + '/', 'GET', {}, function(data){
        console.log('index_app::registerWidget::object returned from ajax');

        // this is where this data should go - although useful.
        _w.context = data

        // User verify, 
        /*
        Returns true/false if is allowed to install.
        */
        var verify = verifyInstall(widgetData)
        // Display dependencies for install info of third party.
        if(!verify) {
            /*
            Verification is not allowed.
            return an object requirejs will use as 
            widgetData. Perhaps a placeholder widget?
            */
            
            // kill
        } else {

            // Check for addon injection to widget data.

            // requirejs register
            // var def = requirejsImport(widgetData)

            // debugger;
            // inject js endpoint for requirejs widget imports


        }
        callback(_w)
    })

    return requirejsImport(widgetData)

}

verifyInstall = function(widgetData) {
    /* Perform checks and ask user if the installation
    can occur.
    failHandler will be called on widgetData.
    */

    // Ask user for allow
    // check blacklist

    // call widgetData.verifyInstallHandler(choice)
        // Call this method when a choice is made

    return true // false
}

requirejsImport = function(widgetData) {
    /*
    Import the widget data - by kinda turning it inside out
    and flipping it on it's head.
    Also, you're receiving raw wridget data - not yet wrapped by a Widget()

    + full advantage of the require js lib,

    require import, pulling dependencies first, calling widgetData.setupHandler(widgetData) 
    */
    
    var dependencies = widgetData.dependencies || [];
    var setupHandler = widgetData.setupHandler || function(widgetData){ return widgetData; };
    // check scope is passed correctly.
   
    return define(dependencies, (function(){
            var newData = setupHandler.apply(this, widgetData);

            if(newData == undefined) {
                return widgetData;
            };

            return newData;
        }.apply({
            /* Base widget Scope */
            developer: 'fishy',
            widgetData: widgetData,
            setupHandler: setupHandler
        }) 

    ))
}

ASSET_IMG_URL = '/static/grid/img/';