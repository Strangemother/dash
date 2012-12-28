registerWidget(function(context){
    WIDGET = {
        /* By default this is true unless set false */
        name: 'add',
        // backgroundColor: '#0BF15E',
        closedIcon: context.assetPath + 'add.svg',
        closedText: 'Add',
        openIcon: context.assetPath + 'add.svg',
        openText: 'New Widget.',
        highlightColor: '#3CA24C',
        openHandler: function(){
        },
        pageLoadHandler: function(element){
            //page.fullalert('Add or upload a widget to use on the dash',
                //'A second line.' , 'creation.svg')
            $(element).find('.widget-interface-button').die('click').click(function(){
                // add widget
                Sadie.page.appendWidget({pk: $(this).data('id'),
                                        path: $(this).data('path'),
                                        name: $(this).data('name')})
                
            })
        },
        touchHandler: function(ev){
            if(ev.type != 'release') {
                this.text().text(ev.type);
                //console.log('Hello world heard', ev.type);
                //console.log(this)

                if(ev.type == 'doubletap') this.toggleState();
            }
        },
        onClick: function(event, options) {
            this.toggleHighlight();
        },
        onDoubleClick: function(event, options) {
            this.toggleState();
        }
    }

    return WIDGET;
});