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
    if (clientID == -1) {
        resultDiv.innerHTML = 'Get yourself a fucking new phone!';
    } else {
        var game = window.location.hash.substr(1);
        var request = 'api/main.php?game='+game+'&cid='+clientID;

        console.log("request = " + request);

        var xhr = new XMLHttpRequest();
        xhr.open('GET', request);
        xhr.onload = function() {
            if (xhr.status === 200) {
                var obj = JSON.parse(xhr.responseText);

                if (obj.hasOwnProperty("assignedID")) {
                    setClientID(obj.assignedID);
                }

                resultDiv.innerHTML = obj.result;
                var msgDiv = document.getElementById('message');
                var role = obj.message;
                if (characters.hasOwnProperty(obj.message) == true) {
                    role = characters[obj.message].name;

                    var imgDiv = document.getElementById('image');
                    var image = document.createElement("img");
                    image.setAttribute("src", characters[obj.message].img);
                    imgDiv.append(image);
                }
                msgDiv.innerHTML = role;

                console.log(obj);
            } else {
                console.log(xhr.status);
            }
        };
        xhr.send();
    }
}