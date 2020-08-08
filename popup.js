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
    document.getElementById("show-flags").checked = result["show_flags"];
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
        "show_flags": document.getElementById("show-flags").checked,
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
        document.getElementById("switchButtonAction").innerHTML = "<img class='icon' src='img/popup/home.svg'>"
        document.getElementById("note_the_alpha").style.display = "none"
        document.getElementById("links").style.display = "none"
        document.getElementById("acceptable_table").style.display = "none"
        document.getElementById("trust_table").style.display = "none"
    } else {
        document.getElementById("blockSecret").style.display = "none"
        document.getElementById("blockSettings").style.display = "block"
        document.getElementById("switchButtonAction").innerHTML = "<img class='icon' src='img/popup/cog.svg'>"
        document.getElementById("note_the_alpha").style.display = ""
        document.getElementById("links").style.display = ""
        document.getElementById("acceptable_table").style.display = ""
        document.getElementById("trust_table").style.display = ""
    }
})


function secondsToDhms(seconds) {
    seconds = Number(seconds);
    var d = Math.floor(seconds / (3600*24));
    var h = Math.floor(seconds % (3600*24) / 3600);
    var m = Math.floor(seconds % 3600 / 60);
    var s = Math.floor(seconds % 60);

    var dDisplay = d > 0 ? d + (d === 1 ? " day, " : " days, ") : "";
    var hDisplay = h > 0 ? h + (h === 1 ? " hour, " : " hours, ") : "";
    var mDisplay = m > 0 ? m + (m === 1 ? " minute, " : " minutes, ") : "";
    var sDisplay = s >= 0 ? s + (s === 1 ? " second" : " seconds") : "";
    return dDisplay + hDisplay + mDisplay + sDisplay;
}

/***********
 Animates element's number to new number with commas
 Parameters:
 stop (number): number to stop on
 commas (boolean): turn commas on/off (default is true)
 duration (number): how long in ms (default is 1000)
 ease (string): type of easing (default is "swing", others are avaiable from jQuery's easing plugin
 Examples:
 $("#div").animateNumbers(1234, false, 500, "linear"); // half second linear without commas
 $("#div").animateNumbers(1234, true, 2000); // two second swing with commas
 $("#div").animateNumbers(4321); // one second swing with commas
 This fully expects an element containing an integer
 If the number is within copy then separate it with a span and target the span
 Will work in appropriate inputs
 Inserts and accounts for commas during animation by default

 https://github.com/talmand/jquery-animate-numbers
 ***********/

!function(e){e.fn.animateNumbers=function(t,a,n,l){return this.each(function(){var i=e(this),r=i.is("input"),v=parseInt(r?i.val().replace(/,/g,""):i.text().replace(/,/g,"")),u=/(\d)(?=(\d\d\d)+(?!\d))/g;a=void 0===a?!0:a,r&&"number"===i[0].type&&(a=!1),e({value:v}).animate({value:t},{duration:void 0===n?1e3:n,easing:void 0===l?"swing":l,step:function(){r?i.val(Math.floor(this.value)):i.text(Math.floor(this.value)),a&&(r?i.val(i.val().replace(u,"$1,")):i.text(i.text().replace(u,"$1,")))},complete:function(){(parseInt(i.text())!==t||parseInt(i.val())!==t)&&(r?i.val(t):i.text(t),a&&(r?i.val(i.val().replace(u,"$1,")):i.text(i.text().replace(u,"$1,"))))}})})}}(jQuery);
function get_mini_stats() {
    $.getJSON("https://karma.adwhore.net:47976/statsMini", function (data) {
        $("#global_users").animateNumbers(data["global"]["users"]);
        $("#global_segs").animateNumbers(data["global"]["reports"]);
        $("#global_skips").animateNumbers(data["global"]["skips"]);
        $("#global_moderated").animateNumbers(data["global"]["moderated"]);
        $("#global_time").animateNumbers(data["global"]["duration"]);
        document.getElementById("serving").innerText = secondsToDhms(data["global"]["serving"])

        setTimeout(get_mini_stats, 1000); // <-- when you ge a response, call it
    });
}
get_mini_stats();
