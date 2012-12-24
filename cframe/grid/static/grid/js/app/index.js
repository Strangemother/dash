$(document).ready(function(){
    require(['gridding'], function(){
        gridding.createGrid(gridding.layout());
    })

    page.appendWidgets(['add']);

    $('.add-button').click(function(){
        $('.tools').show();
    });
})


Sadie = {};
utils = {};


utils.randomId = function() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length)); 
    return text;
}