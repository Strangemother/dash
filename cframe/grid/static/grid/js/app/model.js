Sadie.model = {
    defaultBackgroundColor: '#fff',
    hammerTouchReceivers: [],
    spaceData: {},
    add: function(key, value) {
        /*
        Add a data key to the model =D
        */
        return Sadie.model.spaceData[ String('default-' + key) ] = value;
    },
    get: function(key) {
        return Sadie.model.spaceData[ String('default-' + key) ];
    },
    addToSpace: function(namespace, key, value) {
        return Sadie.model.spaceData[ String(namespace + '-' + key) ] = value;
    },
    getFromSpace: function(namespace, key) {
        return Sadie.model.spaceData[ String(namespace + '-' + key) ];
    }
}
