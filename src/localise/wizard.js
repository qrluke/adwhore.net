function setChildTextNode(elementId, text) {
    document.getElementById(elementId).innerHTML = DOMPurify.sanitize(text);
}

function init() {
    for (const x of Array(50).keys()) {
        setChildTextNode("w"+x, chrome.i18n.getMessage("w"+x))
    }
    for (const x of Array(15).keys()) {
        if (x !== 4)
            setChildTextNode("ww"+x, chrome.i18n.getMessage("ww"+x))
    }

}

init();



