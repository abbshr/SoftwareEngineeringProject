
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
        },
        getRandomItem: function (depends) {

        },
        getCounter: function () {
            return database.length;
        }
    };

    //get frame & btn will be used 
    var btnGroup = $id('btngrp'),
        commit = $id('commit'),
        profile = $id('profile');

    //the btn' id name hash list
    var actionList = {
        'viewall': viewAll,
        'viewwrong': viewWrong,
        'start': startTest,
        'guide': guide,
        'add': addWord,
        'remove': removeWord,
        'wordslist': bindClick,
    };

    //bind callback for panel's children
    global.addEventListener('click', callback);

    //callback of app's Click' event
    function callback(e) {
        var targetId = e.target.getAttribute('id');
        //router handler by hash list
        actionList[targetId] && actionList[targetId](e.target);
    }

    function viewAll(target) {
        var collection = db.getCollection('words').docs || null;
        if (!collection) return;
        var feedback = $id('feedback');
        feedback.innerHTML = '';

        var wordsList = createE('ul');
        wordsList.setAttribute('id', 'wordslist');
        wordsList.setAttribute('class', '');

        for (var word in collection) {
            var item = createE('li');
            var text = createT(word);
            item.setAttribute('class', '');
            item.appendChild(text);
            wordsList.appendChild(item);
        }
    }

    function viewWrong(target) {
        var collection = db.getCollection('wrongWords').docs || null;
        if (!collection) return;
        var feedback = $id('feedback');
        feedback.innerHTML = '';

        var  wordsList = createE('ul');
        wordsList.setAttribute('id', 'wordslist');
        wordsList.setAttribute('class', '');

        for (var word in collection) {
            var item = createE('li');
            var text = createT(word);
            item.setAttribute('class', '');
            item.appendChild(text);
            wordsList.appendChild(item);
        }
    }

    function startTest(target) {
        var testNum = $id('testnum').value;
        verify(testNum) && started(testNum)
    }

    function guide(target) {
        showLightBox();
    }

    function comYourAns(target) {
        var answer = $id('input').value;
        verify(answer) && committed(answer)
    }

    function addWord(target) {
        var newword = $id('newword').value,
            property = $id('property').value,
            transfer = $id('transfer').value;

        (verify(newword) && verify(property) && verify(transfer)) 
        && added(newword, property, transfer)   
    }

    function removeWord(target) {
        var oldword = $id('oldword').value;
        verify(oldword) && removed(oldword)
    }

    function bindEvent(target) {
        var tarName = target.nodeName.toLowerCase();
        if (tagName != 'li') return;

        var board = $id('board');
        text = target.textContent;
        var wordObj = db.getCollection('words').findItem('text');
        board.innerHTML = '';

        var h2 = createE('h2'),
            p1 = createE('p'),
            p2 = createE('p');
        var h2_text = createT(wordObj.word),
            p1_text = createT(wordObj.property),
            p2_text = createT(wordObj.meaning);

        h2.appendChild(h2_text);
        p1.appendChild(p1_text);
        p2.appendChild(p2_text);
        board.appendChild(h2);
        board.appendChild(p1);
        board.appendChild(p2);
    }

    function started(testNum) {
        sessions['details'] = [];
        sessions['testNum'] = testNum;
        //commit按钮解禁
        var commit = $id('commit');
        actionList['commit'] = comYourAns;

        /*var board = $id('board');
        board.innerHTML = '';*/

        var progressbar = $id('div');
        var progress = $id('div');
        progressbar.setAttribute('class', 'progress');
        progress.setAttribute('id', 'progress');
        progress.setAttribute('class', 'progress-bar progress-bar-success');
        progress.setAttribute('role', 'progressbar');
        progress.setAttribute('aria-valuemin', '0');
        progress.setAttribute('aria-valuemax', testNum);

        progressbar.appendChild(progress);
        //board.appendChild(progressbar);

        nextTest(sessions);
    }

    function committed(answer) {
        var currentNum = sessions.details.length;
        var testNum = sessions.testNum;
        var progress = $id('progress');
        progress.setAttribute('style', 'width: ' + (currentNum / testNum)*100 + '%');
        subscribe(answer);
        nextTest(sessions);

        if (sessions.details.length === sessions.testNum) {
            var commit = $id('commit');
            //按钮加禁
            delete actionList['commit'];
        }
    }

    function added(newword, property, transfer) {}

    function removed(oldword) {}

    function nextTest(sessions) {

        var board = $id('board');
        board.innerHTML = '';
        var wordObj = db.getCollection('words').getRandomItem(sessions.details);
        sessions.details.push(wordObj.word);

        var h2 = createE('h2'),
            p1 = createE('p'),
            p2 = createE('p');
        var h2_text = createT(wordObj.word),
            p1_text = createT(wordObj.property),
            p2_text = createT(wordObj.meaning);

        h2.appendChild(h2_text);
        p1.appendChild(p1_text);
        p2.appendChild(p2_text);
        board.appendChild(h2);
        board.appendChild(p1);
        board.appendChild(p2);

    }

    function showLightBox() {

    }

    function verify(value) {
        if (value == 0 && !(/0/i).test(value))
            return false;
        return true;
    }

    function subscribe(answer) {
        var feedback = $id('feedback');
        feedback.innerHTML = '';
        var alert = createE('div');
        var text = createT('Result:');

        var rightAns = sessions.details[0];
        if (answer == rightAns) {
            alert.setAttribute('class', 'alert alert-success');
            text.textContent = 'Perfact! Answer Right!'
        } else {
            alert.setAttribute('class', 'alert alert-danger');
            text.textContent = 'Ooh~, Sorry u r Wrong';
        }
        alert.appendChild(text);
        feedback.appendChild(alert);
    }

    return console.log("Initialization successful~");
})(this);