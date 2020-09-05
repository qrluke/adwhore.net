let isReportStage1 = false,
    isReportStage2 = false,
    didWeChangeYouTubeQuestionMark = false,
    isToggle = false,
    isPreviewInside = false,
    isPreviewOutside = false,
    isPreviewOutsideBeforeSend = false,
    isFirstInputSelect = false,
    isSideActive = false,
    isAdFlagActive = false,
    currentUrl = '',
    currentSkipSource = '',
    currentSkipReason = '',
    currentVideoId = '',
    modSegmentData = {},
    currentChannelId = '',
    currentSkip = [],
    isReportActive = false,
    isReplace = false,
    skipTimer,
    pathFinder,
    settings,
    keepControlsOpen,
    updateProgressBar,
    updateBufferProgress,
    timestamps = [],
    whitelist = [];

chrome.storage.sync.get(null, function (result) {
    settings = result;
    whitelist = [];
    for (let item of result["whitelist"]) {
        if (!whitelist.includes(item["cID"])) {
            whitelist.push(item["cID"])
        }
    }
});

chrome.storage.onChanged.addListener(function (changes, namespace) {
    chrome.storage.sync.get(null, function (result) {
        if (result["askedForHelp"] === 0) {
            if (result["segments"] + result["likes"] > 2) {
                try {
                    v.pause()
                } catch (error) {
                    console.error(error);
                }

                chrome.runtime.sendMessage({message: "open_help"}, function (response) {
                    console.log(response.status);
                });
                chrome.storage.sync.set({"askedForHelp": 1});
            }
        }
        settings = result;
    });
});

var countries = ["AI", "AL", "AM", "AQ", "AT", "AU", "AZ", "BA", "BB", "BD", "BE", "BF", "BG", "BH", "BI", "BJ", "BM", "BN", "BO", "BR", "BS", "BT", "BW", "BY", "BZ", "CA", "CD", "CF", "CH", "CI", "CK", "CL", "CM", "CN", "CO", "CR", "CU", "CV", "CZ", "DE", "DJ", "DK", "DZ", "EE", "EG", "ER", "ES", "ET", "FI", "FR", "GA", "GB", "GD", "GE", "GH", "GL", "GN", "GR", "GT", "GU", "HK", "HR", "HU", "ID", "IE", "IL", "IN", "IS", "IT", "JO", "JP", "KE", "KH", "KI", "KR", "KY", "KZ", "LA", "LR", "LS", "LV", "MD", "MK", "MN", "MT", "MU", "MX", "NA", "NE", "NG", "NL", "NZ", "NO", "PA", "PH", "PK", "PL", "PT", "PW", "RO", "RS", "RU", "SB", "SC", "SE", "SG", "SK", "SL", "SO", "ST", "SV", "SY", "SZ", "TG", "TH", "TL", "TR", "TT", "TZ", "UA", "US", "UZ", "VC", "YE", "ZM"];
var parties = ["SOVIET", "UN", "NATO"];

let youtubeMutation = setTimeout(function tick() {
    //console.log("URL check started");
    if (settings && settings["enable"] && document.URL.localeCompare(currentUrl)) {
        currentUrl = document.URL;
        console.log("I'm on youtube and URL has changed");
        if (currentUrl.includes("watch?v=")) {
            console.log("Should be a player somewhere, I'm looking for it");

            v = document.querySelectorAll('video')[0];
            if (v && v.duration) {
                console.log("video found");

                if (!didWeChangeYouTubeQuestionMark) {
                    control = document.createElement("div");
                    control.className = "ytp-right-controls"
                    $(control).insertAfter(document.getElementsByClassName("ytp-left-controls")[0])
                    console.log("creating html");
                    createElemets();
                    console.log("adding layout");
                    addLayout();
                    console.log("ugly css");
                    addStyles();
                    console.log("injecting ADN HTML+CSS into youtube player");
                    inject();
                    console.log("adding JS events");
                    addEvents();
                    console.log("ADN inserted. Let's roll!");
                    didWeChangeYouTubeQuestionMark = true;
                }
                let adnPanel = document.getElementById("ADN_MOD_PANEL");
                if(adnPanel){
                    adnPanel.remove()
                }

                resetAndFetch();
                setTimeout(function injectModeratorPanelTimeout() {
                    if (settings["moderator"]) {
                        if (timestamps.length < 1) {
                            setTimeout(injectModeratorPanelTimeout, 200);
                        } else {
                            try {
                                $('ytd-video-primary-info-renderer')[0].firstChild
                                injectModeratorPanel()
                            } catch {
                                setTimeout(injectModeratorPanelTimeout, 100);
                            }
                        }
                    }
                }, 100);

                setTimeout(function fetchWhenCidIsKnown() {
                    if (getChannelID() !== "") {
                        resetAndFetch(false);
                    } else {
                        setTimeout(fetchWhenCidIsKnown, 100);
                    }
                }, 2500);
            } else {
                currentUrl = "";
                if (v) {
                    console.log("Player was found but there was no duration on it. I'll try again.");
                } else {
                    console.log("Couldn't find a player, will try again and again and again!");
                }
            }
        } else {
            console.log("It seems that we are not on player page. It's temporary, soon we will be able to detect YT videos everywhere");
        }
    }
    youtubeMutation = setTimeout(tick, 250);
}, 0);

function resetAndFetch(bar = true) {
    /* RESET AFTER URL CHANGE HERE */

    if (bar) {
        disableStage2()
        disableStage1()
        try {
            document.getElementsByClassName("ytp-fullerscreen-edu-text")[0].style.display = "none";
            document.getElementsByClassName("ytp-fullerscreen-edu-chevron")[0].style.display = "none";
        } catch (error) {
            console.error(error);
        }


        isAdFlagActive = document.getElementsByClassName("ytp-button ytp-paid-content-overlay-text")[0].innerText !== "";

        flagButtonImage.style.padding = "8px 0px";

        if (typeof (barList) == "object") {
            if (barList.firstChild) {
                while (barList.firstChild) {
                    barList.removeChild(barList.firstChild);
                }
            }
        }
        if (typeof (barList) == "object") {
            if (barListPreview.firstChild) {
                while (barListPreview.firstChild) {
                    barListPreview.removeChild(barListPreview.firstChild);
                }
            }
        }
        sideButton.style.display = "none";
        flagButtonImage.src = getFlagByCode("unknown");
        pathFinder = {};
        isSideActive = false;
    }


    timestamps = [];
    currentVideoId = getYouTubeID(currentUrl);
    currentChannelId = getChannelID();

    $.ajax({
        dataType: "json",
        url: "https://karma.adwhore.net:47976/getVideoData",
        data: {vID: currentVideoId, cID: currentChannelId},
        success: function (sb) {
            pathFinder = sb["pathfinder"];
            pathFinderSide = sb["pathfinder"]["side"];
            pathFinderCountry = sb["pathfinder"]["country"];
            flagButtonImage.style.padding = "10px 0px";
            flagButtonImage.src = getFlagByCode(pathFinderCountry);
            sideButton.style.display = "block";
            sideButtonImage.src = getParty(pathFinderSide);
            isSideActive = true;
            for (let i = 0; i < sb["data"].length; i++) {
                sb["data"][i]["source"] = "adn"
                timestamps.push(sb["data"][i])
                console.log("insert")
            }
        },
        complete: function () {
            if (bar) {
                timestamps.sort(function (a, b) {
                    if (a["data"]["timestamps"]["start"] > b["data"]["timestamps"]["start"]) {
                        return 1;
                    }
                    if (a["data"]["timestamps"]["start"] < b["data"]["timestamps"]["start"]) {
                        return -1;
                    }
                    // a должно быть равным b
                    return 0;
                });
                //yt ads walkaround
                if (getComputedStyle(document.getElementsByClassName('ytp-play-progress ytp-swatch-background-color')[0], null).backgroundColor === "rgb(255, 0, 0)") {
                    set(timestamps, v.duration)
                    segEndInput.max = v.duration - 0.5;
                    segStartInput.max = v.duration - 1;
                } else {
                    let stoper = document.URL;
                    let currentDuration = v.duration;
                    setTimeout(function run() {
                        if (stoper === document.URL) {
                            if (v.duration && currentDuration !== v.duration) {
                                if (getComputedStyle(document.getElementsByClassName('ytp-play-progress ytp-swatch-background-color')[0], null).backgroundColor === "rgb(255, 0, 0)") {
                                    set(timestamps, v.duration);
                                    segEndInput.max = v.duration - 0.5;
                                    segStartInput.max = v.duration - 1;
                                } else {
                                    setTimeout(run, 50);
                                }
                            } else {
                                setTimeout(run, 100);
                            }
                        }
                    }, 1000);
                }
            }
        }
    });
}

function createElemets() {
    mainButton = document.createElement("div");
    mainButtonImage = document.createElement("img");

    replayButton = document.createElement("div");
    replayButtonImage = document.createElement("img");

    flagButton = document.createElement("div");
    flagButtonImage = document.createElement("img");

    sideButton = document.createElement("div");
    sideButtonImage = document.createElement("img");

    awesomeTooltip = document.createElement("div");

    barList = document.createElement('ul');
    barListPreview = document.createElement('ul');

    adplayer = document.createElement("div");
    adskip = document.createElement("div");
    adSkipButton = document.createElement("div");

    adspan = document.createElement("span");

    adButton1 = document.createElement("button");
    skipImage1 = document.createElement("img");

    adButton2 = document.createElement("button");
    skipImage2 = document.createElement("img");

    adButton3 = document.createElement("button");
    skipImage3 = document.createElement("img");

    adButton4 = document.createElement("button");
    skipImage4 = document.createElement("img");

    _adSkip = document.createElement("div");
    _adSkipButton = document.createElement("div");
    _adSpan = document.createElement("span");
    _adButton1 = document.createElement("button");
    _skipImage1 = document.createElement("img");
    _adButton2 = document.createElement("button");
    _skipImage2 = document.createElement("img");

    awesomeTooltipBody = document.createElement("div");
    awesomeTooltipBodyText = document.createElement("div");
    segControls = document.createElement("div");
    segControlsNumberLabel = document.createElement("span");
    segControlsNumberInput = document.createElement("select");

    option1 = document.createElement("option");
    option2 = document.createElement("option");
    option3 = document.createElement("option");
    option4 = document.createElement("option");
    option5 = document.createElement("option");
    option6 = document.createElement("option");
    option7 = document.createElement("option");
    option8 = document.createElement("option");
    option9 = document.createElement("option");
    option10 = document.createElement("option");
    option11 = document.createElement("option");
    option12 = document.createElement("option");

    mark1 = document.createElement("div");
    mark1.id = "mark1";

    mark2 = document.createElement("div");
    mark2.id = "mark2";

    mark3 = document.createElement("div");
    mark3.id = "mark3";

    mark4 = document.createElement("div");
    mark4.id = "mark4";

    mark5 = document.createElement("div");
    mark5.id = "mark5";

    mark6 = document.createElement("div");
    mark6.id = "mark6";

    option01 = document.createElement("input");
    option02 = document.createElement("input");
    option03 = document.createElement("input");

    option01.style.display = "inline-block"
    option01.style.verticalAlign = "middle"

    option02.style.display = "inline-block"
    option02.style.verticalAlign = "middle"

    option03.style.display = "inline-block"
    option03.style.verticalAlign = "middle"

    option01b = document.createElement("p");
    option01b.innerHTML = "🤡";

    option02b = document.createElement("p");
    option02b.innerHTML = "🎭";

    option03b = document.createElement("p");
    option03b.innerHTML = "💰";

    option01.name = "option01";
    option01.value = "a1";
    option01.type = "checkbox";

    option02.name = "option02";
    option02.value = "a2";
    option02.type = "checkbox";

    option03.name = "option03";
    option03.value = "a3";
    option03.type = "checkbox";
    option03.checked = true

    previewInside = document.createElement("div");
    previewOutside = document.createElement("div");

    markInImage = document.createElement("img");
    markOutImage = document.createElement("img");

    markInImage1 = document.createElement("img");
    markOutImage1 = document.createElement("img");

    segStartInput = document.createElement("input");
    segEndInput = document.createElement("input");

    uploadButton = document.createElement("div");
    uploadButtonImage = document.createElement("img");

    helpButton = document.createElement("div");
    helpButtonImage = document.createElement("img");
}

function injectModeratorPanel() {
    let adnPanel = document.getElementById("ADN_MOD_PANEL");
    if(adnPanel){
        adnPanel.remove()
    }

    fetch(chrome.extension.getURL('moderator.html'))
        .then(response => response.text())
        .then(data => {
            let template = document.createElement('template');
            let html = data.trim(); // Never return a text node of whitespace as the result
            template.innerHTML = html;
            let dad = template.content.firstChild
            $('ytd-video-primary-info-renderer')[0].insertBefore(dad, $('ytd-video-primary-info-renderer')[0].firstChild);

            $("#adnModList").empty();
            for (var i = 0; i < timestamps.length; i++) {
                $.ajax
                ({
                    url: "https://karma.adwhore.net:47976/getSegmentData",
                    data: {sID: timestamps[i]["id"]},
                    async: false,
                    success: function (data) {
                        let unixTimestamp = data["timestamp"]
                        let milliseconds = unixTimestamp * 1000 // 1575909015000
                        let dateObject = new Date(milliseconds)
                        let humanDateFormat = dateObject.toLocaleString()
                        console.log(data)
                        $('#adnModTable > tbody:last-child').append("<tr><td>" + data["id"] + "</td><td>" + humanDateFormat + "</td><td>" + data["moderated"] + "</td><td>" + data["trust"] + "</td><td>" + data["acrate"] + "</td><td>" + data["st"] + "</td><td>" + data["en"] + "</td><td>" + data["user"] + "</td><td>" + data["country"] + "</td><td>" + data["side"] + "</td><td>" + data["category"] + "</td><td>" + data["acceptable_start"] + "</td><td>" + data["pizdaboling"] + "</td><td>" + data["prepaid"] + "</td><td>" + data["comment"] + "</td></tr>");
                    }
                })
            }

            //$('ytd-video-primary-info-renderer').innerHTML += data;
            // other code
            // eg update injected elements,
            // add event listeners or logic to connect to other parts of the app
        }).catch(err => {
        // handle error
    });
}

function addLayout() {
    mainButton.appendChild(mainButtonImage);

    control.appendChild(replayButton);
    replayButton.appendChild(replayButtonImage);


    if (settings["show_flags"]) {
        control.appendChild(flagButton);
        flagButton.appendChild(flagButtonImage);
        control.appendChild(sideButton);
        sideButton.appendChild(sideButtonImage);
    }


    adplayer.appendChild(adskip);
    adskip.appendChild(adSkipButton);
    adSkipButton.appendChild(adspan);

    adspan.appendChild(adButton1);
    adButton1.appendChild(skipImage1);
    adspan.appendChild(adButton2);
    adButton2.appendChild(skipImage2);
    adspan.appendChild(adButton3);
    adButton3.appendChild(skipImage3);
    adspan.appendChild(adButton4);
    adButton4.appendChild(skipImage4);

    adplayer.appendChild(_adSkip);
    _adSkip.appendChild(_adSkipButton);
    _adSkipButton.appendChild(_adSpan);
    _adSpan.appendChild(_adButton1);
    _adButton1.appendChild(_skipImage1);
    _adSpan.appendChild(_adButton2);
    _adButton2.appendChild(_skipImage2);

    awesomeTooltip.appendChild(awesomeTooltipBody);
    awesomeTooltipBody.appendChild(awesomeTooltipBodyText);

    replayButton.appendChild(segControls);
    segControls.appendChild(segControlsNumberLabel);

    segControlsNumberInput.appendChild(option1);
    segControlsNumberInput.appendChild(option2);
    segControlsNumberInput.appendChild(option3);
    segControlsNumberInput.appendChild(option4);
    segControlsNumberInput.appendChild(option5);
    segControlsNumberInput.appendChild(option6);
    segControlsNumberInput.appendChild(option7);
    segControlsNumberInput.appendChild(option8);
    segControlsNumberInput.appendChild(option9);
    segControlsNumberInput.appendChild(option10);
    segControlsNumberInput.appendChild(option11);
    segControlsNumberInput.appendChild(option12);

    segControls.appendChild(segControlsNumberInput);

    segControls.appendChild(mark2);
    segControls.appendChild(mark1);

    segControls.appendChild(mark4);
    segControls.appendChild(mark3);

    segControls.appendChild(mark6);
    segControls.appendChild(mark5);

    mark1.appendChild(option01b);

    mark2.appendChild(option01);

    mark3.appendChild(option02b);

    mark4.appendChild(option02)

    mark5.appendChild(option03b);

    mark6.appendChild(option03)


    previewInside.appendChild(markInImage);
    previewInside.appendChild(markOutImage);
    segControls.appendChild(previewInside);

    segControls.appendChild(segStartInput);

    segControls.appendChild(mainButton);
    segControls.appendChild(segEndInput);
    segControls.appendChild(previewOutside);
    previewOutside.appendChild(markInImage1);
    previewOutside.appendChild(markOutImage1);
    segControls.appendChild(helpButton);
    helpButton.appendChild(helpButtonImage);
    segControls.appendChild(uploadButton);
    uploadButton.appendChild(uploadButtonImage);
}


// TODO: transform to .css
function addStyles() {
    mainButton.id = "toggleButton";
    mainButton.setAttribute("role", "button");
    mainButton.style.height = "100%";
    mainButton.style.display = "none";
    mainButton.style.float = "right";
    mainButton.style.marginRight = "0px";
    mainButton.style.cursor = "pointer";

    mainButtonImage.style.boxSizing = "border-box";
    mainButtonImage.style.height = "100%";
    mainButtonImage.style.filter = "invert(96%)";
    mainButtonImage.style.float = "right";
    mainButtonImage.style.padding = "5px 5px";
    mainButtonImage.src = getIconPath("toggle-on.svg");

    replayButton.id = "replayButton";
    replayButton.setAttribute("role", "button");
    replayButton.style.height = "100%";
    replayButton.style.float = "right";
    replayButton.style.marginRight = "4px";
    replayButton.style.cursor = "pointer";

    replayButtonImage.style.boxSizing = "border-box";
    replayButtonImage.style.height = "100%";
    replayButtonImage.style.filter = "invert(96%)";
    replayButtonImage.style.float = "right";
    replayButtonImage.style.padding = "8px 0px";
    replayButtonImage.src = getIconPath("report-button.svg");

    flagButton.id = "flagButton";
    flagButton.setAttribute("role", "button");
    flagButton.style.height = "100%";
    flagButton.style.float = "right";
    flagButton.style.marginRight = "12px";
    flagButton.style.cursor = "pointer";

    flagButtonImage.style.boxSizing = "border-box";
    flagButtonImage.style.height = "100%";
    flagButtonImage.style.border = "1";
    flagButtonImage.style.float = "right";
    flagButtonImage.style.padding = "8px 0px";
    flagButtonImage.src = getFlagByCode("unknown");

    sideButton.id = "sideButton";
    sideButton.setAttribute("role", "button");
    sideButton.style.height = "100%";
    sideButton.style.float = "right";
    sideButton.style.display = "none";
    sideButton.style.marginRight = "12px";
    //sideButton.style.marginTop = "1px";
    sideButton.style.cursor = "pointer";

    sideButtonImage.style.boxSizing = "border-box";
    sideButtonImage.style.height = "100%";
    sideButtonImage.style.border = "2";
    sideButtonImage.style.float = "right";
    sideButtonImage.style.padding = "10px 0";
    sideButtonImage.src = getParty("no.svg");

    awesomeTooltip.id = "replayButtonTooltip";
    awesomeTooltip.className = "ytp-tooltip";
    awesomeTooltip.style.display = "none";

    barList.style.height = 0;
    barList.style.margin = 0;
    barList.style.padding = 0;

    barList.style.position = "absolute";
    barList.style.width = "100%";
    barList.style.width = "visible";
    barList.style.paddingTop = "1px";

    barListPreview.style.height = 0;
    barListPreview.style.margin = 0;
    barListPreview.style.padding = 0;
    barListPreview.style.position = "absolute";
    barListPreview.style.width = "100%";
    barListPreview.style.width = "visible";
    barListPreview.style.paddingTop = "5px";

    adplayer.className = "ytp-ad-player-overlay-skip-or-preview";

    adskip.className = "ytp-ad-skip-ad-slot";
    adskip.style.display = "none";

    adSkipButton.className = "ytp-ad-skip-button-slot";

    adspan.className = "ytp-ad-skip-button-container";

    adButton1.className = "ytp-ad-skip-button ytp-button";

    skipImage1.style.boxSizing = "border-box";
    skipImage1.style.height = "30px";
    skipImage1.style.filter = "invert(96%)";
    skipImage1.style.transform = "";
    skipImage1.style.float = "right";
    skipImage1.style.padding = "4px 0";
    skipImage1.src = getIconPath("backward.svg");

    adButton2.className = "ytp-ad-skip-button ytp-button";

    skipImage2.style.boxSizing = "border-box";
    skipImage2.style.height = "30px";
    skipImage2.style.filter = "invert(96%)";
    skipImage2.style.float = "right";
    skipImage2.style.padding = "4px 0";
    skipImage2.src = getIconPath("like.svg");

    adButton3.className = "ytp-ad-skip-button ytp-button";

    skipImage3.style.boxSizing = "border-box";
    skipImage3.style.height = "30px";
    skipImage3.style.filter = "invert(96%)";
    skipImage3.style.float = "right";
    skipImage3.style.padding = "4px 0";
    skipImage3.src = getIconPath("dislike.svg");


    adButton4.className = "ytp-ad-skip-button ytp-button";

    skipImage4.style.boxSizing = "border-box";
    skipImage4.style.height = "30px";
    skipImage4.style.filter = "invert(96%)";
    skipImage4.style.float = "right";
    skipImage4.style.padding = "4px 0";
    skipImage4.src = getIconPath("close-button.svg");

    _adSkip.className = "ytp-ad-skip-ad-slot";

    _adSkip.style.display = "none";

    _adSkipButton.className = "ytp-ad-skip-button-slot";

    _adSpan.className = "ytp-ad-skip-button-container";

    _adButton1.className = "ytp-ad-skip-button ytp-button";

    _skipImage1.style.boxSizing = "border-box";
    _skipImage1.style.height = "30px";
    _skipImage1.style.transform = "";
    _skipImage1.style.float = "right";
    _skipImage1.style.filter = "invert(96%)";
    _skipImage1.style.padding = "4px 0";
    _skipImage1.src = getIconPath("help.svg");

    _adButton2.className = "ytp-ad-skip-button ytp-button";

    _skipImage2.style.boxSizing = "border-box";
    _skipImage2.style.height = "30px";
    _skipImage2.style.filter = "invert(96%)";
    _skipImage2.style.float = "right";
    _skipImage2.style.padding = "4px 0";
    _skipImage2.src = getIconPath("forward.svg");

    awesomeTooltipBody.className = "ytp-tooltip-body";
    awesomeTooltipBody.style.left = "-22.5px";
    awesomeTooltipBody.style.padding = "5px 8px";
    awesomeTooltipBody.style.backgroundColor = "rgba(26,26,26,0.8)";
    awesomeTooltipBody.style.borderRadius = "2px";

    awesomeTooltipBodyText.className = "ytp-text-tooltip";

    segControls.style.display = "none";
    segControls.style.height = "100%";
    segControls.style.float = "right";
    segControls.style.alignItems = "center";
    segControls.style.opacity = "1";

    segControlsNumberLabel.style.margin = "0 3px 0 10px";
    segControlsNumberLabel.style.paddingTop = "2px";
    segControlsNumberLabel.style.fontSize = "12px";

    segControlsNumberInput.name = "reportType";
    segControlsNumberInput.style.display = "none";
    segControlsNumberInput.style.marginRight = "5px";
    segControlsNumberInput.style.width = "40px";
    segControlsNumberInput.style.height = "70%";

    /*
    0. SSL: реклама аферистов, букмекеров, казино, пирамид, инвестиций
    1. Предзаписанная рекламная вставка, не озвученная блогером
    2. Предзаписанная рекламная вставка, озвученная блогером
    3. Оригинальная вставка, записанная блогером
    4. Блогер получил продукт и делает на него обзор
    5. Реклама других каналов с несхожей тематикой
    6. Реклама других каналов со схожей тематикой
    7. Реклама другого блогера, который снимается в ролике (коллаборация)
    8. Реклама своих проектов, соц. сетей, каналов.
    9. Оригинальная реклама, которую интересно смотреть
    10. Я не могу описать что это было, но мне показалось, что это реклама
     */

    option1.value = "Select";
    option1.selected = true;
    option1.disabled = true;
    option1.hidden = true;

    option1.text = "❓❓❓";
    option2.value = "0";
    option2.text = chrome.i18n.getMessage("category0Text");
    option2.title = chrome.i18n.getMessage("category0Title");
    option3.value = "1";
    option3.text = chrome.i18n.getMessage("category1Text");
    option3.title = chrome.i18n.getMessage("category1Title");
    option4.value = "2";
    option4.text = chrome.i18n.getMessage("category2Text");
    option5.value = "3";
    option5.text = chrome.i18n.getMessage("category3Text");
    option5.title = chrome.i18n.getMessage("category3Title");
    option6.value = "4";
    option6.text = chrome.i18n.getMessage("category4Text");
    option6.title = chrome.i18n.getMessage("category4Title");
    option7.value = "5";
    option7.text = chrome.i18n.getMessage("category5Text");
    option7.title = chrome.i18n.getMessage("category5Title");
    option8.value = "6";
    option8.text = chrome.i18n.getMessage("category6Text");
    option8.title = chrome.i18n.getMessage("category6Title");
    option9.value = "7";
    option9.text = chrome.i18n.getMessage("category7Text");
    option9.title = chrome.i18n.getMessage("category7Title");
    option10.value = "8";
    option10.text = chrome.i18n.getMessage("category8Text");
    option11.title = chrome.i18n.getMessage("category8Title");
    option11.value = "9";
    option11.text = chrome.i18n.getMessage("category9Text");
    option11.title = chrome.i18n.getMessage("category9Title");
    option12.value = "10";
    option12.text = chrome.i18n.getMessage("category10Text");
    option12.title = chrome.i18n.getMessage("category10Title");

    previewInside.id = "inside";
    previewInside.setAttribute("role", "button");
    previewInside.style.height = "100%";
    previewInside.style.display = "none";
    previewInside.style.float = "right";
    previewInside.style.marginRight = "8px";
    previewInside.style.marginLeft = "8px";

    previewInside.style.cursor = "pointer";

    markInImage.style.boxSizing = "border-box";
    markInImage.style.height = "100%";
    markInImage.style.filter = "invert(96%)";
    markInImage.style.float = "right";
    markInImage.style.padding = "6px 0";
    markInImage.src = getIconPath("mark-out.svg");

    markOutImage.style.boxSizing = "border-box";
    markOutImage.style.height = "100%";
    markOutImage.style.filter = "invert(96%)";
    markOutImage.style.float = "right";
    markOutImage.style.padding = "6px 0";
    markOutImage.src = getIconPath("mark-in.svg");

    previewOutside.id = "outside";
    previewOutside.setAttribute("role", "button");
    previewOutside.style.height = "100%";
    previewOutside.style.display = "none";
    previewOutside.style.float = "right";
    previewOutside.style.marginRight = "8px";
    previewOutside.style.marginLeft = "8px";
    previewOutside.style.cursor = "pointer";

    markInImage1.style.boxSizing = "border-box";
    markInImage1.style.height = "100%";
    markInImage1.style.filter = "invert(96%)";
    markInImage1.style.float = "right";
    markInImage1.style.padding = "6px 0";
    markInImage1.src = getIconPath("mark-in.svg");

    markOutImage1.style.boxSizing = "border-box";
    markOutImage1.style.height = "100%";
    markOutImage1.style.filter = "invert(96%)";
    markOutImage1.style.float = "right";
    markOutImage1.style.padding = "6px 0";
    markOutImage1.src = getIconPath("mark-out.svg");

    segStartInput.id = "replayStart";
    segStartInput.type = "number";
    segStartInput.min = "0";
    segStartInput.max = v.duration - 1;
    segStartInput.step = "0.1"
    segStartInput.style.marginRight = "0px";
    segStartInput.style.marginTop = "5px";
    segStartInput.style.marginBottom = "5px";
    segStartInput.style.borderRadius = "2px";
    segStartInput.style.display = "none";
    segStartInput.style.width = "60px";
    segStartInput.style.height = "50%";

    segEndInput.id = "replayEnd";
    segEndInput.type = "number";
    segEndInput.min = "1";
    segEndInput.step = "0.1"
    segEndInput.style.marginRight = "3px";
    segEndInput.style.marginTop = "5px";
    segEndInput.style.marginBottom = "5px";
    segEndInput.style.width = "60px";
    segEndInput.style.borderRadius = "2px";
    segEndInput.style.height = "50%";

    uploadButton.id = "uploadButton";
    uploadButton.setAttribute("role", "button");
    uploadButton.style.height = "100%";
    uploadButton.style.display = "none";
    uploadButton.style.float = "right";
    uploadButton.style.marginRight = "10px";
    uploadButton.style.cursor = "pointer";

    uploadButtonImage.style.boxSizing = "border-box";
    uploadButtonImage.style.height = "100%";
    uploadButtonImage.style.filter = "invert(96%)";
    uploadButtonImage.style.float = "right";
    uploadButtonImage.style.padding = "8px 0";
    uploadButtonImage.src = getIconPath("cloud-upload.svg");

    helpButton.id = "helpButton";
    helpButton.setAttribute("role", "button");
    helpButton.style.height = "100%";
    helpButton.style.display = "none";
    helpButton.style.float = "right";
    helpButton.style.marginRight = "10px";
    helpButton.style.cursor = "pointer";

    helpButtonImage.style.boxSizing = "border-box";
    helpButtonImage.style.height = "100%";
    helpButtonImage.style.filter = "invert(96%)";
    helpButtonImage.style.float = "right";
    helpButtonImage.style.padding = "8px 0";
    helpButtonImage.src = getIconPath("help.svg");

    option01b.style.fontSize = "150%";
    option01b.style.display = "inline-block"
    option01b.style.verticalAlign = "middle"
    option02b.style.fontSize = "150%";
    option02b.style.display = "inline-block"
    option02b.style.verticalAlign = "middle"
    option03b.style.fontSize = "150%";
    option03b.style.display = "inline-block"
    option03b.style.verticalAlign = "middle"
}

function inject() {
    document.getElementsByClassName("ytp-chrome-controls")[0].insertBefore(awesomeTooltip, document.getElementsByClassName(" ytp-right-controls")[0])
    document.getElementsByClassName("ytp-progress-bar-container")[0].insertAdjacentElement("afterbegin", barList);
    document.getElementsByClassName("ytp-progress-bar-container")[0].insertAdjacentElement("afterbegin", barListPreview);
    document.getElementsByClassName("html5-video-player")[0].appendChild(adplayer);
}

function addEvents() {
    mark1.addEventListener("click", function () {
        option01.checked = !option01.checked
    });
    mark3.addEventListener("click", function () {
        option02.checked = !option02.checked
    });
    mark5.addEventListener("click", function () {
        option03.checked = !option03.checked
    });
    flagButton.addEventListener("click", function () {
        if (isSideActive) {

        } else {
            alert(chrome.i18n.getMessage("helpMePlease"));
        }
    });

    mainButton.addEventListener("click", function () {
        isToggle = !isToggle;
        if (isToggle) {
            mainButtonImage.style.transform = "rotate(180deg)";
            v.currentTime = segStartInput.value;
            v.pause();
        } else {
            mainButtonImage.style.transform = "";
            v.currentTime = segEndInput.value;
            v.pause();
        }
    });


    sideButton.addEventListener("click", function () {
        window.open("https://adwhore.net/stats", '_blank');
    });

    v.addEventListener('seeking', (event) => {
        if ((isReportStage1) && (!isReportStage2) && (!isPreviewOutside) && (!isPreviewOutsideBeforeSend)) {
            if (isToggle) {
                if (v.currentTime < segEndInput.value) {
                    segStartInput.value = +v.currentTime.toFixed(1);
                }
            } else {
                if (v.currentTime > segStartInput.value) {
                    segEndInput.value = +v.currentTime.toFixed(1);
                }
            }
            set_preview();
        }
    });


    v.addEventListener("timeupdate", function () {
        if ((!isReportStage1) && (!isReportStage2)) {
            if (timestamps.length > 0) {
                if (getComputedStyle(document.getElementsByClassName('ytp-play-progress ytp-swatch-background-color')[0], null).backgroundColor === "rgb(255, 0, 0)") {
                    for (var i = 0; i < timestamps.length; i++) {
                        if ((this.currentTime >= timestamps[i]["data"]["timestamps"]["start"]) && (this.currentTime <= timestamps[i]["data"]["timestamps"]["start"] + 0.8)) {
                            if (timestamps[i]["source"] === "adn") {
                                let whatshouldido = whatShouldIDo(timestamps[i]);
                                if (whatshouldido) {
                                    whatshouldido = 2
                                } else {
                                    whatshouldido = 1
                                }
                                if (whatshouldido === 2) {
                                    currentSkipSource = "adn";
                                    isReportActive = false;
                                    isReplace = false;
                                    switchModes()
                                    currentSkip = [timestamps[i]["data"]["timestamps"]["start"], timestamps[i]["data"]["timestamps"]["end"], timestamps[i]["id"]]
                                    addSegmentSkip(currentSkip)
                                    v.currentTime = timestamps[i]["data"]["timestamps"]["end"] + 0.1;
                                    adplayer.style.display = "block";
                                    isReportActive = false;
                                    adskip.style.display = "block";
                                    adButton3.style.display = "";
                                    clearTimeout(skipTimer);
                                    skipTimer = setTimeout(function () {
                                        adplayer.style.display = "none";
                                        adskip.style.display = "none";
                                    }, 8000);
                                } else if (whatshouldido === 1) {
                                    currentSkipSource = "adn";
                                    isReportActive = false;
                                    isReplace = false;
                                    switchModes()
                                    currentSkip = [timestamps[i]["data"]["timestamps"]["start"], timestamps[i]["data"]["timestamps"]["end"], timestamps[i]["id"]]

                                    adplayer.style.display = "block";
                                    _adSkip.style.display = "block";
                                    adskip.style.display = "none";
                                    adButton3.style.display = "";
                                    _skipImage1.src = getIconPath("help.svg");
                                    skipImage2.src = getIconPath("like.svg");
                                    skipImage1.style.transform = "rotate(180deg)";
                                    clearTimeout(skipTimer);
                                    skipTimer = setTimeout(function () {
                                        adplayer.style.display = "none";
                                        _adSkip.style.display = "none";
                                    }, 13000);
                                } else {
                                    //nothing
                                }
                            } else {
                                currentSkipSource = "sb";
                                isReportActive = false;
                                isReplace = false;
                                switchModes()
                                currentSkip = [timestamps[i]["data"]["timestamps"]["start"], timestamps[i]["data"]["timestamps"]["end"]]
                                adplayer.style.display = "block";
                                _adSkip.style.display = "block";
                                adskip.style.display = "none";
                                _skipImage1.src = getIconPath("help.svg");
                                clearTimeout(skipTimer);

                                skipTimer = setTimeout(function () {
                                    adplayer.style.display = "none";
                                    _adSkip.style.display = "none";
                                }, 13000);
                            }
                        }
                    }
                }
            }
        } else {
            if (isPreviewInside) {
                if (this.currentTime >= segEndInput.value) {
                    v.pause();
                    isPreviewInside = false;
                }
            }
            if (isPreviewOutside) {
                if (v.currentTime >= segStartInput.value) {
                    v.currentTime = segEndInput.value;
                    isPreviewOutside = false;
                    setTimeout(function () {
                        v.pause();
                    }, 1500);
                }
            }
            if (isPreviewOutsideBeforeSend) {
                if (v.currentTime >= segStartInput.value) {
                    v.currentTime = segEndInput.value;
                    isPreviewOutsideBeforeSend = false;
                    setTimeout(function () {
                        v.pause();
                        var r = confirm(chrome.i18n.getMessage("areYouSure"));
                        if (r === true) {
                            enableStage2();
                        } else {
                            isReportStage2 = !isReportStage2;
                        }
                    }, 1500);
                }
            }
        }
    });

    adButton1.addEventListener("click", function () {
        if (isReportActive) {
            adskip.style.display = "none";
            adButton3.style.display = "";
            skipImage2.src = getIconPath("like.svg");
            clearTimeout(skipTimer);

            disableStage2()
            disableStage1()

            enableStage1(currentSkip[0], currentSkip[1])
            v.pause()
        } else {
            if (skipImage1.style.transform === "") {
                v.currentTime = currentSkip[0] + 1;
                skipImage1.style.transform = "rotate(180deg)";
                v.play();
            } else {
                v.currentTime = currentSkip[1];
                skipImage1.style.transform = "";
                v.play();
            }
        }
    });


    adButton2.addEventListener("click", function () {
        if (isReportActive) {
            adskip.style.display = "none";
            adButton3.style.display = "";
            skipImage2.src = getIconPath("like.svg");
            clearTimeout(skipTimer);
            isReplace = true;
            disableStage2()
            disableStage1()
            enableStage1(currentSkip[0], currentSkip[1])
            v.pause()


        } else {
            if (currentSkipSource === "adn") {
                skipImage2.src = getIconPath("heart.svg");
                $.ajax({
                    dataType: "json",
                    type: "POST",
                    url: "https://karma.adwhore.net:47976/addSegmentLike",
                    data: JSON.stringify({sID: currentSkip[2], secret: settings["secret"]}),
                    success: function (sb) {
                        chrome.storage.sync.set({"likes": settings["likes"] + 1});
                        // alert(`Success. Reason: ${JSON.stringify(sb)}`);
                        if (settings["moderator"]) {
                            let rewardValue = prompt("enter reward: n/10", "1");
                            if (rewardValue != null) {
                                $.ajax({
                                    dataType: "json",
                                    type: "POST",
                                    url: "https://karma.adwhore.net:47976/addReward",
                                    data: JSON.stringify({sID: currentSkip[2], secret: settings["secret"], reward: rewardValue}),
                                    success: function (sb) {
                                        alert(`Success. Reason: ${JSON.stringify(sb)}`);
                                    }
                                });
                            }
                        }
                    }
                });
                setTimeout(function () {
                    adskip.style.display = "none"
                    skipImage2.src = getIconPath("like.svg");
                }, 1000);
            } else {
                disableStage2()
                disableStage1()

                enableStage1(currentSkip[0], currentSkip[1])
                enableStage2()
                v.pause()
            }
        }
    });

    adButton3.addEventListener("click", function () {
        if (isReportActive) {
            let comment = prompt(`Report on ${currentVideoId} skip ${currentSkip}.\n\n` + chrome.i18n.getMessage("reportText"));
            if (comment != null) {
                $.ajax({
                    dataType: "json",
                    type: "POST",
                    url: "https://karma.adwhore.net:47976/addSegmentReport",
                    data: JSON.stringify({sID: currentSkip[2], text: comment, secret: settings["secret"]}),
                    success: function (sb) {
                        alert(`Success. Reason: ${JSON.stringify(sb)}`);
                        resetAndFetch()
                    }
                });
                v.currentTime = currentSkip[0] + 1;

                adskip.style.display = "none";
                adButton3.style.display = "";
                skipImage2.src = getIconPath("like.svg");
                clearTimeout(skipTimer);
            }
        } else {
            isReportActive = !isReportActive
            switchModes()
        }
    });

    adButton4.addEventListener("click", function () {
        if (isReportActive) {
            isReportActive = false;
            isReplace = false;
            switchModes()
        } else {
            adskip.style.display = "none";
            adButton3.style.display = "";
            skipImage2.src = getIconPath("like.svg");
            clearTimeout(skipTimer);
        }
    });

    _adButton2.addEventListener("click", function () {
        if (currentSkipSource === "adn") {
            skipImage2.src = getIconPath("like.svg");
            skipImage1.style.transform = "";
            v.currentTime = currentSkip[1] + 0.1;
            addSegmentSkip(currentSkip)

            adButton3.style.display = ""

            isReportActive = false;
            isReplace = false;

            switchModes();

            adskip.style.display = "block";
            _adSkip.style.display = "none";

            skipTimer = setTimeout(function () {
                adskip.style.display = "none";
            }, 8000);
        } else {
            adButton3.style.display = "none"
            skipImage2.src = getIconPath("cloud-upload.svg");
            skipImage1.style.transform = "";
            v.currentTime = currentSkip[1] + 0.1;
            adskip.style.display = "block";
            _adSkip.style.display = "none";
            skipTimer = setTimeout(function () {
                adskip.style.display = "none";
                adButton3.style.display = "";
                skipImage2.src = getIconPath("like.svg");
            }, 5000);
        }
    });

    previewInside.addEventListener("click", function () {
        isPreviewOutside = false;
        isPreviewInside = true;
        v.currentTime = segStartInput.value;
        v.play();
    });

    previewOutside.addEventListener("click", function () {
        isPreviewInside = false;
        isPreviewOutside = true;
        v.currentTime = segStartInput.value - 1.5;
        v.play();
    });

    segStartInput.addEventListener('keydown', (e) => {
        if (e.keyCode === 32) {
            if (v.paused) {  // если видео остановлено, запускаем
                v.play();
            } else {
                v.pause();
            }
            e.preventDefault();
            e.stopPropagation();
            return true;
        } else if (e.keyCode === 13) {
            if (v.currentTime < segEndInput.value) {
                segStartInput.value = +(parseFloat(v.currentTime)).toFixed(1);
            }
            e.preventDefault();
            e.stopPropagation();
            return true;
        } else if (e.keyCode === 40) {
            if (segStartInput.value < parseFloat(segEndInput.value) - 0.1) {
                segStartInput.value = +(parseFloat(segStartInput.value) - 0.1).toFixed(1);
                v.currentTime = +parseFloat(segStartInput.value);
            }
            e.preventDefault();
            e.stopPropagation();
            return true;
        } else if (e.keyCode === 38) {
            if (segStartInput.value < parseFloat(segEndInput.value) + 0.1) {
                segStartInput.value = +(parseFloat(segStartInput.value) + 0.1).toFixed(1);
                v.currentTime = +parseFloat(segStartInput.value);
            }
            e.preventDefault();
            e.stopPropagation();
            return true;
        } else if (e.keyCode === 37) {
            if (segStartInput.value < parseFloat(segEndInput.value) - 2) {
                segStartInput.value = +(parseFloat(segStartInput.value) - 2).toFixed(1);
                v.currentTime = +parseFloat(segStartInput.value);
            }
            e.preventDefault();
            e.stopPropagation();
            return true;
        } else if (e.keyCode === 39) {
            if (segStartInput.value < parseFloat(segEndInput.value) + 2) {
                segStartInput.value = +(parseFloat(segStartInput.value) + 2).toFixed(1);
                v.currentTime = +parseFloat(segStartInput.value);
            }
            e.preventDefault();
            e.stopPropagation();
            return true;
        } else if (e.keyCode === 9) {
            document.getElementById('toggleButton').click();
            if (isToggle) {
                document.getElementById('replayStart').focus();
            } else {
                document.getElementById('replayEnd').focus();
            }
            e.preventDefault();
            e.stopPropagation();
            return true;
        } else {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
    });

    segStartInput.addEventListener('change', (event) => {
        v.currentTime = segStartInput.value;
    });

    segStartInput.addEventListener('click', (event) => {
        if (!isToggle) {
            isToggle = true;
            isFirstInputSelect = false;
            v.currentTime = segStartInput.value;
            v.pause();
            mainButtonImage.style.transform = "rotate(180deg)";
        }
    });

    segEndInput.addEventListener('change', (event) => {
        v.currentTime = segEndInput.value;
    });

    segEndInput.addEventListener('click', (event) => {
        if (isToggle || isFirstInputSelect) {
            isFirstInputSelect = false;
            isToggle = false;
            v.currentTime = segEndInput.value;
            v.pause();
            mainButtonImage.style.transform = "";
        }
    });

    segEndInput.addEventListener('keydown', (e) => {
        if (e.keyCode === 32) {
            if (v.paused) {  // если видео остановлено, запускаем
                v.play();
            } else {
                v.pause();
            }
            e.preventDefault();
            e.stopPropagation();
            return true;
        } else if (e.keyCode === 13) {
            if (v.currentTime > +parseFloat(segStartInput.value)) {
                segEndInput.value = +v.currentTime.toFixed(1);
            }
            e.preventDefault();
            e.stopPropagation();
            return true;
        } else if (e.keyCode === 40) {
            if (segEndInput.value > +parseFloat(segStartInput.value) - 0.1) {
                segEndInput.value = +(parseFloat(segEndInput.value) - 0.1).toFixed(1);
                v.currentTime = +parseFloat(segEndInput.value);
            }
            e.preventDefault();
            e.stopPropagation();
            return true;
        } else if (e.keyCode === 38) {
            if (segEndInput.value > +parseFloat(segStartInput.value) + 0.1) {
                segEndInput.value = +(parseFloat(segEndInput.value) + 0.1).toFixed(1);
                v.currentTime = +parseFloat(segEndInput.value);
            }
            e.preventDefault();
            e.stopPropagation();
            return true;
        } else if (e.keyCode === 37) {
            if (segEndInput.value > parseFloat(segStartInput.value) - 2) {
                segEndInput.value = +(parseFloat(segEndInput.value) - 2).toFixed(1);
                v.currentTime = +parseFloat(segEndInput.value);
            }
            e.preventDefault();
            e.stopPropagation();
            return true;
        } else if (e.keyCode === 39) {
            if (segEndInput.value > parseFloat(segStartInput.value) + 2) {
                segEndInput.value = +(parseFloat(segEndInput.value) + 2).toFixed(1);
                v.currentTime = +parseFloat(segEndInput.value);
            }
            e.preventDefault();
            e.stopPropagation();
            return true;
        } else if (e.keyCode === 9) {
            document.getElementById('toggleButton').click();
            if (isToggle) {
                document.getElementById('replayStart').focus();
            } else {
                document.getElementById('replayEnd').focus();
            }
            e.preventDefault();
            e.stopPropagation();
            return true;
        } else {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
    });

    replayButtonImage.addEventListener("mouseover", function () {
        if (isReportStage2) {
            awesomeTooltipBodyText.innerHTML = chrome.i18n.getMessage("edit");
        } else if (isReportStage1) {
            awesomeTooltipBodyText.innerHTML = chrome.i18n.getMessage("close");
        } else {
            awesomeTooltipBodyText.innerHTML = chrome.i18n.getMessage("addsegment");
        }
        awesomeTooltip.style.bottom = (control.parentElement.offsetHeight + (awesomeTooltip.offsetHeight / 2) + 10) + "px";
        awesomeTooltip.style.left = (replayButtonImage.offsetLeft + (replayButtonImage.offsetWidth / 2) - (awesomeTooltip.offsetWidth / 2) - 12) + "px";
        awesomeTooltip.style.display = "block";
    });

    replayButtonImage.addEventListener("mouseleave", function () {
        awesomeTooltip.style.display = "none";
    });

    sideButtonImage.addEventListener("mouseover", function () {
        awesomeTooltipBodyText.innerHTML = getSideTooltip()
        awesomeTooltip.style.bottom = (control.parentElement.offsetHeight + (awesomeTooltip.offsetHeight / 2) + 10) + "px";
        awesomeTooltip.style.left = (sideButtonImage.offsetLeft + (sideButtonImage.offsetWidth / 2) - (awesomeTooltip.offsetWidth / 2) - 12) + "px";
        awesomeTooltip.style.display = "block";
    });

    sideButtonImage.addEventListener("mouseleave", function () {
        awesomeTooltip.style.display = "none";
    });

    flagButtonImage.addEventListener("mouseover", function () {
        awesomeTooltipBodyText.innerHTML = getFlagTooltip();
        awesomeTooltip.style.bottom = (control.parentElement.offsetHeight + (awesomeTooltip.offsetHeight / 2) + 10) + "px";
        awesomeTooltip.style.left = (flagButtonImage.offsetLeft + (flagButtonImage.offsetWidth / 2) - (awesomeTooltip.offsetWidth / 2) - 12) + "px";
        awesomeTooltip.style.display = "block";
    });

    flagButtonImage.addEventListener("mouseleave", function () {
        awesomeTooltip.style.display = "none";
    });

    uploadButton.addEventListener("mouseover", function () {
        if (isReportStage2) {
            if (isReportActive) {
                awesomeTooltipBodyText.innerHTML = chrome.i18n.getMessage("replaceSubmit");
            } else {
                awesomeTooltipBodyText.innerHTML = chrome.i18n.getMessage("send");
            }
        } else {
            if (isReportActive && isReplace) {
                awesomeTooltipBodyText.innerHTML = chrome.i18n.getMessage("replaceSelectCat");
            } else if (isReportActive) {
                awesomeTooltipBodyText.innerHTML = chrome.i18n.getMessage("editTimecodes");
            } else {
                awesomeTooltipBodyText.innerHTML = chrome.i18n.getMessage("checkBeforeSend");
            }
        }

        awesomeTooltip.style.bottom = (control.parentElement.offsetHeight + (awesomeTooltip.offsetHeight / 2) + 10) + "px";
        awesomeTooltip.style.left = (uploadButtonImage.offsetLeft + (uploadButtonImage.offsetWidth / 2) - (awesomeTooltip.offsetWidth / 2) - 12) + "px";
        awesomeTooltip.style.display = "block";
    });

    uploadButton.addEventListener("mouseleave", function () {
        awesomeTooltip.style.display = "none";
    });

    helpButton.addEventListener("mouseover", function () {
        if (isReportStage2) {
            awesomeTooltipBodyText.innerHTML = chrome.i18n.getMessage("clickHelp2");
        } else {
            awesomeTooltipBodyText.innerHTML = chrome.i18n.getMessage("clickHelp1");
        }

        awesomeTooltip.style.bottom = (control.parentElement.offsetHeight + (awesomeTooltip.offsetHeight / 2) + 10) + "px";
        awesomeTooltip.style.left = (helpButtonImage.offsetLeft + (helpButtonImage.offsetWidth / 2) - (awesomeTooltip.offsetWidth / 2) - 12) + "px";
        awesomeTooltip.style.display = "block";
    });

    helpButton.addEventListener("mouseleave", function () {
        awesomeTooltip.style.display = "none";
    });

    markInImage.addEventListener("mouseover", function () {
        awesomeTooltipBodyText.innerHTML = chrome.i18n.getMessage("previewInside");
        awesomeTooltip.style.bottom = (control.parentElement.offsetHeight + (awesomeTooltip.offsetHeight / 2) + 10) + "px";
        awesomeTooltip.style.left = (previewInside.offsetLeft + (previewInside.offsetWidth / 2) - (awesomeTooltip.offsetWidth / 2) - 12) + "px";
        awesomeTooltip.style.display = "block";
    });

    markInImage.addEventListener("mouseleave", function () {
        awesomeTooltip.style.display = "none";
    });

    markOutImage.addEventListener("mouseover", function () {
        awesomeTooltipBodyText.innerHTML = chrome.i18n.getMessage("previewInside");
        awesomeTooltip.style.bottom = (control.parentElement.offsetHeight + (awesomeTooltip.offsetHeight / 2) + 10) + "px";
        awesomeTooltip.style.left = (previewInside.offsetLeft + (previewInside.offsetWidth / 2) - (awesomeTooltip.offsetWidth / 2) - 12) + "px";
        awesomeTooltip.style.display = "block";
    });

    markOutImage.addEventListener("mouseleave", function () {
        awesomeTooltip.style.display = "none";
    });

    _skipImage1.addEventListener("click", function () {
        alert(currentSkipReason);
    });

    markInImage1.addEventListener("mouseover", function () {
        awesomeTooltipBodyText.innerHTML = chrome.i18n.getMessage("previewOutside");
        awesomeTooltip.style.bottom = (control.parentElement.offsetHeight + (awesomeTooltip.offsetHeight / 2) + 10) + "px";
        awesomeTooltip.style.left = (previewOutside.offsetLeft + (previewOutside.offsetWidth / 2) - (awesomeTooltip.offsetWidth / 2) - 12) + "px";
        awesomeTooltip.style.display = "block";
    });

    markInImage1.addEventListener("mouseleave", function () {
        awesomeTooltip.style.display = "none";
    });

    markOutImage1.addEventListener("mouseover", function () {
        awesomeTooltipBodyText.innerHTML = chrome.i18n.getMessage("previewOutside");
        awesomeTooltip.style.bottom = (control.parentElement.offsetHeight + (awesomeTooltip.offsetHeight / 2) + 10) + "px";
        awesomeTooltip.style.left = (previewOutside.offsetLeft + (previewOutside.offsetWidth / 2) - (awesomeTooltip.offsetWidth / 2) - 12) + "px";
        awesomeTooltip.style.display = "block";
    });

    markOutImage1.addEventListener("mouseleave", function () {
        awesomeTooltip.style.display = "none";
    });

    segControlsNumberInput.addEventListener("mouseover", function () {
        awesomeTooltipBodyText.innerHTML = chrome.i18n.getMessage("selectCategory");
        awesomeTooltip.style.bottom = (control.parentElement.offsetHeight + (awesomeTooltip.offsetHeight / 2) + 10) + "px";
        awesomeTooltip.style.left = (segControlsNumberInput.offsetLeft + (segControlsNumberInput.offsetWidth / 2) - (awesomeTooltip.offsetWidth / 2) - 12) + "px";
        awesomeTooltip.style.display = "block";
    });

    segControlsNumberInput.addEventListener("mouseleave", function () {
        awesomeTooltip.style.display = "none";
    });

    segControlsNumberInput.onchange = function () {
        option03.checked = !(segControlsNumberInput.value === "7" || segControlsNumberInput.value === "8");
    }


    mark1.addEventListener("mouseover", function () {
        awesomeTooltipBodyText.innerHTML = chrome.i18n.getMessage("checkOne");
        awesomeTooltip.style.bottom = (control.parentElement.offsetHeight + (awesomeTooltip.offsetHeight / 2) + 10) + "px";
        awesomeTooltip.style.left = (mark1.offsetLeft + (mark1.offsetWidth / 2) - (awesomeTooltip.offsetWidth / 2) - 12) + "px";
        awesomeTooltip.style.display = "block";
    });

    mark1.addEventListener("mouseleave", function () {
        awesomeTooltip.style.display = "none";
    });

    mark3.addEventListener("mouseover", function () {
        awesomeTooltipBodyText.innerHTML = chrome.i18n.getMessage("checkTwo");
        awesomeTooltip.style.bottom = (control.parentElement.offsetHeight + (awesomeTooltip.offsetHeight / 2) + 10) + "px";
        awesomeTooltip.style.left = (mark3.offsetLeft + (mark3.offsetWidth / 2) - (awesomeTooltip.offsetWidth / 2) - 12) + "px";
        awesomeTooltip.style.display = "block";
    });

    mark3.addEventListener("mouseleave", function () {
        awesomeTooltip.style.display = "none";
    });

    mark5.addEventListener("mouseover", function () {
        awesomeTooltipBodyText.innerHTML = chrome.i18n.getMessage("checkThree");
        awesomeTooltip.style.bottom = (control.parentElement.offsetHeight + (awesomeTooltip.offsetHeight / 2) + 10) + "px";
        awesomeTooltip.style.left = (mark5.offsetLeft + (mark5.offsetWidth / 2) - (awesomeTooltip.offsetWidth / 2) - 12) + "px";
        awesomeTooltip.style.display = "block";
    });

    mark5.addEventListener("mouseleave", function () {
        awesomeTooltip.style.display = "none";
    });

    uploadButton.addEventListener("click", function () {
        if (isReportActive && !isReplace) {
            let json = {
                "sID": currentSkip[2],
                "secret": settings["secret"],
                "start": +segStartInput.value,
                "end": +segEndInput.value,
            };
            $.ajax
            ({
                url: "https://karma.adwhore.net:47976/editSegment",
                type: "POST",
                data: JSON.stringify(json),
                contentType: 'application/json',
                async: false,
                success: function (data) {
                    alert("Success | Удачно\n" + JSON.stringify(data));
                    chrome.storage.sync.set({"segments": settings["segments"] + 1});
                },
                error: function (s, status, error) {
                    alert('error\n' + JSON.stringify(s.responseJSON) + '\n' + status + '\n' + error);
                    isReportStage2 = !isReportStage2;
                }
            })
            disableStage2()
            disableStage1()
            resetAndFetch()

            isReplace = false;
            isReportActive = false;

            v.currentTime = +segStartInput.value - 1;
            v.play();
        } else {
            isReportStage2 = !isReportStage2;
            if (isReportStage2) {
                if (settings["segments"] < 2) {
                    isPreviewInside = false;
                    isPreviewOutside = false;
                    isPreviewOutsideBeforeSend = true;
                    v.currentTime = segStartInput.value - 1.5;
                    v.play();
                } else {
                    enableStage2();
                    if (isReplace && settings["moderator"]) {
                        $.ajax
                        ({
                            url: "https://karma.adwhore.net:47976/getSegmentData",
                            data: {sID: currentSkip[2]},
                            async: false,
                            success: function (data) {
                                modSegmentData = data
                                option01.checked = data["acceptable_start"]
                                option02.checked = data["pizdaboling"]
                                option03.checked = data["prepaid"]
                                segControlsNumberInput.value = data["category"]
                            },
                            error: function (s, status, error) {
                                alert('error\n' + JSON.stringify(s.responseJSON) + '\n' + status + '\n' + error);
                            }
                        })
                    }
                }
            } else {
                if (segControlsNumberInput.value !== "Select") {
                    if ((+segEndInput.value - +segStartInput.value) / 90 * 101 > v.duration) {
                        isReportStage2 = !isReportStage2;
                        alert(chrome.i18n.getMessage("plsDontSendWholeVideo"));
                    } else {
                        let comment = ""
                        if (isReplace && settings["moderator"]) {
                            comment = prompt(chrome.i18n.getMessage("pleaseEnterComment"), modSegmentData["comment"]) || "";
                        } else {
                            comment = prompt(chrome.i18n.getMessage("pleaseEnterComment")) || "";
                        }

                        if (isReportActive && isReplace) {
                            let json = {
                                "secret": settings["secret"],
                                "category": segControlsNumberInput.value,
                                "start": +segStartInput.value,
                                "end": +segEndInput.value,
                                "pizdabol": option02.checked,
                                "honest": option02.checked,
                                "paid": option03.checked,
                                "comment": comment,
                                "sID": currentSkip[2]
                            };

                            $.ajax
                            ({
                                url: "https://karma.adwhore.net:47976/replaceSegment",
                                type: "POST",
                                data: JSON.stringify(json),
                                contentType: 'application/json',
                                async: false,
                                success: function (data) {
                                    alert("Success | Удачно\n" + JSON.stringify(data));
                                    disableStage2()
                                    disableStage1()
                                    resetAndFetch()

                                    isReplace = false;
                                    isReportActive = false;

                                    v.currentTime = +segStartInput.value - 1;
                                    v.play();

                                    chrome.storage.sync.set({"segments": settings["segments"] + 1});
                                },
                                error: function (s, status, error) {
                                    alert('error\n' + JSON.stringify(s.responseJSON) + '\n' + status + '\n' + error);
                                    isReportStage2 = !isReportStage2;
                                }
                            })
                        } else {
                            let json = {
                                "vID": currentVideoId,
                                "secret": settings["secret"],
                                "category": segControlsNumberInput.value,
                                "start": +segStartInput.value,
                                "end": +segEndInput.value,
                                "pizdabol": option02.checked,
                                "honest": option02.checked,
                                "paid": option03.checked,
                                "comment": comment
                            };
                            $.ajax
                            ({
                                url: "https://karma.adwhore.net:47976/addSegment",
                                type: "POST",
                                data: JSON.stringify(json),
                                contentType: 'application/json',
                                async: false,
                                success: function (data) {
                                    alert("Success | Удачно\n" + JSON.stringify(data));
                                    disableStage2()
                                    disableStage1()
                                    resetAndFetch()
                                    chrome.storage.sync.set({"segments": settings["segments"] + 1});
                                },
                                error: function (s, status, error) {
                                    alert('error\n' + JSON.stringify(s.responseJSON) + '\n' + status + '\n' + error);
                                    isReportStage2 = !isReportStage2;
                                }
                            })
                        }


                    }
                } else {
                    isReportStage2 = !isReportStage2;
                    alert(chrome.i18n.getMessage("categoryMissing"));
                }
            }
        }
    });

    helpButton.addEventListener("click", function () {
        if (isReportStage2) {
            alert(chrome.i18n.getMessage("help2"))
        } else {
            alert(chrome.i18n.getMessage("help1"))
        }
    });

    adskip.addEventListener("mouseover", function () {
        clearTimeout(skipTimer);
    });
    adskip.addEventListener("mouseleave", function () {
        clearTimeout(skipTimer);
        skipTimer = setTimeout(() => adskip.style.display = "none", 3000);
    });

    _adSkip.addEventListener("mouseover", function () {
        clearTimeout(skipTimer);
    });
    _adSkip.addEventListener("mouseleave", function () {
        clearTimeout(skipTimer);
        skipTimer = setTimeout(() => _adSkip.style.display = "none", 3000);
    });

    replayButtonImage.addEventListener("click", function () {
        if (isReportStage2) {
            disableStage2()
        } else {
            isReportActive = false;
            isReplace = false;

            isReportStage1 = !isReportStage1;
            if (isReportStage1) {
                enableStage1(v.currentTime, v.currentTime + 40)
            } else {


                disableStage1()
            }
        }
    });
}

function enableStage2() {
    replayButtonImage.src = getIconPath("back.svg");
    if (!isReportActive) {
        uploadButtonImage.src = getIconPath("cloud-upload.svg");
    } else {
        if (isReplace) {
            uploadButtonImage.src = getIconPath("replace.svg");
        } else {
            uploadButtonImage.src = getIconPath("resize.svg");
        }
    }
    isFirstInputSelect = true;

    segControlsNumberInput.style.display = "block";
    uploadButton.style.display = "block";
    helpButton.style.display = "block";

    flagButton.style.display = "none";
    sideButton.style.display = "none";

    segStartInput.style.display = "none";
    segEndInput.style.display = "none";
    previewInside.style.display = "block";
    previewOutside.style.display = "none";
    mark1.style.display = "block";
    mark2.style.display = "block";
    mark3.style.display = "block";
    mark4.style.display = "block";

    mark5.style.display = "block";
    mark6.style.display = "block";

    segControlsNumberInput.value = "Select";
    mainButton.style.display = "none";
    isReportStage2 = true;
}

function disableStage2() {
    uploadButton.style.display = "block";
    helpButton.style.display = "block";

    flagButton.style.display = "none";
    sideButton.style.display = "none";

    segControlsNumberInput.style.display = "none";
    segStartInput.style.display = "block";
    segEndInput.style.display = "block";
    previewInside.style.display = "none";
    previewOutside.style.display = "block";
    mark1.style.display = "none";
    mark2.style.display = "none";
    mark3.style.display = "none";
    mark4.style.display = "none";
    mark5.style.display = "none";
    mark6.style.display = "none";

    mainButton.style.display = "block";
    replayButtonImage.src = getIconPath("close-button.svg");
    isReportStage2 = false;
}

function enableStage1(start, end) {
    if (!isReportActive) {
        uploadButtonImage.src = getIconPath("cloud-upload.svg");
    } else {
        if (isReplace) {
            uploadButtonImage.src = getIconPath("replace.svg");
        } else {
            uploadButtonImage.src = getIconPath("resize.svg");
        }
    }

    const ytplayer = document.querySelector('.html5-video-player')
    const progressbar = ytplayer.querySelector('.ytp-play-progress')
    const loadbar = ytplayer.querySelector('.ytp-load-progress')

    updateProgressBar = function () {
        progressbar.style.transform = 'scaleX(' + (v.currentTime / v.duration) + ')'
        $('.ytp-time-current').text(formatTime(v.currentTime))
    }

    updateBufferProgress = function () {
        loadbar.style.transform = 'scaleX(' + (v.buffered.end(v.buffered.length - 1) / v.duration) + ')'
    }

    v.addEventListener('timeupdate', updateProgressBar)
    v.addEventListener('progress', updateBufferProgress)

    keepControlsOpen = setInterval(function () {
        $('.html5-video-player').removeClass('ytp-autohide')
    }, 100)

    segStartInput.value = +start.toFixed(1);

    segEndInput.value = +end.toFixed(1);

    if (+segEndInput.value >= v.duration) {
        segEndInput.value = +(v.duration).toFixed(1) - 0.5;
    }

    segStartInput.style.width = (+v.duration.toFixed(1).length * 6 + 20) + "px";
    segEndInput.style.width = (+v.duration.toFixed(1).length * 6 + 20) + "px";

    uploadButton.style.display = "block";
    helpButton.style.display = "block";

    flagButton.style.display = "none";
    sideButton.style.display = "none";

    segControlsNumberInput.style.display = "none";
    segStartInput.style.display = "block";
    segEndInput.style.display = "block";
    previewInside.style.display = "none";
    previewOutside.style.display = "block";

    mark1.style.display = "none";
    mark2.style.display = "none";
    mark3.style.display = "none";
    mark4.style.display = "none";
    mark5.style.display = "none";
    mark6.style.display = "none";

    mainButton.style.display = "block";
    isToggle = false;
    mainButtonImage.style.transform = "";

    segControlsNumberInput.value = "Select";

    replayButtonImage.src = getIconPath("close-button.svg");
    segControls.style.display = "flex";

    isFirstInputSelect = true;

    set_preview();
    isReportStage1 = true;
}

function disableStage1() {
    clearInterval(keepControlsOpen)
    v.removeEventListener('timeupdate', updateProgressBar)
    v.removeEventListener('progress', updateBufferProgress)

    uploadButton.style.display = "none";
    helpButton.style.display = "none";

    flagButton.style.display = "block";
    if (isSideActive) {
        sideButton.style.display = "block";
    }

    while (barListPreview.firstChild) {
        barListPreview.removeChild(barListPreview.firstChild);
    }

    segControlsNumberInput.style.display = "none";
    segStartInput.style.display = "none";
    segEndInput.style.display = "none";
    previewInside.style.display = "none";
    previewOutside.style.display = "block";

    mark1.style.display = "none";
    mark2.style.display = "none";

    mark3.style.display = "none";
    mark4.style.display = "none";
    mark5.style.display = "none";
    mark6.style.display = "none";

    mainButton.style.display = "none";

    uploadButton.style.display = "none";
    helpButton.style.display = "none";

    segEndInput.style.display = "none";
    replayButtonImage.src = getIconPath("report-button.svg");
    segControls.style.display = "none";
    isReportStage1 = false;
}

function getYouTubeID(url) {
    const arr = url.split(/(vi\/|v%3D|v=|\/v\/|youtu\.be\/|\/embed\/)/);
    return 'undefined' !== arr[2] ? arr[2].split(/[^\w-]/i)[0] : arr[0];
}

function getChannelID() {
    var list = document.getElementsByClassName("yt-simple-endpoint style-scope yt-formatted-string");
    for (let item of list) {
        if (item.href.includes("channel")) {
            let cid = item.href.replace("https://www.youtube.com/channel/", "")
            chrome.storage.sync.set({"last_channel": {"name": item.text, "cID": cid}});
            return cid
        }
    }
    return ""
}

function createBar() {
    let bar = document.createElement('li');
    bar.style.display = "inline-block";
    bar.style.height = "3px";
    bar.innerText = '\u00A0';
    return bar;
}

function addBarToList(a, b, color, opacity, duration) {
    let width = (b - a) / duration * 100;
    width = Math.floor(width * 100) / 100;
    let bar = createBar();
    bar.style.backgroundColor = color;
    bar.style.opacity = opacity;
    bar.style.width = width + '%';
    barList.insertAdjacentElement('beforeEnd', bar);
}

function getBarColor(segment) {
    if (segment["source"] === "sb") {
        return "#00FF00"
    } else if (segment["source"] === "adn") {
        if (segment["paid"] === 0) {
            return "#00fcd3"
        } else if (segment["acrate"] * 100 < settings["accept"]) {
            return "#0000ff"
        } else {
            return "#ff6100"
        }
    }
}

function getBarOpacity(segment) {
    if (segment["source"] === "sb") {
        return "1.0"
    } else if (segment["source"] === "adn") {
        if (segment["paid"] === 0) {
            return "1.0"
        } else if (segment["trust"] * 100 < settings["trust"]) {
            return "1.0"
        } else {
            return "1.0"
        }
    }
}


function set(segs, duration) {
    while (barList.firstChild) {
        barList.removeChild(barList.firstChild);
    }

    if (!segs || !duration || segs.length === 0) {
        console.log("incorrect args")
        return;
    }

    //console.log(segs);
    duration = Math.floor(duration);
    addBarToList(0, segs[0]["data"]["timestamps"]["start"], "#FFFFFF", "0.0", duration);

    for (var i = 0; i < segs.length; i++) {


        if ((i + 1) < segs.length) {
            addBarToList(segs[i]["data"]["timestamps"]["start"], segs[i]["data"]["timestamps"]["end"] - 0.7, getBarColor(segs[i]), getBarOpacity(segs[i]), v.duration)
            addBarToList(segs[i]["data"]["timestamps"]["end"] - 0.7, segs[i + 1]["data"]["timestamps"]["start"], "#00FF00", "0.0", v.duration)
        } else {
            addBarToList(segs[i]["data"]["timestamps"]["start"], segs[i]["data"]["timestamps"]["end"], getBarColor(segs[i]), getBarOpacity(segs[i]), v.duration)
        }
    }
}


function set_preview() {
    while (barListPreview.firstChild) {
        barListPreview.removeChild(barListPreview.firstChild);
    }

    duration = Math.floor(v.duration);
    var width = 0;

    var preview_seg = [0];

    preview_seg[1] = segStartInput.value;
    preview_seg[2] = segEndInput.value - 0.7;


    for (var i = 0; i < preview_seg.length; i++) {
        width = (preview_seg[i + 1] - preview_seg[i]) / duration * 100;
        width = Math.floor(width * 100) / 100;
        let bar = createBar();

        if (i % 2 === 1) {
            bar.style.backgroundColor = "#FFFF00";
            bar.style.opacity = "1.0";
        } else {
            bar.style.backgroundColor = "#FFFF00";
            bar.style.opacity = "0.0";
        }

        bar.style.height = "2.5px";
        bar.style.width = width + '%';

        barListPreview.insertAdjacentElement('beforeEnd', bar);
    }
}

function getIconPath(path) {
    return chrome.extension.getURL('/img/' + path)
}

function getFlagByCode(code) {
    if (countries.includes(code)) {
        return chrome.extension.getURL('/img/flags/' + code + '.svg')
    } else {
        return chrome.extension.getURL('/img/flags/_flag.svg')
    }
}

function getParty(partyName) {
    if (parties.includes(partyName)) {
        return chrome.extension.getURL('/img/parties/' + partyName + '.svg')
    } else {
        return chrome.extension.getURL('/img/parties/_flag.svg')
    }
}

function getFlagTooltip() {
    if (pathFinder["side"]) {
        return chrome.i18n.getMessage("countryStatsWIP");
    } else {
        return chrome.i18n.getMessage("404")
    }
}

function getSideTooltip() {
    let unixTimestamp = +pathFinder["timestamp"]
    let milliseconds = unixTimestamp * 1000 // 1575909015000
    let dateObject = new Date(milliseconds)
    let humanDateFormat = dateObject.toLocaleString()

    if (pathFinder["side"] === "UN") {
        return chrome.i18n.getMessage("UN_pathfinder_prefix") + pathFinder["name"] + chrome.i18n.getMessage("pathfinder_from") + pathFinder["country"] + chrome.i18n.getMessage("UN_date") + humanDateFormat + chrome.i18n.getMessage("clickToViewColdWarStats");
    } else if (pathFinder["side"] === "NATO") {
        return chrome.i18n.getMessage("NATO_pathfinder_prefix") + pathFinder["name"] + chrome.i18n.getMessage("pathfinder_from") + pathFinder["country"] + chrome.i18n.getMessage("NATO_date") + humanDateFormat + chrome.i18n.getMessage("clickToViewColdWarStats");
    } else if (pathFinder["side"] === "SOVIET") {
        return chrome.i18n.getMessage("SOV_pathfinder_prefix") + pathFinder["name"] + chrome.i18n.getMessage("pathfinder_from") + pathFinder["country"] + chrome.i18n.getMessage("SOV_date") + humanDateFormat + chrome.i18n.getMessage("clickToViewColdWarStats");
    }
}

function whatShouldIDo(segment) {
    currentSkipReason = chrome.i18n.getMessage("WNS_1")
    skip = true

    if (whitelist.includes(currentChannelId)) {
        currentSkipReason += chrome.i18n.getMessage("WNS_2").replace("currentChannelId", currentChannelId)
        skip = false
    }
    if (!(segment["moderated"] || (segment["trust"] * 100 > settings["trust"]))) {
        currentSkipReason += chrome.i18n.getMessage("WNS_3").replace("CURRENT", segment["trust"] * 100).replace("NEEDED", settings["trust"])
        skip = false
    }
    if (segment["paid"] === 0) {
        if (isAdFlagActive) {
            if (!settings["love"]["y2"]) {
                currentSkipReason += chrome.i18n.getMessage("WNS_4")
            } else {
                if (skip) {
                    return true
                }
            }
        } else {
            if (!settings["love"]["y1"]) {
                currentSkipReason += chrome.i18n.getMessage("WNS_5")
            } else {
                if (skip) {
                    return true
                }
            }
        }
    } else if (segment["acrate"] * 100 < settings["accept"]) {
        if (isAdFlagActive) {
            if (!settings["hate"]["y2"]) {
                currentSkipReason += chrome.i18n.getMessage("WNS_6")
            } else {
                if (skip) {
                    return true
                }
            }
        } else {
            if (!settings["hate"]["y1"]) {
                currentSkipReason += chrome.i18n.getMessage("WNS_7")
            } else {
                if (skip) {
                    return true
                }
            }
        }
    } else {
        if (isAdFlagActive) {
            if (!settings["fine"]["y2"]) {
                currentSkipReason += chrome.i18n.getMessage("WNS_8")
            } else {
                if (skip) {
                    return true
                }
            }
        } else {
            if (!settings["fine"]["y1"]) {
                currentSkipReason += chrome.i18n.getMessage("WNS_9")
            } else {
                if (skip) {
                    return true
                }
            }
        }
    }
    return false
}

function switchModes() {
    if (isReportActive) {
        skipImage1.src = getIconPath("resize.svg");
        skipImage2.src = getIconPath("replace.svg");
        skipImage3.src = getIconPath("delete.svg");
        skipImage4.src = getIconPath("undo.svg");
    } else {
        skipImage1.src = getIconPath("backward.svg");
        skipImage2.src = getIconPath("like.svg");
        skipImage3.src = getIconPath("dislike.svg");
        skipImage4.src = getIconPath("close-button.svg");
    }
}

function addSegmentSkip(segment) {
    $.ajax({
        dataType: "json",
        type: "POST",
        url: "https://karma.adwhore.net:47976/addSegmentSkip",
        data: JSON.stringify({sID: segment[2], secret: settings["secret"]}),
        success: function (sb) {
            //alert(`Success. Reason: ${sb}`);
        }
    });
}


function formatTime(time) {
    time = Math.round(time)

    const minutes = Math.floor(time / 60)
    let seconds = time - minutes * 60

    seconds = seconds < 10 ? '0' + seconds : seconds

    return minutes + ':' + seconds
}

