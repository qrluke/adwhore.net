let baseUrl = "https://karma.adwhore.net:47976"

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
    "sb": false,
    "secret": null,
    "likes": 0,
    "segments": 0,
    "moderator": 0,
    "name": "None",
    "enable": true,
    "mode": 1,
    "lazy": false,
    "show_flags": true,
    "show_panel": true,
    "uuid": getUserId(),
    "custom": {
        "trust": 70,
        "accept": 70,
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
            "y2": true,
            "a1": false,
            "a2": false
        }
    },
    "last_channel": {
        "name": "",
        "cID": ""
    },
    "whitelist": [],
    "stats": {
        "global_users": 0,
        "global_segs": 0,
        "global_skips": 0,
        "global_moderated": 0,
        "global_time": 0
    }
}

chrome.storage.sync.get(defaults, function (result) {
    chrome.storage.sync.set(result)
    if (result["secret"] == null) {
        $.ajax
        ({
            url: `${baseUrl}/api/v0/addNewUser`,
            type: "POST",
            data: JSON.stringify({"uuid": result["uuid"]}),
            contentType: 'application/json',
            success: function (data) {
                chrome.storage.sync.set({"secret": data["secret"], "name": data["name"], "side": data["side"]});
                // alert("ADN user registered\n"+JSON.stringify(data));
            },
            error: function (s, status, error) {
                alert('error\n' + status + '\n' + error);
            }
        })
    } else {
        setTimeout(function getServiceStatus() {
            $.getJSON(`${baseUrl}/api/v0/getStatus`, function (data) {
                console.log(data)
            });
            setTimeout(getServiceStatus, 300000);
        }, 1000);
    }
});


//why not?
chrome.runtime.setUninstallURL(`${baseUrl}/api/v0/onUnInstall?locale=${chrome.i18n.getMessage('@@ui_locale')}`)
// Check whether new version is installed
chrome.runtime.onInstalled.addListener(function (details) {
    if (details.reason === "install") {

        httpGet(`${baseUrl}/onInstall`)

        chrome.tabs.create({url: `${chrome.extension.getURL("wizard/wizard.html")}`})

    } else if (details.reason === "update") {
        var thisVersion = chrome.runtime.getManifest().version;
        console.log("Updated from " + details.previousVersion + " to " + thisVersion + "!");
    }
});
