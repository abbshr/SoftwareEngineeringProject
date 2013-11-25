
/*
*   Project Name: WordHelper
*   Author: Ran Aizen
*   Date: 2013-11-25
*   Members: []
*   this is a JavaScript file for app.html
*   Ran(c)copyright 2013
*/

//Initialization works

(function (global) {

    var error = null;
    this['document'] || error = {};

    //prepare for the database
    var sessions = {};
    var database = global.localStroge || null;
    database || error = {};
    
    //create Utils
    var $id = this.document.getElementById,
        $class = this.document.getElementsByClassName,
        $tag = this.document.getElementsByTagName,
        log = function (errorType, reason) {
            console.log('%c' 
                + errorType 
                + ': %c' 
                + reason, 
                "color: red", "color: brown");
        };

    //get frame & btn will be used 
    var app = $id('app'),
        panel = $id('mainpanel'),
        viewer_btn = $id('viewdatabase'),
        add_btn = $id('add'),
        remove_btn = $id('remove'),
        start_btn = $id('start'),
        /*profile = $id('profile'),
        conf = $id('conf'),
        plus = $id('plus'),*/
        activebox = $id('activebox');

    var actionList = {};

    function callback(e) {
        actionList[e.target](e);
    }

    function startTest(e) {}

    function addWords(e) {}

    function delWords(e) {}

    function viewAllWords(e) {}

    function subscribe(e) {}

    //bind callback for panel's children
    panel.addEventListener('click', callback);
    //profile.addEventListener('click', callback);

    return console.log("Initialization successful~");
})(this);