var selected = [];

var emptyDOM = function(dom) {
    while (dom.firstChild) {
        dom.removeChild(dom.firstChild);
    }
}

var removeFromList = function(e) {
    var key = e.target.getAttribute("data-key");
    selected.splice(selected.indexOf(key), 1);
    refreshSelected();
}

var refreshSelected = function() {
    var listDOM = document.getElementById("selectedList");
    emptyDOM(listDOM);

    for (var i = 0; i < selected.length; i++) {
        var li = document.createElement("li");
        li.innerHTML = characters[selected[i]].name;
        li.setAttribute("data-key", selected[i]);
        li.onclick = removeFromList;

        listDOM.appendChild(li);
    }
    console.log(selected);
}

var addToList = function(e) {
    selected.push(e.target.getAttribute("data-key"));

    refreshSelected();
}

window.onload = function() {
    var listDOM = document.getElementById("availableList");

    var ckeys = Object.keys(characters);
    for (var i = 0; i < ckeys.length; i++) {
        var li = document.createElement("li");
        li.innerHTML = characters[ckeys[i]].name;
        li.setAttribute("data-key", ckeys[i]);
        li.onclick = addToList;

        listDOM.appendChild(li);
    }

    var submitBtn = document.getElementById("submit");
    submitBtn.onclick = function() {
        var request = 'api/new.php?profile='+selected.join(",");

        var xhr = new XMLHttpRequest();
        xhr.open('GET', request);
        xhr.onload = function() {
            if (xhr.status === 200) {
                var obj = JSON.parse(xhr.responseText);
                var resultDOM = document.getElementById("result");
                emptyDOM(resultDOM);

                if (obj.result == 1) {
                    var label = document.createElement("div");
                    label.innerHTML = "请给大家分享此链接以查看自己手牌：";
                    var link = document.createElement("a");
                    var url = window.location.hostname + "/ww/#"+obj.message;
                    link.innerHTML = url;
                    link.setAttribute("href", url);

                    resultDOM.appendChild(label);
                    resultDOM.appendChild(link);
                } else {
                    resultDOM.innerHTML = obj.message;
                }

                console.log(obj);
            } else {
                console.log(xhr.status);
            }
        };
        xhr.send();
    }
}