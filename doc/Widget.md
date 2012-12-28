# Widget

in your applications ./main.js you can define your widget using multiple methods.

## Object format

You can define your widget as an object 

    registerWidget({
        name: 'widget name'
        // ...
    });

This is great for clarity, but to utilise the context data passed to the widget you can define your widget as a function and return a widget object

    registerWidget(function(context){
        data = {
            name: context.foo + ' widget';
            // ...
        };

        return data;
    });