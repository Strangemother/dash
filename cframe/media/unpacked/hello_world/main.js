
registerWidget({
    /* By default this is true unless set false */
    name: 'Hello World',
    closedIcon: 'hello.svg',
    closedText: 'Hello',
    openIcon: 'world.svg',
    openText: 'World.',
    highlightColor: '#2E454D',

    visibleHandler: function(){
        page.fullalert('Hello World Widget Created',
            'Some widgets can show a popup when they are first created.' , 'creation.svg')
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
        this.toggleState();
    },
    onDoubleClick: function(event, options) {
        //this.toggleHighlight()
    }
})
