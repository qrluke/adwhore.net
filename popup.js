document.getElementById('increaseButton1').onclick = function () {
    if (+document.getElementById('displayDiv1').innerText < 100) {
        document.getElementById('displayDiv1').innerText = +document.getElementById('displayDiv1').innerText + 5;
        savePopupSettings();
    }
};
document.getElementById('decreaseButton1').onclick = function () {
    if (+document.getElementById('displayDiv1').innerText > 0) {
        document.getElementById('displayDiv1').innerText = +document.getElementById('displayDiv1').innerText - 5;
        savePopupSettings();
    }
};
document.getElementById('increaseButton2').onclick = function () {
    if (+document.getElementById('displayDiv2').innerText < 100) {
        document.getElementById('displayDiv2').innerText = +document.getElementById('displayDiv2').innerText + 5;
        savePopupSettings();
    }
};
document.getElementById('decreaseButton2').onclick = function () {
    if (+document.getElementById('displayDiv2').innerText > 0) {
        document.getElementById('displayDiv2').innerText = +document.getElementById('displayDiv2').innerText - 5;
        savePopupSettings();
    }
};

document.getElementById('buttonSave1').onclick = function () {
    chrome.storage.sync.get(["name", "secret"], function (result) {
            if (!(result["name"] === document.getElementById("nickname").value)) {
                $.ajax
                ({
                    url: "https://karma.adwhore.net:47976/updateNickname",
                    type: "POST",
                    data: JSON.stringify({"secret": result["secret"], "name": document.getElementById("nickname").value}),
                    contentType: 'application/json',
                    success: function (data) {
                        chrome.storage.sync.set({"name": data["name"]});
                        document.getElementById("nickname").value = data["name"];
                        alert("Success\n" + JSON.stringify(data));
                    },
                    error: function (s, status, error) {
                        alert('error\n' + status + '\n' + error);
                    }
                })
            }

        }
    )
};

document.getElementById('buttonSave2').onclick = function () {
    chrome.storage.sync.get(["name", "secret"], function (result) {
            if (!(result["secret"] === document.getElementById("secret").value)) {
                $.ajax
                ({
                    url: "https://karma.adwhore.net:47976/switchUserSecret",
                    type: "POST",
                    data: JSON.stringify({"secret": document.getElementById("secret").value}),
                    contentType: 'application/json',
                    success: function (data) {
                        chrome.storage.sync.set({"name": data["name"], "secret": data["secret"]});
                        document.getElementById("secret").value = data["secret"];
                        document.getElementById("nickname").value = data["name"];

                        alert("Success\n" + JSON.stringify(data));
                    },
                    error: function (s, status, error) {
                        alert('error\n' + status + '\n' + error);
                    }
                })
            }

        }
    )
};

document.getElementById('buttonNew').onclick = function () {
    chrome.storage.sync.get(["name", "secret"], function (result) {
            $.ajax
            ({
                url: "https://karma.adwhore.net:47976/addNewUser",
                type: "POST",
                data: JSON.stringify({"secret": document.getElementById("secret").value}),
                contentType: 'application/json',
                success: function (data) {
                    chrome.storage.sync.set({"name": data["name"], "secret": data["secret"]});
                    document.getElementById("secret").value = data["secret"];
                    document.getElementById("nickname").value = data["name"];

                    alert("Success\n" + JSON.stringify(data));
                },
                error: function (s, status, error) {
                    alert('error\n' + status + '\n' + error);
                }
            })

        }
    )
};


$('[name="secret"]').focus(function () {
    $(this).attr("type", "text")
});
$('[name="secret"]').blur(function () {
    $(this).attr("type", "password")
});


chrome.storage.sync.get(null, function (result) {
    document.getElementById("hate-y1").checked = result["hate"]["y1"];
    document.getElementById("hate-y2").checked = result["hate"]["y2"];
    document.getElementById("hate-a1").checked = result["hate"]["a1"];
    document.getElementById("hate-a2").checked = result["hate"]["a2"];
    document.getElementById("nickname").value = result["name"];
    document.getElementById("secret").value = result["secret"];


    document.getElementById("fine-y1").checked = result["fine"]["y1"];
    document.getElementById("fine-y2").checked = result["fine"]["y2"];
    document.getElementById("fine-a1").checked = result["fine"]["a1"];
    document.getElementById("fine-a2").checked = result["fine"]["a2"];

    document.getElementById("love-y1").checked = result["love"]["y1"];
    document.getElementById("love-y2").checked = result["love"]["y2"];
    document.getElementById("love-a1").checked = result["love"]["a1"];
    document.getElementById("love-a2").checked = result["love"]["a2"];

    document.getElementById("sb").checked = result["sb"];
    document.getElementById('displayDiv1').innerText = result["trust"];
    document.getElementById('displayDiv2').innerText = result["accept"];
    document.getElementById("enableCheck").checked = result["enable"];
});

checkboxes = document.querySelectorAll("input[type=checkbox]");
for (i = 0; i < checkboxes.length; ++i) {
    checkboxes[i].addEventListener("click", function () {
        savePopupSettings();
    });
}

function savePopupSettings() {
    let new_bool = {
        "sb": document.getElementById("sb").checked,
        "love": {
            "y1": document.getElementById("love-y1").checked,
            "y2": document.getElementById("love-y2").checked,
            "a1": document.getElementById("love-a1").checked,
            "a2": document.getElementById("love-a2").checked
        },
        "fine": {
            "y1": document.getElementById("fine-y1").checked,
            "y2": document.getElementById("fine-y2").checked,
            "a1": document.getElementById("fine-a1").checked,
            "a2": document.getElementById("fine-a2").checked
        },
        "hate": {
            "y1": document.getElementById("hate-y1").checked,
            "y2": document.getElementById("hate-y2").checked,
            "a1": document.getElementById("hate-a1").checked,
            "a2": document.getElementById("hate-a2").checked
        },
        "trust": +document.getElementById('displayDiv1').innerText,
        "accept": +document.getElementById('displayDiv2').innerText,
        "enable": document.getElementById("enableCheck").checked
    }
    chrome.storage.sync.set(new_bool);
}


document.getElementById("switchButtonAction").addEventListener("click", function () {
    if (document.getElementById("blockSettings").style.display.includes("block")) {
        document.getElementById("blockSettings").style.display = "none"
        document.getElementById("blockSecret").style.display = "block"
        document.getElementById("switchButtonAction").innerHTML = "<img class='icon' src='img/popup/cog.svg'>"
    } else {
        document.getElementById("blockSecret").style.display = "none"
        document.getElementById("blockSettings").style.display = "block"
        document.getElementById("switchButtonAction").innerHTML = "<img class='icon' src='img/popup/key.svg'>"
    }
})

