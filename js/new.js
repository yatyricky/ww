var selected = [];

var emptyDOM = function(dom) {
    while (dom.firstChild) {
        dom.removeChild(dom.firstChild);
    }
}

var removeFromList = function(e) {
    var key = e.currentTarget.getAttribute("data-key");
    selected.splice(selected.indexOf(key), 1);
    refreshSelected();
}

var refreshSelected = function() {
    var listDOM = document.getElementById("selectedList");
    emptyDOM(listDOM);

    for (var i = 0; i < selected.length; i++) {
        var li = document.createElement("li");
        var lidiv = document.createElement("div");
        var liimg = document.createElement("img");
        lidiv.innerHTML = characters[selected[i]].name;
        liimg.setAttribute("src", characters[selected[i]].img)
        li.appendChild(liimg);
        li.appendChild(lidiv);
        li.setAttribute("data-key", selected[i]);
        li.onclick = removeFromList;

        listDOM.appendChild(li);
    }
}

var addToList = function(e) {
    selected.push(e.currentTarget.getAttribute("data-key"));

    refreshSelected();
}

var renderResult = function(id) {
    // hide button
    var submitBtn = document.getElementById("submit");
    var resultDOM = document.getElementById("result");
    var container = document.getElementById("container");
    emptyDOM(resultDOM);
    container.removeChild(submitBtn);

    var label = document.createElement("div");
    label.setAttribute("class", "qrcode");
    var link = document.createElement("a");
    var share = "http://"+window.location.hostname + "/ww/#" + id;
    new QRCode(label, share);
    var url = "index.html#" + id;
    link.innerHTML = share;
    link.setAttribute("href", url);


    resultDOM.appendChild(label);
    resultDOM.appendChild(link);
}

var loadExistingGame = function() {
    var game = window.location.hash.substr(1);
    var request = 'api/getgame.php?game='+game;

    var xhr = new XMLHttpRequest();
    xhr.open('GET', request);
    xhr.onload = function() {
        if (xhr.status === 200) {
            selected = JSON.parse(xhr.responseText);
            if (selected.length > 0) {
                refreshSelected();
                renderResult(game);
            }
        } else {
        }
    };
    xhr.send();
}

window.onload = function() {
    var listDOM = document.getElementById("availableList");

    var ckeys = Object.keys(characters);
    for (var i = 0; i < ckeys.length; i++) {
        var li = document.createElement("li");
        var lidiv = document.createElement("div");
        var liimg = document.createElement("img");
        lidiv.innerHTML = characters[ckeys[i]].name;
        liimg.setAttribute("src", characters[ckeys[i]].img)
        li.appendChild(liimg);
        li.appendChild(lidiv);
        li.setAttribute("data-key", ckeys[i]);
        li.onclick = addToList;

        listDOM.appendChild(li);
    }

    loadExistingGame();

    var submitBtn = document.getElementById("submit");
    var resultDOM = document.getElementById("result");
    submitBtn.onclick = function() {
        var request = 'api/new.php?profile='+selected.join(",");

        var xhr = new XMLHttpRequest();
        xhr.open('GET', request);
        xhr.onload = function() {
            if (xhr.status === 200) {
                var obj = JSON.parse(xhr.responseText);
                
                emptyDOM(resultDOM);

                if (obj.result == 1) {
                    renderResult(obj.message);
                } else {
                    resultDOM.innerHTML = obj.message;
                }

            } else {
            }
        };
        xhr.send();
    }
}