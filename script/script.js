
/*
*   Project Name: WordHelper
*   Author: Ran Aizen
*   Date: 2013-11-30
*   this is a JavaScript file for app.html
*   Ran(c)copyright 2013
*/

//Initialization works

(function (global) {

    var error = null;
    //this['document'] || (error = {});

    //prepare for the database
    var sessions = {};
    var database = global.localStorage || null;
    //database || (error = {});
    
    //create Utils
    var $id = function (arg) { 
            return this.document.getElementById(arg);
        },
        $class = function (arg) { 
            return this.document.getElementsByClassName(arg);
        },
        $tag = function (arg) { 
            return this.document.getElementsByTagName(arg);
        },
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

    function Collection(collection) {
        this.name = collection;
        this.docs = JSON.parse(database.getItem(collection)) || {};
        var count = 0;
        for (var i in this.docs)
            count++;
        this.count = count;
    }

    Collection.prototype = {
        findItem: function (item) {
            if (!item) return null;
            return this.docs[item] || null;
        },
        insertItem: function (item, doc) {
            if (!item) return null;
            this.docs[item] = doc;
            db.sync(this.name);
            this.count++;
            return doc;
        },
        removeItem: function (item) {
            if (!item) return null;
            this.docs[item] && delete this.docs[item];
            db.sync(this.name);
            this.count--;
        },
        getRandomItem: function (depends) {
            if (depends.testNum > this.count) {
                return this.docs[depends.all[Math.round(Math.random() * 10000) % this.count]];
            }
            while (true) {
                var num = Math.round(Math.random() * 10000) % this.count;
                if (depends.details.indexOf(depends.all[num]) == -1)
                    break;
            }
            return this.docs[depends.all[num]];
        },
        toArray: function () {
            var arr = [];
            for (var i in this.docs)
                arr.push(this.docs[i].word);
            return arr;
        },
        isExsit: function (word) {
            var f = Boolean(this.findItem(word));
            return f;
        }
    };

    //database operation defined
    var db = {
        all: new Collection('words'),
        wrong: new Collection('wrongwords'),
        list: {
            words: 'all',
            wrongwords: 'wrong'
        },
        sync: function (collection) {
            if (collection) {
                database['words'] = JSON.stringify(this['all'].docs);
                database['wrongwords'] = JSON.stringify(this['wrong'].docs);
            } else {
                database[collection] = JSON.stringify(this[list[collection]].docs);
            }
        }
    };

    //the btn' id name hash list
    var actionList = {
        'viewall': viewAll,
        'viewwrong': viewWrong,
        'start': startTest,
        /*'guide': guide,*/
        'add': addWord,
        'remove': removeWord,
        'wordslist': bindClick
    };

    //bind callback for panel's children
    global.addEventListener('click', callback);

    //callback of app's Click' event
    function callback(e) {
        var targetId = e.target.getAttribute('id');
        if (!targetId && e.target.nodeName.toLowerCase() == 'a') 
            targetId = 'wordslist';
        //router handler by hash list
        actionList[targetId] && actionList[targetId](e.target);
    }

    function viewAll(target) {
        var collection = db.all.docs || null;
        if (!collection) return;
        var feedback = $id('feedback');
        feedback.innerHTML = '';

        var wordsList = createE('ul');
        wordsList.setAttribute('id', 'wordslist');
        wordsList.setAttribute('class', 'nav nav-pills nav-stacked');

        for (var word in collection) {
            var item = createE('li');
            var a = createE('a');
            var text = createT(word);
            a.setAttribute('href', '#');
            a.appendChild(text);
            item.appendChild(a);
            wordsList.appendChild(item);
        }
        feedback.appendChild(wordsList);
    }

    function viewWrong(target) {
        var collection = db.wrong.docs || null;
        if (!collection) return;
        var feedback = $id('feedback');
        feedback.innerHTML = '';

        var  wordsList = createE('ul');
        wordsList.setAttribute('id', 'wordslist');
        wordsList.setAttribute('class', 'nav nav-pills nav-stacked');

        for (var word in collection) {
            var item = createE('li');
            var a = createE('a');
            var text = createT(word);
            a.setAttribute('href', '#');
            a.appendChild(text);
            item.appendChild(a);
            wordsList.appendChild(item);
        }
        feedback.appendChild(wordsList);
    }

    function startTest(target) {
        var testNum = $id('testnum').value;
        (typeof testNum != 'number') && (testNum > 0) && started(testNum)
    }

    /*function guide(target) {
        showLightBox();
    }*/

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

    function bindClick(target) {
        var tarName = target.nodeName.toLowerCase();
        if (tarName != 'a') return;

        var board = $id('board');
        text = target.textContent;
        var wordObj = db.all.findItem(text);
        board.innerHTML = '';

        var h2 = createE('h2'),
            p1 = createE('p'),
            p2 = createE('p');
        var h2_text = createT(wordObj.word),
            p1_text = createT('词性：' + wordObj.property),
            p2_text = createT('汉义：' + wordObj.meaning);

        h2.appendChild(h2_text);
        p1.appendChild(p1_text);
        p2.appendChild(p2_text);
        board.appendChild(h2);
        board.appendChild(p1);
        board.appendChild(p2);
    }

    function started(testNum) {
        var board = $id('board');
        sessions['details'] = [];
        sessions['testNum'] = testNum;
        sessions['all'] = db.all.toArray();
        sessions['wrong'] = [];
        var commit = $id('commit');
        var input = $id('input');
        input.disabled = false;
        commit.disabled = false;
        actionList['commit'] = comYourAns;

        if ($id('progress')) $id('progress').parentNode.remove();
        var progressbar = createE('div');
        var progress = createE('div');
        progressbar.setAttribute('class', 'progress');
        progress.setAttribute('id', 'progress');
        progress.setAttribute('class', 'progress-bar progress-bar-success');
        progress.setAttribute('role', 'progressbar');
        progress.setAttribute('aria-valuemin', '0');
        progress.setAttribute('aria-valuemax', testNum);
        progressbar.appendChild(progress);
        board.parentNode.appendChild(progressbar);
        nextTest(sessions);
    }

    function committed(answer) {
        var currentNum = sessions.details.length;
        var testNum = sessions.testNum;
        var progress = $id('progress');
        progress.setAttribute('style', 'width: ' + (currentNum / testNum)*100 + '%');
        subscribe(answer);
        $id('input').value = '';
        $id('input').focus();
        if (currentNum >= testNum) {
            var commit = $id('commit');
            var input = $id('input');
            input.disabled = true;
            commit.disabled = true;
            delete actionList['commit'];
            remark();
            return;
        }
        nextTest(sessions);
    }

    function nextTest(sessions) {
        var board = $id('board');
        board.innerHTML = '';
        var wordObj = db.all.getRandomItem(sessions);
        sessions.details.unshift(wordObj.word);
        var p1 = createE('p'),
            p2 = createE('p');
        var p1_text = createT('词性：' + wordObj.property),
            p2_text = createT('词义: ' + wordObj.meaning);

        p1.appendChild(p1_text);
        p2.appendChild(p2_text);
        board.appendChild(p1);
        board.appendChild(p2);
    }

    /*function showLightBox() {

    }*/

    function added(newword, property, transfer) {
        var newword_text = $id('newword').value,
            property_text = $id('property').value,
            transfer_text = $id('transfer').value;
        var doc = {
            word: newword_text,
            property: property_text,
            meaning: transfer_text
        };
        db.all.isExsit(newword_text) || db.all.insertItem(newword_text, doc);
        $id('newword').value = '';
        $id('property').value = '';
        $id('transfer').value = '';
        $id('newword').focus();
    }

    function removed(oldword) {
        var oldword = $id('oldword').value;
        db.all.removeItem(oldword);
        db.wrong.removeItem(oldword);
        $id('oldword').value = '';
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
            text.textContent += 'Perfact! Answer Right!'
        } else {
            sessions['wrong'].push(rightAns);
            var item = db.all.findItem(rightAns);
            db.wrong.findItem(rightAns) || db.wrong.insertItem(rightAns, item);
            alert.setAttribute('class', 'alert alert-danger');
            text.textContent += ('Ooh~, Sorry u r Wrong, the right answer is ' + rightAns);
        }
        alert.appendChild(text);
        feedback.appendChild(alert);
    }

    function remark() {
        var feedback = $id('feedback');
        feedback.innerHTML = '';

        var alert = createE('div');
        alert.setAttribute('class', 'alert alert-info');
        
        var h2 = createE('h2');
        var title = createT('测试结束～');
        h2.appendChild(title);
        alert.appendChild(h2);
        alert.appendChild(createE('br'));

        var rightNum = sessions.testNum - sessions.wrong.length;
        alert.appendChild(createT('本次测试单词总数：' + sessions.testNum));
        alert.appendChild(createE('br'));
        alert.appendChild(createT('正确回答数：' + rightNum));
        alert.appendChild(createE('br'));
        alert.appendChild(createT('回答错误：' + sessions.wrong.length));
        alert.appendChild(createE('br'));
        alert.appendChild(createT('正确率：' + Math.round((rightNum / sessions.testNum) * 100) + '%'));
        alert.appendChild(createE('br'));
        
        feedback.appendChild(alert);
    }

    return console.log("%cInitialization successful~", "font-size: 15px; color: green");
})(this);