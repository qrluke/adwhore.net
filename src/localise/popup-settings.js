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


  setChildTextNode('nicknameDesc', chrome.i18n.getMessage("nicknameDesc"));
  setChildTextNode('secretDesc1', chrome.i18n.getMessage("secretDesc1"));
  setChildTextNode('secretDesc2', chrome.i18n.getMessage("secretDesc2"));
  setChildTextNode('settingsString', chrome.i18n.getMessage("settingsString"));
  setChildTextNode('valueString', chrome.i18n.getMessage("valueString"));
  setChildTextNode('showFlagSetting', chrome.i18n.getMessage("showFlagSetting"));

  setChildTextNode('stats_users', chrome.i18n.getMessage("stats_users"));
  setChildTextNode('stats_seg', chrome.i18n.getMessage("stats_seg"));
  setChildTextNode('stats_mod', chrome.i18n.getMessage("stats_mod"));
  setChildTextNode('stats_skip', chrome.i18n.getMessage("stats_skip"));
  setChildTextNode('stats_saved', chrome.i18n.getMessage("stats_saved"));
  setChildTextNode('stats_sec', chrome.i18n.getMessage("stats_sec"));
  setChildTextNode('switchSide', chrome.i18n.getMessage("switchSide"));

  setChildTextNode('whitelistDesc', chrome.i18n.getMessage("whitelistDesc"));

  setChildTextNode('caption1', chrome.i18n.getMessage("caption1"));
  setChildTextNode('caption2', chrome.i18n.getMessage("caption2"));
  setChildTextNode('caption3', chrome.i18n.getMessage("caption3"));

  setChildTextNode('stats1', chrome.i18n.getMessage("stats1"));
  setChildTextNode('stats2', chrome.i18n.getMessage("stats2"));
  setChildTextNode('stats3', chrome.i18n.getMessage("stats3"));
  setChildTextNode('stats4', chrome.i18n.getMessage("stats4"));
  setChildTextNode('stats5', chrome.i18n.getMessage("stats5"));
  setChildTextNode('stats6', chrome.i18n.getMessage("stats6"));
  setChildTextNode('stats7', chrome.i18n.getMessage("stats7"));
  setChildTextNode('stats8', chrome.i18n.getMessage("stats8"));
  setChildTextNode('stats9', chrome.i18n.getMessage("stats9"));
  setChildTextNode('stats10', chrome.i18n.getMessage("stats10"));
  setChildTextNode('stats11', chrome.i18n.getMessage("stats11"));
  setChildTextNode('stats12', chrome.i18n.getMessage("stats12"));

}

init();



