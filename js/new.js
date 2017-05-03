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
                    var label = document.createElement("div");
                    label.innerHTML = "请给大家分享此链接以查看自己手牌：";
                    var link = document.createElement("a");
                    var share = window.location.hostname + "/ww/#" + obj.message;
                    var url = "index.html#" + obj.message;
                    link.innerHTML = share;
                    link.setAttribute("href", url);


                    resultDOM.appendChild(label);
                    resultDOM.appendChild(link);
                } else {
                    resultDOM.innerHTML = obj.message;
                }

            } else {
            }
        };
        xhr.send();
    }
}