chrome.storage.sync.get(["uuid", "secret"], function (result) {
        if (result["secret"] == null) {
            $.ajax
            ({
                url: "https://karma.adwhore.net:47976/addNewUser",
                type: "POST",
                data: JSON.stringify({"uuid": result["uuid"]}),
                contentType: 'application/json',
                success: function (data) {
                    chrome.storage.sync.set({"secret": data["secret"], "name": data["name"]});
                    //alert("Registered\n"+JSON.stringify(data));
                },
                error: function (s, status, error) {
                    alert('error\n' + status + '\n' + error);
                }
            })
        }
    }
)


function selectSide(id) {
    chrome.storage.sync.get(["secret"], function (result) {
            if (result["secret"] != null) {
                $.ajax
                ({
                    url: "https://karma.adwhore.net:47976/switchUserSide",
                    type: "POST",
                    data: JSON.stringify({"secret": result["secret"], "side": id}),
                    contentType: 'application/json',
                    success: function (data) {
                        chrome.storage.sync.set({"secret": data["secret"], "name": data["name"]});
                        alert("side selected\n" + JSON.stringify(data));
                        window.open("https://www.youtube.com", "_self")
                    },
                    error: function (s, status, error) {
                        alert('error\n' + status + '\n' + error);
                    }
                })
            }
        }
    )
}

document.getElementById("faction_1_button").addEventListener("click", function () {
    selectSide(1)
})

document.getElementById("faction_2_button").addEventListener("click", function () {
    selectSide(2)
})

document.getElementById("faction_3_button").addEventListener("click", function () {
    selectSide(3)
})



