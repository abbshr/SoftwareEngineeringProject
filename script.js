
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
        },
        createE = function (tagName) {
            return document.createElement(tagName);
        },
        createT = function (string) {
            string = string || '';
            return document.createTextNode(string);
        };

    //database operation defined
    var db = {
        getCollection: function (collection) {
            collection || return null;
            return new Collection(collection);
        }
    };

    function Collection(collection) {
        this.name = collection;
        this.docs = database.getItem(collection);
    };

    Collection.prototype = {
        findItem: function (item) {
            item || return null;
            return database.getItem(item);
        },
        insertItem: function (item, doc) {
            item || return null;
            return database.setItem(item, doc);
        },
        removeItem: function (item) {
            item || return null;
            return database.removeItem(item);
        }
    };

    //get frame & btn will be used 
    var //app = $id('app'),
        panel = $id('mainpanel'),
        //viewer_btn = $id('viewdatabase'),
        //add_btn = $id('add'),
        //remove_btn = $id('remove'),
        //start_btn = $id('start'),
        profile = $id('profile'),
        //conf = $id('conf'),
        //plus = $id('plus'),
        activebox = $id('activebox');

    //the elements' id name hash list
    var actionList = {
        //'app': ,
        //'mainpanel': ,
        'viewdatabase': viewAllWords,
        'viewwrong': viewWrongWords,
        'add': addWords,
        'remove': delWords,
        'start': startTest,
        'commit': commit
        //'activebox': ,
        //'profile': ,
        //'conf': ,
        //'plus': 
    };

    //callback of panel's 'Click' event
    function callback(e) {
        var targetId = e.target.getAttribute('id');

        //router handler by hash list
        actionList[targetId] && actionList[targetId](e.target);
    }

    //router: callback of start_btn's 'Click' event
    function startTest(target) {}

    //router: callback of add_btn's 'Click' event
    function addWords(target) {
        
    }

    //router: callback of remove_btn's 'Click' event
    function delWords(target) {}

    //router: callback of viewer_btn's 'Click' event
    function viewAllWords(target) {
        var viewer = $id('activebox');
        var words_database = db.getCollection('words');

        for (var word in words_database) {
            var span = createE('span');
            var contact = createT(word + ', ');
            span.setAttribute('class', 'word');
            span.setAttribute('href', 'javascript:void(0)');
            span.appendChild(contact);
            viewer.appendChild(span);
        }

        //bind handler for 'click' event on activebox(viewer)
        viewer.addEventListener('click', showDetails);
    }

    /* callback of activebox(viewer)'s 'Click' e
     * this function will check out the e source name & invoke lightBox()
    */
    function showDetails(e) {
        var target = e.target,
            tarName = target.nodeName.toLowerCase(),
            text = target.textContent;

        var collection = db.getCollection('words'),
            wordDetail = collection.findItem(text);

        (tarName == 'span') && lightBox(target, wordDetail);
    }

    function subscribe(target) {}

    //function getWord(collection) {}

    //function copy(collection) {}

    /* lightBox
    *  display a lightBox to show words details
    *  & auto disappeared it self
    *  @params target: the target DOM Object of event 
    *  @params content: content to be shown
    */
    function lightBox(target, content) {

    }

    //bind callback for panel's children
    panel.addEventListener('click', callback);
    profile.addEventListener('click', callback);
    activebox.addEventListener('click', callback);

    return console.log("Initialization successful~");
})(this);