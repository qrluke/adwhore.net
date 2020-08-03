function setChildTextNode(elementId, text) {
  document.getElementById(elementId).innerText = text;
}

function init() {
  setChildTextNode('thankYou_title', chrome.i18n.getMessage("thank_you_title"));
  setChildTextNode('thankYou', chrome.i18n.getMessage("thank_you"));
  setChildTextNode('welcome_info_1', chrome.i18n.getMessage("welcome_info_1"));
  setChildTextNode('welcome_info_2', chrome.i18n.getMessage("welcome_info_2"));
  setChildTextNode('welcome_info_3', chrome.i18n.getMessage("welcome_info_3"));

  setChildTextNode('faction_1_name', chrome.i18n.getMessage("faction_1_name"));
  setChildTextNode('faction_1_desc_br', chrome.i18n.getMessage("faction_1_desc_br"));
  setChildTextNode('faction_1_desc', chrome.i18n.getMessage("faction_1_desc"));
  setChildTextNode('faction_1_button', chrome.i18n.getMessage("faction_1_button"));

  setChildTextNode('faction_2_name', chrome.i18n.getMessage("faction_2_name"));
  setChildTextNode('faction_2_desc_br', chrome.i18n.getMessage("faction_2_desc_br"));
  setChildTextNode('faction_2_desc', chrome.i18n.getMessage("faction_2_desc"));
  setChildTextNode('faction_2_button', chrome.i18n.getMessage("faction_2_button"));

  setChildTextNode('faction_3_name', chrome.i18n.getMessage("faction_3_name"));
  setChildTextNode('faction_3_desc_br', chrome.i18n.getMessage("faction_3_desc_br"));
  setChildTextNode('faction_3_desc', chrome.i18n.getMessage("faction_3_desc"));
  setChildTextNode('faction_3_button', chrome.i18n.getMessage("faction_3_button"));
}


init();
