function setChildTextNode(elementId, text) {
  document.getElementById(elementId).innerHTML = text;
}

function setTitle(elementId, text) {
  document.getElementById(elementId).title = text;
}

function init() {
  setChildTextNode('note_the_alpha', chrome.i18n.getMessage("note_the_alpha"));
  setChildTextNode('skip_trust_selector', chrome.i18n.getMessage("skip_trust_selector"));
  setTitle('skip_trust_selector', chrome.i18n.getMessage("skip_trust_selector_title"));


  setChildTextNode('acceptable_selector', chrome.i18n.getMessage("acceptable_selector"));
  setTitle('acceptable_selector', chrome.i18n.getMessage("acceptable_selector_title"));

  setChildTextNode('table_title', chrome.i18n.getMessage("table_title"));
  setTitle('table_title', chrome.i18n.getMessage("table_title_title"));

  setTitle('bad_ads', chrome.i18n.getMessage("bad_ads_title"));
  setTitle('acceptable_ads', chrome.i18n.getMessage("acceptable_ads_title"));
  setTitle('awesome_ads', chrome.i18n.getMessage("awesome_ads_title"));

  setChildTextNode('bad_youtuber', chrome.i18n.getMessage("bad_youtuber"));
  setTitle('bad_youtuber', chrome.i18n.getMessage("bad_youtuber_title"));

  setChildTextNode('good_youtuber', chrome.i18n.getMessage("good_youtuber"));
  setTitle('good_youtuber', chrome.i18n.getMessage("good_youtuber_title"));

  setChildTextNode('bad_ambassador', chrome.i18n.getMessage("bad_ambassador"));
  setTitle('bad_ambassador', chrome.i18n.getMessage("bad_ambassador_title"));

  setChildTextNode('good_ambassador', chrome.i18n.getMessage("good_ambassador"));
  setTitle('good_ambassador', chrome.i18n.getMessage("good_ambassador_title"));

  setTitle('settingSponsorBlock', chrome.i18n.getMessage("sponsorBlock"));
  setChildTextNode('settingSponsorBlock', chrome.i18n.getMessage("settingSponsorBlock"));

  setChildTextNode('nicknameDesc', chrome.i18n.getMessage("nicknameDesc"));
  setChildTextNode('secretDesc1', chrome.i18n.getMessage("secretDesc1"));
  setChildTextNode('secretDesc2', chrome.i18n.getMessage("secretDesc2"));
  setChildTextNode('settingsString', chrome.i18n.getMessage("settingsString"));
  setChildTextNode('valueString', chrome.i18n.getMessage("valueString"));
  setChildTextNode('showFlagSetting', chrome.i18n.getMessage("showFlagSetting"));

}

init();

