'use strict';
module.exports = Object.freeze({
    URL_REQUEST_INFORMATION: 'http://localhost:3000/botsinformation/',
    BITRIX_BASE_URL: 'https://b24.prmbilling.com/server_bot/',
    BITRIX_USERNAME: 'codisoti',
    BITRIX_PASSWORD: 'jazabacho',
    INPUT_USERNAME: '#username',
    INPUT_PASSWORD: '#password',
    BTN_LOGIN: 'input[value=\"Log In\"]',
    FRAME_INDEX: 'loginIframe',
    SELECT_PROVIDER: '#FILTER_RESOURCE',
    DIV_SEX_ACTIVITY_YES : '//*[@id="formContent"]/table/tbody/tr[3]/td[2]/div',
    DIV_SEX_ACTIVITY_NO : '//*[@id="formContent"]/table/tbody/tr[3]/td[3]/div',
    LINK_HER : '//*[@id="app_menu_pms"]/li[2]/a',
    DIV_TOGGLE : '#slideRightToggle',
    BTN_SEARCH_PATIENT : '#tabSearch',
    INPUT_CHART_NUMBER : 'input[name="chartNO"]',
    EVENT_SEARCH_PATIENT : 'patient_search()',
    DIV_BTN_PATIENT : '//*[@id="patientSearchresultTable"]/tbody/tr[2]/td[1]/div',
    DIV_MENU_TOP : '#topTabs',
    DIV_OPTION_ENCOUNTERS : '//*[@id="topTabs"]/div[5]',
    DIV_BTN_NAV_LEFT : '#topNavLeftArrow',
    DIV_BTN_NAV_RIGHT : '#topNavRightArrow',
    DIV_OPTION_VITALS_SIGN : '#vitalsSignDivTopFrame',
    TD_LMP_DATE : '//*[@id="vitalData"]/tbody/tr[2]/td[17]',
    TABLE_ENCOUNTERS: '#medlist1',
    TABLE_ENCOUNTERS_TR : '#medlist1 tbody tr',
    BTN_ENCOUNTERS_SOAP : '#medlist1 tbody tr div.selectButton',
    BTN_TOGGLE_S : '#tabS',
    BTN_CHIEF_COMP : '#tabS_0',
    EVENT_DISPLAY_BLOCK : `document.getElementById('soapTabS').style.display = "block";`,
    EVENT_DISPLAY_NONE : `document.getElementById('soapTabS').style.display = "none";`,
    BTN_GENITOURINARY : '#ps_bid_7197',
    BTN_WELL_WOMAN_EXAM : '//*[@id="working_set"]/table/tbody/tr[10]/td[3]/div',
    SELECT_DB : '#slct_3',
    SELECT_MMG : '#slct_1',
    SELECT_LPS : '#slct_2',
});