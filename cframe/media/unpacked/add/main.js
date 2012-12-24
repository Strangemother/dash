WIDGET = {
    /* By default this is true unless set false */
    
    name: 'Add',
    closedIcon: '/static/img/icons/add.svg',
    closedText: 'Add',
    openIcon: '/static/img/icons/add.svg',
    openText: 'New Widget.',
    highlightColor: '##0BF15E',

    visibleHandler: function(){
        page.fullalert('Add or upload a widget to use on the dash',
            'A second line.' , 'creation.svg')
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
        this.toggleHighlight()
    },
    onDoubleClick: function(event, options) {
        this.toggleState();
    }
}

registerWidget(WIDGET)