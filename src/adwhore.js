let baseUrl = "https://karma.adwhore.net:47976",
    isReportStage1 = false,
    isReportStage2 = false,
    didWeChangeYouTubeQuestionMark = false,
    isToggle = false,
    isPreviewInside = false,
    isPreviewOutside = false,
    isModInProgress = false,
    isPreviewInsideMod = false,
    isPreviewOutsideMod = false,
    isPreviewOutsideBeforeSend = false,
    isFirstInputSelect = false,
    isSideActive = false,
    isAdFlagActive = false,
    canUpgradeLazy = false,
    currentUrl = "",
    currentSkipSource = "",
    currentSkipReason = "",
    currentVideoId = "",
    modSegmentData = {},
    currentChannelId = "",
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
    config = {},
    whitelist = [],
    lastSpeed = 2.0,
    countries = [
        "AI",
        "AL",
        "AM",
        "AQ",
        "AT",
        "AU",
        "AZ",
        "BA",
        "BB",
        "BD",
        "BE",
        "BF",
        "BG",
        "BH",
        "BI",
        "BJ",
        "BM",
        "BN",
        "BO",
        "BR",
        "BS",
        "BT",
        "BW",
        "BY",
        "BZ",
        "CA",
        "CD",
        "CF",
        "CH",
        "CI",
        "CK",
        "CL",
        "CM",
        "CN",
        "CO",
        "CR",
        "CU",
        "CV",
        "CZ",
        "DE",
        "DJ",
        "DK",
        "DZ",
        "EE",
        "EG",
        "ER",
        "ES",
        "ET",
        "FI",
        "FR",
        "GA",
        "GB",
        "GD",
        "GE",
        "GH",
        "GL",
        "GN",
        "GR",
        "GT",
        "GU",
        "HK",
        "HR",
        "HU",
        "ID",
        "IE",
        "IL",
        "IN",
        "IS",
        "IT",
        "JO",
        "JP",
        "KE",
        "KH",
        "KI",
        "KR",
        "KY",
        "KZ",
        "LA",
        "LR",
        "LS",
        "LV",
        "MD",
        "MK",
        "MN",
        "MT",
        "MU",
        "MX",
        "NA",
        "NE",
        "NG",
        "NL",
        "NZ",
        "NO",
        "PA",
        "PH",
        "PK",
        "PL",
        "PT",
        "PW",
        "RO",
        "RS",
        "RU",
        "SB",
        "SC",
        "SE",
        "SG",
        "SK",
        "SL",
        "SO",
        "ST",
        "SV",
        "SY",
        "SZ",
        "TG",
        "TH",
        "TL",
        "TR",
        "TT",
        "TZ",
        "UA",
        "US",
        "UZ",
        "VC",
        "YE",
        "ZM",
    ],
    parties = ["SOVIET", "UN", "NATO"];

/**
 * Get active auto-skip configuration.
 *
 * There are 4 pre-defined configuration and one custom.
 */
function updateConfig() {
    switch (+settings["mode"]) {
        case 1:
            config = {
                trust: 70,
                accept: 70,
                love: {
                    y1: false,
                    y2: false,
                    a1: false,
                    a2: false,
                },
                fine: {
                    y1: true,
                    y2: false,
                    a1: false,
                    a2: false,
                },
                hate: {
                    y1: true,
                    y2: true,
                    a1: false,
                    a2: false,
                },
            };
            break;
        case 2:
            config = {
                trust: 70,
                accept: 100,
                love: {
                    y1: false,
                    y2: false,
                    a1: false,
                    a2: false,
                },
                fine: {
                    y1: true,
                    y2: true,
                    a1: true,
                    a2: true,
                },
                hate: {
                    y1: true,
                    y2: true,
                    a1: true,
                    a2: true,
                },
            };
            break;
        case 3:
            config = {
                trust: 70,
                accept: 100,
                love: {
                    y1: true,
                    y2: true,
                    a1: true,
                    a2: true,
                },
                fine: {
                    y1: true,
                    y2: true,
                    a1: true,
                    a2: true,
                },
                hate: {
                    y1: true,
                    y2: true,
                    a1: true,
                    a2: true,
                },
            };
            break;
        case 4:
            config = {
                trust: 0,
                accept: 100,
                love: {
                    y1: true,
                    y2: true,
                    a1: true,
                    a2: true,
                },
                fine: {
                    y1: true,
                    y2: true,
                    a1: true,
                    a2: true,
                },
                hate: {
                    y1: true,
                    y2: true,
                    a1: true,
                    a2: true,
                },
            };
            break;
        default:
            config = settings["custom"];
    }
}

/**
 * Get active settings, update whitelist and register user if no secret key.
 */
function updateSettings(result) {
    settings = result;
    updateConfig();
    whitelist = [];
    for (let item of result["whitelist"]) {
        if (!whitelist.includes(item["cID"])) {
            whitelist.push(item["cID"]);
        }
    }
    if (result["secret"] == null) {
        $.ajax({
            url: `${baseUrl}/api/v0/addNewUser`,
            type: "POST",
            data: JSON.stringify({uuid: result["uuid"]}),
            contentType: "application/json",
            success: function (data) {
                chrome.storage.sync.set({secret: data["secret"], name: data["name"], side: data["side"]});
                // alert("ADN user registered\n"+JSON.stringify(data));
            },
        });
    }
}

/**
 * Get active settings on loading.
 */
chrome.storage.sync.get(null, function (result) {
    updateSettings(result);
});

/**
 * Update settings if changed in popup.html.
 */
chrome.storage.onChanged.addListener(function (changes, namespace) {
    chrome.storage.sync.get(null, function (result) {
        updateSettings(result);
    });
});

/**
 * Detect YouTube page mutation.
 *
 * It detects YouTube page change, injects html&js if needed, fetches new segments and updates moderation panel.
 */
let youtubeMutation = setTimeout(function tick() {
    //console.log("URL check started");
    if (settings && settings["enable"] && document.URL.localeCompare(currentUrl)) {
        currentUrl = document.URL;
        $(document).unbindArrive();
        console.log("I'm on youtube and URL has changed");
        if (currentUrl.includes("watch") && currentUrl.includes("v=")) {
            console.log("Should be a player somewhere, I'm looking for it");

            v = document.querySelectorAll("video")[0];
            if (v && v.duration) {
                console.log("video found");

                if (!didWeChangeYouTubeQuestionMark) {
                    console.log("injecting overlay");
                    injectOverlay();
                    console.log("injecting tooltip");
                    injectToolTip();
                    console.log("injecting controls");
                    injectControls();
                    console.log("injecting bars");
                    injectBars();
                    console.log("adding html5 video events");
                    addVideoEvents();
                    console.log("ADN's ready'");

                    didWeChangeYouTubeQuestionMark = true;
                }
                shadow_controls.style.display = "none";

                $(document).arrive(".ytp-exp-chapter-hover-container", function () {
                    $(document).unbindArrive(".ytp-exp-chapter-hover-container");
                    setTimeout(function () {
                        set(timestamps, v.duration);
                    }, 500);
                });
                let adnPanel = document.getElementById("ADN_MOD_PANEL");
                if (adnPanel) {
                    adnPanel.remove();
                }

                resetAndFetch();


                setTimeout(function fetchWhenCidIsKnown() {
                    if (getChannelID() !== "") {
                        currentChannelId = getChannelID();
                        $.ajax({
                            dataType: "json",
                            url: `${baseUrl}/api/v0/isChannelBro`,
                            data: {cID: currentChannelId},
                            success: function (sb) {
                                for (let i = 0; i < timestamps.length; i++) {
                                    timestamps[i]["ambassador"] = 1;
                                }
                            }
                        });
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

/**
 * Reset unactual segments and fetch actual ones, update bar if needed.
 */
function resetAndFetch(bar = true) {
    if (bar) {
        disableStage2();
        disableStage1();
        try {
            document.getElementsByClassName("ytp-fullerscreen-edu-text")[0].style.display = "none";
            document.getElementsByClassName("ytp-fullerscreen-edu-chevron")[0].style.display = "none";
        } catch (error) {
            console.error(error);
        }

        //isAdFlagActive = document.getElementsByClassName("ytp-button ytp-paid-content-overlay-text")[0].innerText !== "";
        isAdFlagActive = false
        
        flagButtonImage.style.padding = "8px 0px";

        if (typeof barList == "object") {
            if (barList.firstChild) {
                while (barList.firstChild) {
                    barList.removeChild(barList.firstChild);
                }
            }
        }
        if (typeof barList == "object") {
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


    $.ajax({
        dataType: "json",
        url: `${baseUrl}/api/v0/getVideoData`,
        data: {vID: currentVideoId},
        success: function (sb) {
            pathFinder = sb["pathfinder"];
            pathFinderSide = sb["pathfinder"]["side"];
            pathFinderCountry = sb["pathfinder"]["country"];
            flagButtonImage.style.padding = "10px 0px";
            flagButtonImage.src = getFlagByCode(pathFinderCountry);
            if (settings["show_flags"] && !isReportStage1 && !isReportStage2) {
                sideButton.style.display = "block";
            }
            sideButtonImage.src = getParty(pathFinderSide);
            isSideActive = true;
            for (let i = 0; i < sb["data"].length; i++) {
                sb["data"][i]["source"] = "adn";
                timestamps.push(sb["data"][i]);
                console.log("insert");
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
                    return 0;
                });
                //yt ads walkaround
                if (getComputedStyle(document.getElementsByClassName("ytp-play-progress ytp-swatch-background-color")[0], null).backgroundColor !== "rgb(255, 204, 0)") {
                    set(timestamps, v.duration);
                    segEndInput.max = v.duration - 0.5;
                    segStartInput.max = v.duration - 1;
                } else {
                    let stoper = document.URL;
                    let currentDuration = v.duration;
                    setTimeout(function run() {
                        if (stoper === document.URL) {
                            if (v.duration && currentDuration !== v.duration) {
                                if (getComputedStyle(document.getElementsByClassName("ytp-play-progress ytp-swatch-background-color")[0], null).backgroundColor !== "rgb(255, 204, 0)") {
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
            if (settings["show_panel"]) {
                shadow_controls.style.display = "";
            }
        },
    });
}

/**
 * Get YouTube Video ID.
 *
 * @param  {String} url YouTube url.
 * @return {String} YouTube Video ID.
 */
function getYouTubeID(url) {
    const arr = url.split(/(vi\/|v%3D|v=|\/v\/|youtu\.be\/|\/embed\/)/);
    return "undefined" !== arr[2] ? arr[2].split(/[^\w-]/i)[0] : arr[0];
}

/**
 * Get YouTube Channel ID from current page.
 *
 * @return {String} Return YouTube Channel ID or "".
 */
function getChannelID() {
    const list = document.getElementsByClassName("yt-simple-endpoint style-scope yt-formatted-string");
    for (let item of list) {
        if (item.href.includes("channel")) {
            let cid = item.href.replace("https://www.youtube.com/channel/", "");
            chrome.storage.sync.set({last_channel: {name: item.text, cID: cid}});
            return cid;
        }
    }
    return "";
}

/**
 * Inject Overlay to player page.
 *
 * Overlay is segments skipping UI. It lets skip segments, like, request deletion, replacement etc.
 */
function injectOverlay() {
    const request = new XMLHttpRequest();
    request.open("GET", chrome.runtime.getURL("/static/overlay.html"), false); // `false` makes the request synchronous
    request.send(null);

    if (request.status === 200) {
        let data = request.responseText;
        let template = document.createElement("template");
        template.innerHTML = DOMPurify.sanitize(data.trim());
        let content = template.content.firstChild;

        let shadow_overlay = document.createElement("div");

        document.getElementsByClassName("html5-video-player")[0].appendChild(shadow_overlay);

        shadow_ad = shadow_overlay.attachShadow({mode: "open"});

        // Create some CSS to apply to the shadow dom
        let style_ad = document.createElement("style");

        const request1 = new XMLHttpRequest();
        request1.open("GET", chrome.runtime.getURL("/static/overlay.css"), false); // `false` makes the request synchronous
        request1.send(null);

        if (request1.status === 200) {
            style_ad.textContent = request1.responseText.trim();
        }

        shadow_ad.appendChild(style_ad);

        shadow_ad.appendChild(content);

        adplayer = shadow_ad.getElementById("adplayer");
        adskip = shadow_ad.getElementById("adskip");
        adSkipButton = shadow_ad.getElementById("adSkipButton");

        adspan = shadow_ad.getElementById("adspan11");

        adButton1 = shadow_ad.getElementById("adButton1");
        skipImage1 = shadow_ad.getElementById("skipImage1");

        adButton2 = shadow_ad.getElementById("adButton2");
        skipImage2 = shadow_ad.getElementById("skipImage2");

        adButton3 = shadow_ad.getElementById("adButton3");
        skipImage3 = shadow_ad.getElementById("skipImage3");

        adButton4 = shadow_ad.getElementById("adButton4");
        skipImage4 = shadow_ad.getElementById("skipImage4");

        _adSkip = shadow_ad.getElementById("_adSkip");
        _adSkipButton = shadow_ad.getElementById("_adSkipButton");
        _adSpan = shadow_ad.getElementById("_adSpan");
        _adButton1 = shadow_ad.getElementById("_adButton1");
        _skipImage1 = shadow_ad.getElementById("_skipImage1");
        _adButton2 = shadow_ad.getElementById("_adButton2");
        _skipImage2 = shadow_ad.getElementById("_skipImage2");

        skipImage1.src = getIconPath("backward.svg");
        skipImage2.src = getIconPath("like.svg");
        skipImage3.src = getIconPath("dislike.svg");
        skipImage4.src = getIconPath("close-button.svg");

        _skipImage1.src = getIconPath("help.svg");
        _skipImage2.src = getIconPath("forward.svg");

        adskip.addEventListener("mouseover", function () {
            clearTimeout(skipTimer);
        });

        adskip.addEventListener("mouseleave", function () {
            clearTimeout(skipTimer);
            skipTimer = setTimeout(() => (adskip.style.display = "none"), 3000);
        });

        _adSkip.addEventListener("mouseover", function () {
            clearTimeout(skipTimer);
        });

        _adSkip.addEventListener("mouseleave", function () {
            clearTimeout(skipTimer);
            skipTimer = setTimeout(() => (_adSkip.style.display = "none"), 3000);
        });

        adButton1.addEventListener("click", function () {
            if (isReportActive) {
                adskip.style.display = "none";
                adButton3.style.display = "";
                skipImage2.src = getIconPath("like.svg");
                clearTimeout(skipTimer);

                disableStage2();
                disableStage1();

                enableStage1(currentSkip[0], currentSkip[1]);
                v.pause();
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
                disableStage2();
                disableStage1();
                enableStage1(currentSkip[0], currentSkip[1]);
                v.pause();
            } else {
                if (currentSkipSource === "adn") {
                    skipImage2.src = getIconPath("heart.svg");
                    $.ajax({
                        dataType: "json",
                        type: "POST",
                        contentType: "application/json",
                        url: `${baseUrl}/api/v0/addSegmentLike`,
                        data: JSON.stringify({sID: currentSkip[2], secret: settings["secret"]}),
                        success: function (sb) {
                            chrome.storage.sync.set({likes: settings["likes"] + 1});
                            // alert(`Success. Reason: ${JSON.stringify(sb)}`);
                            if (settings["moderator"]) {
                                let rewardValue = prompt("enter reward: n/10", "1");
                                if (rewardValue != null) {
                                    $.ajax({
                                        dataType: "json",
                                        type: "POST",
                                        contentType: "application/json",
                                        url: `${baseUrl}/api/v0/addReward`,
                                        data: JSON.stringify({
                                            sID: currentSkip[2],
                                            secret: settings["secret"],
                                            reward: rewardValue,
                                        }),
                                        success: function (sb) {
                                            alert(`Success. Reason: ${JSON.stringify(sb)}`);
                                        },
                                    });
                                }
                            }
                        },
                    });
                    setTimeout(function () {
                        adskip.style.display = "none";
                        skipImage2.src = getIconPath("like.svg");
                    }, 1000);
                } else {
                    disableStage2();
                    disableStage1();

                    enableStage1(currentSkip[0], currentSkip[1]);
                    enableStage2();
                    v.pause();
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
                        contentType: "application/json",
                        url: `${baseUrl}/api/v0/addSegmentReport`,
                        data: JSON.stringify({sID: currentSkip[2], text: comment, secret: settings["secret"]}),
                        success: function (sb) {
                            alert(`Success. Reason: ${JSON.stringify(sb)}`);
                            resetAndFetch();
                        },
                    });
                    v.currentTime = currentSkip[0] + 1;

                    adskip.style.display = "none";
                    adButton3.style.display = "";
                    skipImage2.src = getIconPath("like.svg");
                    clearTimeout(skipTimer);
                }
            } else {
                isReportActive = !isReportActive;
                switchModes();
            }
        });

        adButton4.addEventListener("click", function () {
            if (isReportActive) {
                isReportActive = false;
                isReplace = false;
                switchModes();
            } else {
                adskip.style.display = "none";
                adButton3.style.display = "";
                skipImage2.src = getIconPath("like.svg");
                clearTimeout(skipTimer);
            }
        });

        _adButton1.addEventListener("click", function () {
            alert(currentSkipReason);
        });

        _adButton2.addEventListener("click", function () {
            if (currentSkipSource === "adn") {
                skipImage2.src = getIconPath("like.svg");
                skipImage1.style.transform = "";
                v.currentTime = currentSkip[1] + 0.1;
                addSegmentSkip(currentSkip);

                adButton3.style.display = "";

                isReportActive = false;
                isReplace = false;

                switchModes();

                adskip.style.display = "block";
                _adSkip.style.display = "none";

                skipTimer = setTimeout(function () {
                    adskip.style.display = "none";
                }, 8000);
            } else {
                adButton3.style.display = "none";
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
    }
}

/**
 * Switch skipping UI mode.
 *
 * If report is active then change icons.
 */
function switchModes() {
    if (isReportActive) {
        skipImage1.src = getIconPath("resize.svg");
        if (canUpgradeLazy) {
            skipImage2.src = getIconPath("unlazy.svg");
            skipImage2.style.filter = ""
        } else {
            skipImage2.src = getIconPath("replace.svg");
            skipImage2.style.filter = "invert(96%)"
        }
        skipImage3.style.filter = "invert(96%)"
        skipImage3.src = getIconPath("delete.svg");
        skipImage4.src = getIconPath("undo.svg");
    } else {
        skipImage1.src = getIconPath("backward.svg");
        skipImage2.style.filter = "invert(96%)"
        skipImage2.src = getIconPath("like.svg");
        if (canUpgradeLazy) {
            skipImage3.src = getIconPath("lazy1.svg");
            skipImage3.style.filter = ""
        } else {
            skipImage3.src = getIconPath("dislike.svg");
            skipImage3.style.filter = "invert(96%)"
        }
        skipImage4.src = getIconPath("close-button.svg");
    }
}

/**
 * Inject ToolTip html.
 *
 * ToolTip is used to show info on button's mouseover.
 */
function injectToolTip() {
    const request = new XMLHttpRequest();
    request.open("GET", chrome.runtime.getURL("/static/tooltip.html"), false); // `false` makes the request synchronous
    request.send(null);

    if (request.status === 200) {
        let data = request.responseText;
        let template = document.createElement("template");
        template.innerHTML = DOMPurify.sanitize(data.trim());
        let content = template.content.firstChild;

        let shadow_tooltip = document.createElement("div");

        document.getElementsByClassName("html5-video-player")[0].appendChild(shadow_tooltip);

        shadow_tooltip_wrapper = shadow_tooltip.attachShadow({mode: "open"});

        // Create some CSS to apply to the shadow dom
        let style_tooltip = document.createElement("style");

        const request1 = new XMLHttpRequest();
        request1.open("GET", chrome.runtime.getURL("/static/tooltip.css"), false); // `false` makes the request synchronous
        request1.send(null);

        if (request1.status === 200) {
            style_tooltip.textContent = request1.responseText.trim();
        }

        shadow_tooltip_wrapper.appendChild(style_tooltip);

        shadow_tooltip_wrapper.appendChild(content);

        awesomeTooltip = shadow_tooltip_wrapper.getElementById("awesomeTooltip");
        awesomeTooltipBody = shadow_tooltip_wrapper.getElementById("awesomeTooltipBody");
        awesomeTooltipBodyText = shadow_tooltip_wrapper.getElementById("awesomeTooltipBodyText");
    }
}

/**
 * Inject controls.
 *
 * Control panel lets submit new segments & shows if there is a segment in video.
 */
function injectControls() {
    const request = new XMLHttpRequest();
    request.open("GET", chrome.runtime.getURL("/static/controls.html"), false); // `false` makes the request synchronous
    request.send(null);

    if (request.status === 200) {
        data = request.responseText;

        let template = document.createElement("template");
        template.innerHTML = DOMPurify.sanitize(data.trim());
        let content = template.content.firstChild;

        shadow_controls = document.createElement("div");
        shadow_controls.style.height = "100%";
        shadow_controls.style.display = "none";

        $(shadow_controls).insertAfter(document.getElementsByClassName("ytp-left-controls")[0]);

        shadow_controls_wrapper = shadow_controls.attachShadow({mode: "open"});

        // Create some CSS to apply to the shadow dom
        let style_controls = document.createElement("style");

        const request1 = new XMLHttpRequest();
        request1.open("GET", chrome.runtime.getURL("/static/controls.css"), false); // `false` makes the request synchronous
        request1.send(null);

        if (request1.status === 200) {
            style_controls.textContent = request1.responseText.trim();
        }

        shadow_controls_wrapper.appendChild(style_controls);
        shadow_controls_wrapper.appendChild(content);

        mainButton = shadow_controls_wrapper.getElementById("mainButton");
        mainButtonImage = shadow_controls_wrapper.getElementById("mainButtonImage");
        replayButton = shadow_controls_wrapper.getElementById("replayButton");
        replayButtonImage = shadow_controls_wrapper.getElementById("replayButtonImage");
        flagButton = shadow_controls_wrapper.getElementById("flagButton");
        flagButtonImage = shadow_controls_wrapper.getElementById("flagButtonImage");
        sideButton = shadow_controls_wrapper.getElementById("sideButton");
        sideButtonImage = shadow_controls_wrapper.getElementById("sideButtonImage");
        segControls = shadow_controls_wrapper.getElementById("segControls");
        segControlsNumberLabel = shadow_controls_wrapper.getElementById("segControlsNumberLabel");
        segControlsNumberInput = shadow_controls_wrapper.getElementById("segControlsNumberInput");
        option1 = shadow_controls_wrapper.getElementById("option1");
        option2 = shadow_controls_wrapper.getElementById("option2");
        option3 = shadow_controls_wrapper.getElementById("option3");
        option4 = shadow_controls_wrapper.getElementById("option4");
        option5 = shadow_controls_wrapper.getElementById("option5");
        option6 = shadow_controls_wrapper.getElementById("option6");
        option7 = shadow_controls_wrapper.getElementById("option7");
        option8 = shadow_controls_wrapper.getElementById("option8");
        option9 = shadow_controls_wrapper.getElementById("option9");
        option10 = shadow_controls_wrapper.getElementById("option10");
        option11 = shadow_controls_wrapper.getElementById("option11");
        option12 = shadow_controls_wrapper.getElementById("option12");
        mark1 = shadow_controls_wrapper.getElementById("mark1");
        mark2 = shadow_controls_wrapper.getElementById("mark2");
        mark3 = shadow_controls_wrapper.getElementById("mark3");
        mark4 = shadow_controls_wrapper.getElementById("mark4");
        mark5 = shadow_controls_wrapper.getElementById("mark5");
        mark6 = shadow_controls_wrapper.getElementById("mark6");
        option01 = shadow_controls_wrapper.getElementById("option01");
        option02 = shadow_controls_wrapper.getElementById("option02");
        option03 = shadow_controls_wrapper.getElementById("option03");
        option01b = shadow_controls_wrapper.getElementById("option01b");
        option02b = shadow_controls_wrapper.getElementById("option02b");
        option03b = shadow_controls_wrapper.getElementById("option03b");
        previewInside = shadow_controls_wrapper.getElementById("previewInside");
        previewOutside = shadow_controls_wrapper.getElementById("previewOutside");
        markInImage = shadow_controls_wrapper.getElementById("markInImage");
        markOutImage = shadow_controls_wrapper.getElementById("markOutImage");
        markInImage1 = shadow_controls_wrapper.getElementById("markInImage1");
        markOutImage1 = shadow_controls_wrapper.getElementById("markOutImage1");
        segStartInput = shadow_controls_wrapper.getElementById("segStartInput");
        segEndInput = shadow_controls_wrapper.getElementById("segEndInput");
        lazyButton = shadow_controls_wrapper.getElementById("lazyButton");
        lazyButtonImage = shadow_controls_wrapper.getElementById("lazyButtonImage");
        uploadButton = shadow_controls_wrapper.getElementById("uploadButton");
        uploadButtonImage = shadow_controls_wrapper.getElementById("uploadButtonImage");
        keysButton = shadow_controls_wrapper.getElementById("keysButton");
        keysButtonImage = shadow_controls_wrapper.getElementById("keysButtonImage");
        helpButton = shadow_controls_wrapper.getElementById("helpButton");
        helpButtonImage = shadow_controls_wrapper.getElementById("helpButtonImage");

        keysButtonImage.src = getIconPath("keyboard.svg");
        mainButtonImage.src = getIconPath("toggle-on.svg");
        replayButtonImage.src = getIconPath("report-button.svg");
        flagButtonImage.src = getFlagByCode("unknown");
        sideButtonImage.src = getParty("no.svg");

        option2.text = chrome.i18n.getMessage("category0Text");
        option2.title = chrome.i18n.getMessage("category0Title");
        option3.text = chrome.i18n.getMessage("category1Text");
        option3.title = chrome.i18n.getMessage("category1Title");
        option4.text = chrome.i18n.getMessage("category2Text");
        option5.text = chrome.i18n.getMessage("category3Text");
        option5.title = chrome.i18n.getMessage("category3Title");
        option6.text = chrome.i18n.getMessage("category4Text");
        option6.title = chrome.i18n.getMessage("category4Title");
        option7.text = chrome.i18n.getMessage("category5Text");
        option7.title = chrome.i18n.getMessage("category5Title");
        option8.text = chrome.i18n.getMessage("category6Text");
        option8.title = chrome.i18n.getMessage("category6Title");
        option9.text = chrome.i18n.getMessage("category7Text");
        option9.title = chrome.i18n.getMessage("category7Title");
        option10.text = chrome.i18n.getMessage("category8Text");
        option11.title = chrome.i18n.getMessage("category8Title");
        option11.text = chrome.i18n.getMessage("category9Text");
        option11.title = chrome.i18n.getMessage("category9Title");
        option12.text = chrome.i18n.getMessage("category10Text");
        option12.title = chrome.i18n.getMessage("category10Title");

        markInImage.src = getIconPath("mark-out.svg");
        markOutImage.src = getIconPath("mark-in.svg");
        markInImage1.src = getIconPath("mark-in.svg");
        markOutImage1.src = getIconPath("mark-out.svg");
        uploadButtonImage.src = getIconPath("cloud-upload.svg");
        lazyButtonImage.src = getIconPath("lazy.svg");
        helpButtonImage.src = getIconPath("help.svg");

        if (settings["show_flags"]) {
            flagButton.style.display = "block";
        }

        if (!settings["show_panel"]) {
            shadow_controls.style.display = "none";
        }

        mark1.addEventListener("click", function () {
            option01.checked = !option01.checked;
        });
        mark3.addEventListener("click", function () {
            option02.checked = !option02.checked;
        });
        mark5.addEventListener("click", function () {
            option03.checked = !option03.checked;
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
            window.open("https://adwhore.net/stats", "_blank");
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

        segStartInput.addEventListener("focus", (e) => {
            keysButton.style.display = "block";
        });

        segStartInput.addEventListener("focusout", (e) => {
            if (!$("#segStartInput").is(":focus") && !$("#segEndInput").is(":focus")) {
                keysButton.style.display = "none";
            }
        });

        segStartInput.addEventListener("keydown", (e) => {
            switch (e.code) {
                case "Space":
                    if (v.paused) {
                        v.play();
                    } else {
                        v.pause();
                        if (v.currentTime < +parseFloat(segEndInput.value)) {
                            segStartInput.value = +parseFloat(v.currentTime).toFixed(1);
                            set_preview();
                        }
                    }
                    break;
                case "Enter":
                    uploadButton.click();
                    break;
                case "Escape":
                    replayButtonImage.click();
                    break;
                case "ArrowDown":
                    if (segStartInput.value < parseFloat(segEndInput.value) + 0.1) {
                        segStartInput.value = +(parseFloat(segStartInput.value) - 0.1).toFixed(1);
                        v.currentTime = +parseFloat(segStartInput.value);
                    }
                    break;
                case "ArrowUp":
                    if (segStartInput.value < parseFloat(segEndInput.value) - 0.1) {
                        segStartInput.value = +(parseFloat(segStartInput.value) + 0.1).toFixed(1);
                        v.currentTime = +parseFloat(segStartInput.value);
                    }
                    break;
                case "ArrowLeft":
                    if (segStartInput.value < parseFloat(segEndInput.value) + 2) {
                        segStartInput.value = +(parseFloat(segStartInput.value) - 2).toFixed(1);
                        v.currentTime = +parseFloat(segStartInput.value);
                    }
                    break;
                case "ArrowRight":
                    if (segStartInput.value < parseFloat(segEndInput.value) - 2) {
                        segStartInput.value = +(parseFloat(segStartInput.value) + 2).toFixed(1);
                        v.currentTime = +parseFloat(segStartInput.value);
                    }
                    break;
                case "KeyQ":
                    segStartInput.click();
                    segStartInput.focus();
                    break;
                case "KeyW":
                    previewOutside.click();
                    break;
                case "KeyE":
                    segEndInput.click();
                    segEndInput.focus();
                    break;
                case "KeyA":
                    v.playbackRate = v.playbackRate - 0.1;
                    lastSpeed = v.playbackRate;
                    break;
                case "KeyD":
                    v.playbackRate = v.playbackRate + 0.1;
                    lastSpeed = v.playbackRate;
                    break;
                case "KeyR":
                    if (v.playbackRate === 1) {
                        v.playbackRate = lastSpeed;
                    } else {
                        v.playbackRate = 1.0;
                    }
                    break;
                case "Tab":
                    mainButton.click();
                    if (isToggle) {
                        segStartInput.focus();
                    } else {
                        segEndInput.focus();
                    }
                    break;
                default:
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
            }
            e.preventDefault();
            e.stopPropagation();
            return true;
        });

        segStartInput.addEventListener("change", (event) => {
            v.currentTime = segStartInput.value;
        });

        segStartInput.addEventListener("click", (event) => {
            if (!isToggle) {
                isToggle = true;
                isFirstInputSelect = false;
                v.currentTime = segStartInput.value;
                v.pause();
                mainButtonImage.style.transform = "rotate(180deg)";
            }
        });

        segEndInput.addEventListener("focus", (e) => {
            keysButton.style.display = "block";
        });

        segEndInput.addEventListener("focusout", (e) => {
            if (!$("#segStartInput").is(":focus") && !$("#segEndInput").is(":focus")) {
                keysButton.style.display = "none";
            }
        });

        segEndInput.addEventListener("change", (event) => {
            v.currentTime = segEndInput.value;
        });

        segEndInput.addEventListener("click", (event) => {
            if (isToggle || isFirstInputSelect) {
                if (!isFirstInputSelect) {
                    v.currentTime = segEndInput.value;
                    v.pause();
                    isFirstInputSelect = false;
                }
                isToggle = false;

                mainButtonImage.style.transform = "";
            }
        });

        segEndInput.addEventListener("keydown", (e) => {
            switch (e.code) {
                case "Space":
                    if (v.paused) {
                        v.play();
                    } else {
                        v.pause();
                        if (v.currentTime > +parseFloat(segStartInput.value)) {
                            segEndInput.value = +v.currentTime.toFixed(1);
                            set_preview();
                        }
                    }
                    break;
                case "Enter":
                    uploadButton.click();
                    break;
                case "Escape":
                    replayButtonImage.click();
                    break;
                case "ArrowDown":
                    if (segEndInput.value > +parseFloat(segStartInput.value) + 0.1) {
                        segEndInput.value = +(parseFloat(segEndInput.value) - 0.1).toFixed(1);
                        v.currentTime = +parseFloat(segEndInput.value);
                    }
                    break;
                case "ArrowUp":
                    if (segEndInput.value > +parseFloat(segStartInput.value) - 0.1) {
                        segEndInput.value = +(parseFloat(segEndInput.value) + 0.1).toFixed(1);
                        v.currentTime = +parseFloat(segEndInput.value);
                    }
                    break;
                case "ArrowLeft":
                    if (segEndInput.value > parseFloat(segStartInput.value) + 2) {
                        segEndInput.value = +(parseFloat(segEndInput.value) - 2).toFixed(1);
                        v.currentTime = +parseFloat(segEndInput.value);
                    }
                    break;
                case "ArrowRight":
                    if (segEndInput.value > parseFloat(segStartInput.value) - 2) {
                        segEndInput.value = +(parseFloat(segEndInput.value) + 2).toFixed(1);
                        v.currentTime = +parseFloat(segEndInput.value);
                    }
                    break;
                case "KeyQ":
                    segStartInput.click();
                    segStartInput.focus();
                    break;
                case "KeyW":
                    previewOutside.click();
                    break;
                case "KeyE":
                    segEndInput.click();
                    segEndInput.focus();
                    break;
                case "KeyA":
                    v.playbackRate = v.playbackRate - 0.1;
                    lastSpeed = v.playbackRate;
                    break;
                case "KeyD":
                    v.playbackRate = v.playbackRate + 0.1;
                    lastSpeed = v.playbackRate;
                    break;
                case "KeyR":
                    if (v.playbackRate === 1) {
                        v.playbackRate = lastSpeed;
                    } else {
                        v.playbackRate = 1.0;
                    }
                    break;
                case "Tab":
                    mainButton.click();
                    if (isToggle) {
                        segStartInput.focus();
                    } else {
                        segEndInput.focus();
                    }
                    break;
                default:
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
            }
            e.preventDefault();
            e.stopPropagation();
            return true;
        });

        segControlsNumberInput.onchange = function () {
            option03.checked = !(segControlsNumberInput.value === "7" || segControlsNumberInput.value === "8");
        };

        uploadButton.addEventListener("click", function () {
            if (isReportActive && !isReplace) {
                let json = {
                    sID: currentSkip[2],
                    secret: settings["secret"],
                    start: +segStartInput.value,
                    end: +segEndInput.value,
                };
                $.ajax({
                    url: `${baseUrl}/api/v0/editSegment`,
                    type: "POST",
                    data: JSON.stringify(json),
                    contentType: "application/json",
                    async: false,
                    success: function (data) {
                        alert("Success | Удачно\n" + JSON.stringify(data));
                        chrome.storage.sync.set({segments: settings["segments"] + 1});
                    },
                    error: function (s, status, error) {
                        alert("error\n" + JSON.stringify(s.responseJSON) + "\n" + status + "\n" + error);
                        isReportStage2 = !isReportStage2;
                    },
                });
                disableStage2();
                disableStage1();
                resetAndFetch();

                isReplace = false;
                isReportActive = false;

                v.currentTime = +segStartInput.value - 1;
                v.play();
            } else {
                isReportStage2 = !isReportStage2;
                if (isReportStage2) {
                    if (((+segEndInput.value - +segStartInput.value) / 90) * 101 > v.duration) {
                        isReportStage2 = !isReportStage2;
                        alert(chrome.i18n.getMessage("plsDontSendWholeVideo"));
                        return
                    }
                    if (settings["segments"] < 2) {
                        isPreviewInside = false;
                        isPreviewOutside = false;
                        isPreviewOutsideBeforeSend = true;
                        v.currentTime = segStartInput.value - 1.5;
                        v.play();
                    } else if (settings["lazy"]) {
                        let json = {
                            vID: currentVideoId,
                            secret: settings["secret"],
                            start: +segStartInput.value,
                            end: +segEndInput.value,
                        };
                        $.ajax({
                            url: `${baseUrl}/api/v0/addLazySegment`,
                            type: "POST",
                            data: JSON.stringify(json),
                            contentType: "application/json",
                            async: false,
                            success: function (data) {
                                alert("Success | Удачно\n" + JSON.stringify(data));
                                disableStage1();
                                resetAndFetch();
                                chrome.storage.sync.set({segments: settings["segments"] + 1});
                            },
                            error: function (s, status, error) {
                                alert("error\n" + JSON.stringify(s.responseJSON) + "\n" + status + "\n" + error);
                                isReportStage2 = !isReportStage2;
                            },
                        });
                    } else {
                        enableStage2();
                        if (isReplace && settings["moderator"]) {
                            $.ajax({
                                url: `${baseUrl}/api/v0/getSegmentData`,
                                data: {sID: currentSkip[2], secret: settings["secret"]},
                                async: false,
                                success: function (data) {
                                    modSegmentData = data;
                                    option01.checked = data["acceptable_start"];
                                    option02.checked = data["pizdaboling"];
                                    option03.checked = data["prepaid"];
                                    segControlsNumberInput.value = data["category"];
                                },
                                error: function (s, status, error) {
                                    alert("error\n" + JSON.stringify(s.responseJSON) + "\n" + status + "\n" + error);
                                },
                            });
                        }
                    }
                } else {
                    if (segControlsNumberInput.value !== "Select") {
                        let prepo = "";

                        if (isReplace && settings["moderator"]) {
                            prepo = modSegmentData["comment"];
                        }
                        comment = prompt(chrome.i18n.getMessage("pleaseEnterComment"), prepo);
                        console.log(comment);
                        if (comment == null) {
                            isReportStage2 = !isReportStage2;
                        } else {
                            if (isReportActive && isReplace) {
                                let json = {
                                    secret: settings["secret"],
                                    category: +segControlsNumberInput.value,
                                    start: +segStartInput.value,
                                    end: +segEndInput.value,
                                    maski: option02.checked,
                                    clown: option02.checked,
                                    paid: option03.checked,
                                    comment: comment,
                                    sID: currentSkip[2],
                                };
                                $.ajax({
                                    url: `${baseUrl}/api/v0/replaceSegment`,
                                    type: "POST",
                                    data: JSON.stringify(json),
                                    contentType: "application/json",
                                    async: false,
                                    success: function (data) {
                                        alert("Success | Удачно\n" + JSON.stringify(data));
                                        disableStage2();
                                        disableStage1();
                                        resetAndFetch();

                                        isReplace = false;
                                        isReportActive = false;

                                        v.currentTime = +segStartInput.value - 1;
                                        v.play();

                                        chrome.storage.sync.set({segments: settings["segments"] + 1});
                                    },
                                    error: function (s, status, error) {
                                        alert("error\n" + JSON.stringify(s.responseJSON) + "\n" + status + "\n" + error);
                                        isReportStage2 = !isReportStage2;
                                    },
                                });
                            } else {
                                let json = {
                                    vID: currentVideoId,
                                    secret: settings["secret"],
                                    category: +segControlsNumberInput.value,
                                    start: +segStartInput.value,
                                    end: +segEndInput.value,
                                    maski: option02.checked,
                                    clown: option02.checked,
                                    paid: option03.checked,
                                    comment: comment,
                                };
                                $.ajax({
                                    url: `${baseUrl}/api/v0/addSegment`,
                                    type: "POST",
                                    data: JSON.stringify(json),
                                    contentType: "application/json",
                                    async: false,
                                    success: function (data) {
                                        alert("Success | Удачно\n" + JSON.stringify(data));
                                        disableStage2();
                                        disableStage1();
                                        resetAndFetch();
                                        chrome.storage.sync.set({segments: settings["segments"] + 1});
                                    },
                                    error: function (s, status, error) {
                                        alert("error\n" + JSON.stringify(s.responseJSON) + "\n" + status + "\n" + error);
                                        isReportStage2 = !isReportStage2;
                                    },
                                });
                            }
                        }
                    } else {
                        isReportStage2 = !isReportStage2;
                        alert(chrome.i18n.getMessage("categoryMissing"));
                    }
                }
            }
        });

        lazyButton.addEventListener("click", function () {
            if (!settings["lazy"]) {
                lazyButton.style.opacity = "1.0"
            } else {
                lazyButton.style.opacity = "0.5"
            }

            awesomeTooltipBodyText.innerHTML = DOMPurify.sanitize(lazyToolTipText(true));

            chrome.storage.sync.set({lazy: !settings["lazy"]});
        });

        helpButton.addEventListener("click", function () {
            if (isReportStage2) {
                alert(chrome.i18n.getMessage("help2"));
            } else {
                alert(chrome.i18n.getMessage("help1"));
            }
        });

        replayButtonImage.addEventListener("click", function () {
            if (isReportStage2) {
                disableStage2();
            } else {
                isReportActive = false;
                isReplace = false;

                isReportStage1 = !isReportStage1;
                if (isReportStage1) {
                    enableStage1(v.currentTime, v.currentTime + 0.1);
                } else {
                    disableStage1();
                }
            }
        });

        /**
         * Add tooltip for control panel's element.
         *
         * @param  {HTMLElement} element Element for 'mouseover' & 'mouseleave'.
         * @param {function || String} content Tooltip's innerHTML.
         * @param {HTMLElement} base Element which is used as tooltip's foundation.
         */
        function addToolTipForElement(element, content, base) {
            element.addEventListener("mouseover", function () {
                if (typeof content === "function") {
                    awesomeTooltipBodyText.innerHTML = DOMPurify.sanitize(content());
                } else {
                    awesomeTooltipBodyText.innerHTML = DOMPurify.sanitize(content);
                }
                awesomeTooltip.style.bottom = shadow_controls.parentElement.offsetHeight + awesomeTooltip.offsetHeight / 2 + 10 + "px";
                if (base === undefined) {
                    awesomeTooltip.style.left = element.offsetLeft + element.offsetWidth / 2 - awesomeTooltip.offsetWidth / 2 - 12 + "px";
                } else {
                    awesomeTooltip.style.left = base.offsetLeft + base.offsetWidth / 2 - awesomeTooltip.offsetWidth / 2 - 12 + "px";
                }
                awesomeTooltip.style.display = "block";
            });

            element.addEventListener("mouseleave", function () {
                awesomeTooltip.style.display = "none";
            });
        }

        addToolTipForElement(replayButtonImage, function () {
            if (isReportStage2) {
                return chrome.i18n.getMessage("edit");
            } else if (isReportStage1) {
                return chrome.i18n.getMessage("close");
            } else {
                return chrome.i18n.getMessage("addsegment");
            }
        });

        addToolTipForElement(sideButtonImage, getSideTooltip);
        addToolTipForElement(flagButtonImage, getFlagTooltip);

        addToolTipForElement(uploadButton, function () {
            if (isReportStage2) {
                if (isReportActive) {
                    return chrome.i18n.getMessage("replaceSubmit");
                } else {
                    return chrome.i18n.getMessage("send");
                }
            } else {
                if (isReportActive && isReplace) {
                    return chrome.i18n.getMessage("replaceSelectCat");
                } else if (isReportActive) {
                    return chrome.i18n.getMessage("editTimecodes");
                } else {
                    return chrome.i18n.getMessage("checkBeforeSend");
                }
            }
        });

        function lazyToolTipText(alt = false) {
            if (alt) {
                if (!settings["lazy"]) {
                    return chrome.i18n.getMessage("clickLazyOn");
                } else {
                    return chrome.i18n.getMessage("clickLazyOff");
                }
            } else {
                if (settings["lazy"]) {
                    return chrome.i18n.getMessage("clickLazyOn");
                } else {
                    return chrome.i18n.getMessage("clickLazyOff");
                }
            }
        }

        addToolTipForElement(lazyButton, function () {
            return lazyToolTipText()
        });

        addToolTipForElement(helpButton, function () {
            if (isReportStage2) {
                return chrome.i18n.getMessage("clickHelp2");
            } else {
                return chrome.i18n.getMessage("clickHelp1");
            }
        });

        addToolTipForElement(keysButton, chrome.i18n.getMessage("hotkeys"));
        addToolTipForElement(markInImage, chrome.i18n.getMessage("previewInside"), previewInside);
        addToolTipForElement(markOutImage, chrome.i18n.getMessage("previewInside"), previewInside);
        addToolTipForElement(markInImage1, chrome.i18n.getMessage("previewOutside"), previewOutside);
        addToolTipForElement(markOutImage1, chrome.i18n.getMessage("previewOutside"), previewOutside);
        addToolTipForElement(segControlsNumberInput, chrome.i18n.getMessage("selectCategory"));
        addToolTipForElement(mark1, chrome.i18n.getMessage("checkOne"));
        addToolTipForElement(mark3, chrome.i18n.getMessage("checkTwo"));
        addToolTipForElement(mark5, chrome.i18n.getMessage("checkThree"));
    }
}

/**
 * Get icon path.
 *
 * @param {String} filename icon's filename.
 * @return {String} path to icon.
 */
function getIconPath(filename) {
    return chrome.runtime.getURL("/img/" + filename);
}

/**
 * Get flag path by country iso code.
 *
 * @param  {String} code ISO 3166-1 alpha-2 country code (RU).
 * @return {String} path to country's flag or unknown country flag.
 */
function getFlagByCode(code) {
    if (countries.includes(code)) {
        return chrome.runtime.getURL("/img/flags/" + code + ".svg");
    } else {
        return chrome.runtime.getURL("/img/flags/_flag.svg");
    }
}

/**
 * Get team flag path by country iso code.
 *
 * @param  {String} partyName team code.
 * @return {String} path to team flag or unknown team flag.
 */
function getParty(partyName) {
    if (parties.includes(partyName)) {
        return chrome.runtime.getURL("/img/parties/" + partyName + ".svg");
    } else {
        return chrome.runtime.getURL("/img/parties/_flag.svg");
    }
}

/**
 * Get country flag ToolTip text.
 *
 * @return {String} ToolTip text.
 */
function getFlagTooltip() {
    if (pathFinder["side"]) {
        return chrome.i18n.getMessage("countryStatsWIP");
    } else {
        return chrome.i18n.getMessage("404");
    }
}

/**
 * Get team flag Tooltip.
 *
 * @return {String} ToolTip text.
 */
function getSideTooltip() {
    let unixTimestamp = +pathFinder["timestamp"];
    let milliseconds = unixTimestamp * 1000; // 1575909015000
    let dateObject = new Date(milliseconds);
    let humanDateFormat = dateObject.toLocaleString();

    if (pathFinder["side"] === "UN") {
        return (
            chrome.i18n.getMessage("UN_pathfinder_prefix") +
            pathFinder["name"] +
            chrome.i18n.getMessage("pathfinder_from") +
            pathFinder["country"] +
            chrome.i18n.getMessage("UN_date") +
            humanDateFormat +
            chrome.i18n.getMessage("clickToViewColdWarStats")
        );
    } else if (pathFinder["side"] === "NATO") {
        return (
            chrome.i18n.getMessage("NATO_pathfinder_prefix") +
            pathFinder["name"] +
            chrome.i18n.getMessage("pathfinder_from") +
            pathFinder["country"] +
            chrome.i18n.getMessage("NATO_date") +
            humanDateFormat +
            chrome.i18n.getMessage("clickToViewColdWarStats")
        );
    } else if (pathFinder["side"] === "SOVIET") {
        return (
            chrome.i18n.getMessage("SOV_pathfinder_prefix") +
            pathFinder["name"] +
            chrome.i18n.getMessage("pathfinder_from") +
            pathFinder["country"] +
            chrome.i18n.getMessage("SOV_date") +
            humanDateFormat +
            chrome.i18n.getMessage("clickToViewColdWarStats")
        );
    }
}

/**
 * Format SS to MM:SS.
 *
 * @param  {Number} time SS.
 * @return {String} Time in MM:SS.
 */
function formatTime(time) {
    time = Math.round(time);

    const minutes = Math.floor(time / 60);
    let seconds = time - minutes * 60;

    seconds = seconds < 10 ? "0" + seconds : seconds;

    return minutes + ":" + seconds;
}

/**
 * Transform control panel to 1st submitting stage.
 *
 * 1st stage lets select segment and test it.
 * @param  {Number} start start timecode of potential's segment.
 * @param  {Number} end end timecode of potential's segment.
 */
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

    const ytplayer = document.querySelector(".html5-video-player");
    const progressbar = ytplayer.querySelector(".ytp-play-progress");
    const loadbar = ytplayer.querySelector(".ytp-load-progress");

    updateProgressBar = function () {
        progressbar.style.transform = "scaleX(" + v.currentTime / v.duration + ")";
        $(".ytp-time-current").text(formatTime(v.currentTime));
    };

    updateBufferProgress = function () {
        loadbar.style.transform = "scaleX(" + v.buffered.end(v.buffered.length - 1) / v.duration + ")";
    };

    v.addEventListener("timeupdate", updateProgressBar);
    v.addEventListener("progress", updateBufferProgress);

    keepControlsOpen = setInterval(function () {
        $(".html5-video-player").removeClass("ytp-autohide");
    }, 100);

    segStartInput.value = +start.toFixed(1);

    segEndInput.value = +end.toFixed(1);

    if (+segEndInput.value >= v.duration) {
        segEndInput.value = +v.duration.toFixed(1) - 0.5;
    }

    segStartInput.style.width = +v.duration.toFixed(1).length * 6 + 20 + "px";
    segEndInput.style.width = +v.duration.toFixed(1).length * 6 + 20 + "px";

    uploadButton.style.display = "block";
    helpButton.style.display = "block";

    if (settings["lazy"]) {
        lazyButton.style.opacity = "1.0"
    } else {
        lazyButton.style.opacity = "0.5"
    }

    lazyButton.style.display = "block";

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

    segControlsNumberInput.value = "10";

    replayButtonImage.src = getIconPath("close-button.svg");
    segControls.style.display = "flex";

    isFirstInputSelect = true;

    set_preview();
    isReportStage1 = true;
    segEndInput.click();
    segEndInput.focus();
}

/**
 * Transform control panel to idle stage.
 */
function disableStage1() {
    clearInterval(keepControlsOpen);
    v.removeEventListener("timeupdate", updateProgressBar);
    v.removeEventListener("progress", updateBufferProgress);

    uploadButton.style.display = "none";
    helpButton.style.display = "none";

    if (settings["show_flags"]) {
        flagButton.style.display = "block";
        if (isSideActive) {
            sideButton.style.display = "block";
        }
    }

    while (barListPreview.firstChild) {
        barListPreview.removeChild(barListPreview.firstChild);
    }

    segControlsNumberInput.style.display = "none";
    keysButton.style.display = "none";
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

    lazyButton.style.display = "none";

    segEndInput.style.display = "none";
    replayButtonImage.src = getIconPath("report-button.svg");
    segControls.style.display = "none";
    isReportStage1 = false;
}

/**
 * Transform control panel from 1st submitting stage to 2st submitting stage.
 *
 * 2nd submitting stage lets to select segment's category, tick checboxs and submit it with comment.
 */
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

    lazyButton.style.display = "none";

    keysButton.style.display = "none";
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

    segControlsNumberInput.value = "10";
    mainButton.style.display = "none";
    isReportStage2 = true;
}

/**
 * Transform control panel from 2nd submitting stage to 1st submitting stage.
 */
function disableStage2() {
    uploadButton.style.display = "block";
    helpButton.style.display = "block";

    flagButton.style.display = "none";
    sideButton.style.display = "none";

    if (settings["lazy"]) {
        lazyButton.style.opacity = "1.0"
    } else {
        lazyButton.style.opacity = "0.5"
    }

    lazyButton.style.display = "block";

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

/**
 * Inject barList and BarListPreview to progress-bar-container.
 */
function injectBars() {
    barList = document.createElement("ul");
    barListPreview = document.createElement("ul");

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

    document.getElementsByClassName("ytp-progress-bar-container")[0].insertAdjacentElement("afterbegin", barList);
    document.getElementsByClassName("ytp-progress-bar-container")[0].insertAdjacentElement("afterbegin", barListPreview);
}

/**
 * Create empty bar.
 *
 * @return {HTMLElement} <li></li> bar to be added to barList or barListPreview.
 */
function createBar() {
    let bar = document.createElement("li");
    bar.style.display = "inline-block";
    bar.style.height = "3px";
    bar.innerText = "\u00A0";
    return bar;
}

/**
 * Add Bar To List.
 *
 * @param  {Number} a Segment's start timecode.
 * @param  {Number} b Segment's end timecode.
 * @param  {String} color Start timecode of potential's segment.
 * @param  {String} opacity Start timecode of potential's segment.
 * @param  {Number} duration Video's duration.
 */
function addBarToList(a, b, color, opacity, duration, target = barList) {
    let element = document.getElementsByClassName("ytp-chapter-hover-container ytp-exp-chapter-hover-container");
    if (element.length > 0) {
        let count = 0
        let chaptersWidth = 0
        let margin = parseInt(element[0].style.marginRight, 10)

        for (let item of element) {
            count += 1
            chaptersWidth += parseInt(item.style.width, 10)
        }

        let secondInPc = chaptersWidth / duration * 100 / (chaptersWidth + count * margin)
        let secondInPx = chaptersWidth / duration
        let marginizer = margin * 100 / (chaptersWidth + count * margin)

        let width = (b - a) * secondInPc;
        let progress = 0;

        for (let item of element) {
            let itemWidth = parseInt(item.style.width, 10)
            progress += itemWidth / secondInPx
            if (progress >= a && progress <= b - 1) {
                width += marginizer
            }
            if (progress >= b) {
                break
            }
        }
        width = Math.floor(width * 100) / 100;
        let bar = createBar();
        bar.style.backgroundColor = color;
        bar.style.opacity = opacity;
        bar.style.width = width + "%";
        target.insertAdjacentElement("beforeEnd", bar);
    } else {
        let width = ((b - a) / duration) * 100;
        width = Math.floor(width * 100) / 100;
        let bar = createBar();
        bar.style.backgroundColor = color;
        bar.style.opacity = opacity;
        bar.style.width = width + "%";
        target.insertAdjacentElement("beforeEnd", bar);
    }
}

/**
 * Get the color of new bar.
 *
 * @param  {JSON} segment Segment.
 * @return {String} HEX bar color.
 */
function getBarColor(segment) {
    if (segment["source"] === "sb") {
        return "#00FF00";
    } else if (segment["source"] === "adn") {
        if (segment["paid"] === 0) {
            return "#00fcd3";
        } else if (segment["acrate"] * 100 < config["accept"]) {
            return "#0000ff";
        } else {
            return "#ff6100";
        }
    }
}

/**
 * Get the opacity of new bar.
 *
 * @param  {JSON} segment Segment.
 * @return {String} bar opacity.
 */
function getBarOpacity(segment) {
    if (segment["source"] === "sb") {
        return "1.0";
    } else if (segment["source"] === "adn") {
        if (segment["paid"] === 0) {
            return "1.0";
        } else if (segment["trust"] * 100 < config["trust"]) {
            return "1.0";
        } else {
            return "1.0";
        }
    }
}

/**
 * Set all segments.
 *
 * @param  {JSON} segs JSON of all known segments.
 * @param  {Number} duration Video's duration.
 * @return {String} bar opacity.
 */
function set(segs, duration) {
    while (barList.firstChild) {
        barList.removeChild(barList.firstChild);
    }

    if (!segs || !duration || segs.length === 0) {
        console.log("incorrect args");
        return;
    }

    //console.log(segs);
    duration = Math.floor(duration);
    addBarToList(0, segs[0]["data"]["timestamps"]["start"], "#FFFFFF", "0.0", duration);

    for (let i = 0; i < segs.length; i++) {
        if (i + 1 < segs.length) {
            addBarToList(segs[i]["data"]["timestamps"]["start"], segs[i]["data"]["timestamps"]["end"] - 0.7, getBarColor(segs[i]), getBarOpacity(segs[i]), v.duration);
            addBarToList(segs[i]["data"]["timestamps"]["end"] - 0.7, segs[i + 1]["data"]["timestamps"]["start"], "#00FF00", "0.0", v.duration);
        } else {
            addBarToList(segs[i]["data"]["timestamps"]["start"], segs[i]["data"]["timestamps"]["end"], getBarColor(segs[i]), getBarOpacity(segs[i]), v.duration);
        }
    }
}

/**
 * Set preview bar.
 */
function set_preview() {
    while (barListPreview.firstChild) {
        barListPreview.removeChild(barListPreview.firstChild);
    }

    duration = Math.floor(v.duration);
    let width = 0;

    const preview_seg = [0];

    preview_seg[1] = segStartInput.value;
    preview_seg[2] = segEndInput.value - 0.7;

    addBarToList(0, preview_seg[1], "#FFFF00", "0.0", duration, barListPreview)
    addBarToList(preview_seg[1], preview_seg[2], "#FFFF00", "1.0", duration, barListPreview)
}

/**
 * Add events on youtube html5 video.
 *
 * It handles all skipping functionality.
 */
function addVideoEvents() {
    v.addEventListener("timeupdate", function () {
        if (isModInProgress) {
            if (isPreviewInsideMod) {
                if (this.currentTime >= segEndInput.value) {
                    v.pause();
                    isPreviewInsideMod = false;
                }
            }
            if (isPreviewOutsideMod) {
                if (v.currentTime >= segStartInput.value) {
                    v.currentTime = segEndInput.value;
                    isPreviewOutsideMod = false;
                    setTimeout(function () {
                        v.pause();
                    }, 1500);
                }
            }
        } else {
            if (!isReportStage1 && !isReportStage2) {
                if (timestamps.length > 0) {
                    if (getComputedStyle(document.getElementsByClassName("ytp-play-progress ytp-swatch-background-color")[0], null).backgroundColor !== "rgb(255, 204, 0)") {
                        for (let i = 0; i < timestamps.length; i++) {
                            if (this.currentTime >= timestamps[i]["data"]["timestamps"]["start"] && this.currentTime <= timestamps[i]["data"]["timestamps"]["start"] + 0.8) {
                                if (timestamps[i]["source"] === "adn") {
                                    let whatshouldido = whatShouldIDo(timestamps[i]);
                                    if (whatshouldido) {
                                        whatshouldido = 2;
                                    } else {
                                        whatshouldido = 1;
                                    }
                                    if (whatshouldido === 2) {
                                        currentSkipSource = "adn";
                                        isReportActive = false;
                                        isReplace = false;
                                        switchModes();
                                        currentSkip = [timestamps[i]["data"]["timestamps"]["start"], timestamps[i]["data"]["timestamps"]["end"], timestamps[i]["id"]];
                                        addSegmentSkip(currentSkip);
                                        v.currentTime = timestamps[i]["data"]["timestamps"]["end"] + 0.1;
                                        adplayer.style.display = "block";
                                        skipImage1.style.transform = "";
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
                                        switchModes();
                                        currentSkip = [timestamps[i]["data"]["timestamps"]["start"], timestamps[i]["data"]["timestamps"]["end"], timestamps[i]["id"]];
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
                                    switchModes();
                                    currentSkip = [timestamps[i]["data"]["timestamps"]["start"], timestamps[i]["data"]["timestamps"]["end"]];
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
                            const r = confirm(chrome.i18n.getMessage("areYouSure"));
                            if (r === true) {
                                if (settings["lazy"]) {
                                    let json = {
                                        vID: currentVideoId,
                                        secret: settings["secret"],
                                        start: +segStartInput.value,
                                        end: +segEndInput.value,
                                    };
                                    $.ajax({
                                        url: `${baseUrl}/api/v0/addLazySegment`,
                                        type: "POST",
                                        data: JSON.stringify(json),
                                        contentType: "application/json",
                                        async: false,
                                        success: function (data) {
                                            alert("Success | Удачно\n" + JSON.stringify(data));
                                            disableStage1();
                                            resetAndFetch();
                                            chrome.storage.sync.set({segments: settings["segments"] + 1});
                                        },
                                        error: function (s, status, error) {
                                            alert("error\n" + JSON.stringify(s.responseJSON) + "\n" + status + "\n" + error);
                                            isReportStage2 = !isReportStage2;
                                        },
                                    })
                                } else {
                                    enableStage2();
                                }
                            } else {
                                isReportStage2 = !isReportStage2;
                            }
                        }, 1500);
                    }
                }
            }
        }
    });

    v.addEventListener("seeking", (event) => {
        if (isReportStage1 && !isReportStage2 && !isPreviewOutside && !isPreviewOutsideBeforeSend) {
            if (isToggle) {
                if (v.currentTime < segEndInput.value) {
                    segStartInput.value = +v.currentTime.toFixed(1);
                    segStartInput.click();
                    segStartInput.focus();
                }
            } else {
                if (v.currentTime > segStartInput.value) {
                    segEndInput.value = +v.currentTime.toFixed(1);
                    segEndInput.click();
                    segEndInput.focus();
                }
            }
            set_preview();
        }
    });
}

/**
 * Decide if segment will be auto-skipped and generate String with reasons if not.
 *
 * @param  {JSON} segment Segment.
 * @return {String} True - auto-skip, False - manual skip.
 */
function whatShouldIDo(segment) {
    currentSkipReason = chrome.i18n.getMessage("WNS_1");
    skip = true;

    if (whitelist.includes(currentChannelId)) {
        currentSkipReason += chrome.i18n.getMessage("WNS_2").replace("currentChannelId", currentChannelId);
        skip = false;
    }
    if (!(segment["moderated"] || segment["trust"] * 100 > config["trust"])) {
        currentSkipReason += chrome.i18n
            .getMessage("WNS_3")
            .replace("CURRENT", segment["trust"] * 100)
            .replace("NEEDED", config["trust"]);
        skip = false;
    }
    if (segment["ambassador"] === 1) {
        if (segment["paid"] === 0) {
            if (isAdFlagActive) {
                if (!config["love"]["a2"]) {
                    currentSkipReason += chrome.i18n.getMessage("WNS_4A");
                } else {
                    if (skip) {
                        return true;
                    }
                }
            } else {
                if (!config["love"]["a1"]) {
                    currentSkipReason += chrome.i18n.getMessage("WNS_5A");
                } else {
                    if (skip) {
                        return true;
                    }
                }
            }
        } else if (segment["acrate"] * 100 < config["accept"]) {
            if (isAdFlagActive) {
                if (!config["hate"]["a2"]) {
                    currentSkipReason += chrome.i18n.getMessage("WNS_6A");
                } else {
                    if (skip) {
                        return true;
                    }
                }
            } else {
                if (!config["hate"]["a1"]) {
                    currentSkipReason += chrome.i18n.getMessage("WNS_7A");
                } else {
                    if (skip) {
                        return true;
                    }
                }
            }
        } else {
            if (isAdFlagActive) {
                if (!config["fine"]["a2"]) {
                    currentSkipReason += chrome.i18n.getMessage("WNS_8A");
                } else {
                    if (skip) {
                        return true;
                    }
                }
            } else {
                if (!config["fine"]["a1"]) {
                    currentSkipReason += chrome.i18n.getMessage("WNS_9A");
                } else {
                    if (skip) {
                        return true;
                    }
                }
            }
        }
    } else {
        if (segment["paid"] === 0) {
            if (isAdFlagActive) {
                if (!config["love"]["y2"]) {
                    currentSkipReason += chrome.i18n.getMessage("WNS_4");
                } else {
                    if (skip) {
                        return true;
                    }
                }
            } else {
                if (!config["love"]["y1"]) {
                    currentSkipReason += chrome.i18n.getMessage("WNS_5");
                } else {
                    if (skip) {
                        return true;
                    }
                }
            }
        } else if (segment["acrate"] * 100 < config["accept"]) {
            if (isAdFlagActive) {
                if (!config["hate"]["y2"]) {
                    currentSkipReason += chrome.i18n.getMessage("WNS_6");
                } else {
                    if (skip) {
                        return true;
                    }
                }
            } else {
                if (!config["hate"]["y1"]) {
                    currentSkipReason += chrome.i18n.getMessage("WNS_7");
                } else {
                    if (skip) {
                        return true;
                    }
                }
            }
        } else {
            if (isAdFlagActive) {
                if (!config["fine"]["y2"]) {
                    currentSkipReason += chrome.i18n.getMessage("WNS_8");
                } else {
                    if (skip) {
                        return true;
                    }
                }
            } else {
                if (!config["fine"]["y1"]) {
                    currentSkipReason += chrome.i18n.getMessage("WNS_9");
                } else {
                    if (skip) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
}

/**
 * Tell the server that the segment is skipped.
 *
 * @param  {JSON} segment Segment.
 */
function addSegmentSkip(segment) {
    canUpgradeLazy = false;
    $.ajax({
        dataType: "json",
        type: "POST",
        contentType: "application/json",
        url: `${baseUrl}/api/v0/addSegmentSkip`,
        data: JSON.stringify({sID: segment[2], secret: settings["secret"]}),
        success: function (sb) {
            //alert(`Success. Reason: ${sb}`);
            canUpgradeLazy = sb["can_upgrade_lazy"];
            switchModes();
        },
    });
}
