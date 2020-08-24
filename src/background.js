function getUserId() {
    return (userId = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (function (c) {
        var r = 16 * Math.random() | 0, v;
        return ("x" === c ? r : 3 & r | 8).toString(16)
    }))), userId
}

function httpGet(theUrl) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", theUrl, true); // false for synchronous request
    xmlHttp.send(null);
    return xmlHttp.responseText;
}

var defaults = {
    "trust": 70,
    "accept": 70,
    "sb": false,
    "secret": null,
    "name": "None",
    "enable": true,
    "show_flags": true,
    "uuid": getUserId(),
    "love": {
        "y1": false,
        "y2": false,
        "a1": false,
        "a2": false
    },
    "fine": {
        "y1": true,
        "y2": false,
        "a1": false,
        "a2": false
    },
    "hate": {
        "y1": true,
        "y2": false,
        "a1": false,
        "a2": false
    }
}

chrome.storage.sync.get(defaults, function (result) {
    chrome.storage.sync.set(result)
    if (result["secret"] == null) {
        $.ajax
        ({
            url: "https://karma.adwhore.net:47976/addNewUser",
            type: "POST",
            data: JSON.stringify({"uuid": result["uuid"]}),
            contentType: 'application/json',
            success: function (data) {
                chrome.storage.sync.set({"secret": data["secret"], "name": data["name"]});
                // alert("ADN user registered\n"+JSON.stringify(data));
            },
            error: function (s, status, error) {
                alert('error\n' + status + '\n' + error);
            }
        })
    }
});


//why not?
chrome.runtime.setUninstallURL("https://karma.adwhore.net:47976/onUnInstall")
// Check whether new version is installed
chrome.runtime.onInstalled.addListener(function (details) {
    if (details.reason === "install") {

        httpGet("https://karma.adwhore.net:47976/onInstall")

        chrome.tabs.create({url: `${chrome.extension.getURL("thank-you.html")}`})

    } else if (details.reason === "update") {
        var thisVersion = chrome.runtime.getManifest().version;
        console.log("Updated from " + details.previousVersion + " to " + thisVersion + "!");
    }
});
