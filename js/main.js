var storageAvailable = function(type) {
    try {
        var storage = window[type],
            x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    } catch(e) {
        return false;
    }
}

var getClientID = function() {
    if (storageAvailable('localStorage')) {
        if (!localStorage.getItem('clientID')) {
            localStorage.setItem('clientID', 0);
        }
        return localStorage.getItem('clientID');
    } else {
        return -1;
    }
}

var setClientID = function(val) {
    localStorage.setItem('clientID', val);
}

window.onload = function() {
    var clientID = getClientID();
    var resultDiv = document.getElementById('result');
    var msgDiv = document.getElementById('message');
    if (clientID == -1) {
        resultDiv.innerHTML = '不支持的設備';
    } else {
        var game = window.location.hash.substr(1);
        var request = 'api/main.php?game='+game+'&cid='+clientID;

        var xhr = new XMLHttpRequest();
        xhr.open('GET', request);
        xhr.onload = function() {
            if (xhr.status === 200) {
                var obj = JSON.parse(xhr.responseText);

                if (obj.result == "Fail") {
                    console.log(xhr);
                    window.location.replace("./new.html");
                } else {

                    if (obj.hasOwnProperty("assignedID")) {
                        setClientID(obj.assignedID);
                    }

                    var role = obj.message;
                    if (characters.hasOwnProperty(obj.message) == true) {
                        role = characters[obj.message].name;

                        var imgDiv = document.getElementById('image');
                        var image = document.createElement("img");
                        image.setAttribute("src", characters[obj.message].img);
                        imgDiv.appendChild(image);
                    }
                    msgDiv.innerHTML = role;
                }
            } else {
            }
        };
        xhr.send();
    }
}
