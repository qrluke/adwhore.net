function setChildTextNode(elementId, text) {
    document.getElementById(elementId).innerHTML = text;
}

function init() {
    for (const x of Array(50).keys()) {
        setChildTextNode("w"+x, chrome.i18n.getMessage("w"+x))
    }
}

init();



