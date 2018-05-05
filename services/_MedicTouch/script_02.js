/*************************************************************************
 * BOT - MedicTouch
 *
 * This 'bot' is functional alone for '_MedicTouch'.
 * and this allow download informations of the clients.
 *-------------------------------------------------------------------------
 *
 * Created      18/05/2018 11:33 AM
 * Author       Jesus Perez jasp402@gmail.com
 * Copyright    Codisoti \u2013 www.codisoti.pe
 * Version      1.0.0
 *
 *************************************************************************/
const bots = require('./lib/class.bot');
const c = require('./lib/class.const');
let bot = new bots();
let botDetail;
// =========================================================================
//  RUN BOT & EXECTUTE SUITE OF TEST
// =========================================================================
//ToDo - Add in constant values  >important!
describe('BOT - MedicTouch  -  Create flowSheet for patient', () => {
    let patients = bot.getPatientsFlowSheets('false');

    it('should, get Credentials', () => {
        botDetail = bot.getInformation('medictouch')[0];
    });

    it('should, load webSite', () => {
        browser.url(botDetail.baseUrl);
        browser.windowHandleMaximize();
    });

    it('should, load iFrame  ', () => {
        browser.frame(c.FRAME_INDEX);
        browser.isExisting(c.INPUT_USERNAME);
    });

    it('should, logIn inside website', () => {
        $(c.INPUT_USERNAME).setValue(botDetail.username); //userName
        $(c.INPUT_PASSWORD).setValue(botDetail.password); //Password
        $(c.BTN_LOGIN).click();
    });

    it('should, enter into HER', () => {
        browser.click(c.LINK_HER);
        browser.pause(3000);
        browser.isExisting(c.DIV_TOGGLE) && browser.click(c.DIV_TOGGLE);
    });


    patients.forEach((obj, i) => {
        //if (obj.chart === 'MUDEMO'){
        let arFlowSheets = [];
        let flowSheets = {};
        it('should, load patient:' + obj.chart, function () {
            bot.logError('Chart N°:' + obj.chart + ' | Name: ' +obj.patient);
            browser.pause(3000);
            browser.waitForExist(c.BTN_SEARCH_PATIENT);
            browser.click(c.BTN_SEARCH_PATIENT);
            browser.waitForVisible(c.INPUT_CHART_NUMBER);
            $(c.INPUT_CHART_NUMBER).setValue(obj.chart);
            browser.execute(c.EVENT_SEARCH_PATIENT);
            browser.pause();
            browser.click(c.DIV_BTN_PATIENT);
        });

        it('should,     --- Scraping LMP (Last Menstrual Period)', () => {
            browser.waitForVisible(c.DIV_MENU_TOP);
            browser.pause(3000);
            let Attr = browser.getCssProperty(c.DIV_MENU_TOP, 'left');
            if (Attr.value === '0px') browser.click(c.DIV_BTN_NAV_LEFT);
            browser.pause();
            browser.waitForVisible(c.DIV_OPTION_VITALS_SIGN);
            browser.click(c.DIV_OPTION_VITALS_SIGN);
            browser.pause(6000);
            let LMPDate = browser.isExisting(c.TD_LMP_DATE) ? browser.getText(c.TD_LMP_DATE) : '';
            flowSheets['LMP'] =  LMPDate;
        });

        it('should,     --- Scraping Surgical Hx (Hysterectomy) ', () => {
            browser.click('#surgicalDivTopFrame');
            browser.waitForVisible('#medicalhxdata');
            flowSheets['HYS'] = $$('#medicalhxdata tr').length > 1 ?  bot.scrapingField('Hysterectomy') : '';
        });

        it('should,     --- Scraping SA (Sex Activity)', () => {
            browser.click('#socialHxDivTopFrame');
            browser.pause(3000);
            $$('.formTabs.active div').map(x => x.getText() === "Sexual History" && x).filter(y => y !== false)[0].click();
            browser.waitForExist('.dataTable');
            browser.pause(3000);
            let yes = browser.getAttribute(c.DIV_SEX_ACTIVITY_YES, 'class');
            let no = browser.getAttribute(c.DIV_SEX_ACTIVITY_NO, 'class');
            let question = yes === 'selectButton selected' ? 'Yes' : '' || no === 'selectButton selected' ? 'No' : '';
            let details = {'yes': yes, 'no': no};
            flowSheets['SA'] = question;
            flowSheets['SADetail'] = details;
            flowSheets['STD'] = $('div.selectButton.rotatingOptionDiv').getText() || '';
            let PP = '//*[@id="formContent"]/table/tbody/tr[15]/td[2]/select';
            flowSheets['PP'] = browser.isExisting(PP) ? browser.getValue(PP).replace('-Select-','') : '';
        });

        it('should,     --- Scraping "Obstetric Hx" (Cesarean,NSVD,Gravida Para)', () => {
            $$('#topTabs div')[12].click();
            browser.pause(2000);
            browser.waitForExist('#PregHX');
            let deliveryType = [];
            $$('#PregHX tbody tr select[name="deliveryType"]')
                .forEach(x => {
                    deliveryType.push(x.getValue())
                });
            let deliveryTypeDate = [];
            $$('#PregHX tbody tr td input.datePicker')
                .forEach(x => {
                    deliveryTypeDate.push(x.getValue())
                });
            let objResult = bot.countElementRepeat(deliveryType);
            let ojbResultDate = bot.getLastDateObstetrics(deliveryType, deliveryTypeDate);
            flowSheets['CS'] = objResult.Caesarean || '';
            flowSheets['CSDate'] = ojbResultDate.Caesarean || 0;
            flowSheets['NSVD'] = objResult.Natural || '';
            flowSheets['NSVDDate'] = ojbResultDate.Natural || 0;
            flowSheets['GP'] = $('#totalPreg').getValue();  //deliveryType.length;

            flowSheets['FT'] = $('#fullTerm').getValue();
            flowSheets['PREM'] = $('#preMature').getValue();
            flowSheets['ABIND'] = $('#abInduced').getValue();
            flowSheets['ABSPO'] = $('#abSpontaneous').getValue();
            flowSheets['ECT'] = $('#ectopics').getValue();
            flowSheets['MBIRT'] = $('#multipleBirth').getValue();
            flowSheets['LIV'] = $('#living').getValue();

            flowSheets['GPData'] = deliveryTypeDate.reverse()[0];
        });

        it('should,     --- Scraping "Encounters" (DB,MMG,Last Pap Smear)', () => {
            browser.click(c.DIV_BTN_NAV_RIGHT);
            browser.waitForVisible(c.DIV_OPTION_ENCOUNTERS);
            browser.click(c.DIV_OPTION_ENCOUNTERS); //Encounters

            browser.waitForExist(c.TABLE_ENCOUNTERS);
            browser.pause();
            let countEncounters = $$(c.TABLE_ENCOUNTERS_TR).length;
            bot.logError('Encounters:' + countEncounters);
            if (countEncounters === 1) return true; //No tiene datos en "Encounters"

            browser.click(c.BTN_ENCOUNTERS_SOAP);

            browser.waitForEnabled(c.BTN_TOGGLE_S);
            browser.execute(c.EVENT_DISPLAY_BLOCK);

            browser.waitForVisible(c.BTN_CHIEF_COMP);
            browser.click(c.BTN_CHIEF_COMP);
            browser.execute(c.EVENT_DISPLAY_NONE);
            browser.pause(5000);
            browser.waitForVisible(c.BTN_GENITOURINARY);
            browser.click(c.BTN_GENITOURINARY);

            browser.waitForVisible(c.BTN_WELL_WOMAN_EXAM);
            browser.click(c.BTN_WELL_WOMAN_EXAM);

            browser.waitForVisible(c.SELECT_DB);
            flowSheets['DB'] = browser.getValue(c.SELECT_DB).replace('-Select-','');
            flowSheets['MMG'] = browser.getValue(c.SELECT_MMG).replace('-Select-','');
            flowSheets['LPS'] = browser.getValue(c.SELECT_LPS).replace('-Select-','');

            arFlowSheets.push(flowSheets);
        });

        it('should,     --- Create flowSheets', () => {
            console.log(JSON.stringify(arFlowSheets));
            if (arFlowSheets.length < 1) {
                bot.logError('The flowSheets was not created - NOT CONTAIN INFORMATION');
                return true;
            }
            let arFlowSheets2 = arFlowSheets[0];
            $$('#topTabs div')[5].click(); // Flow Sheets
            browser.waitForVisible('#V_otherflowSheets301827');
            $('#V_otherflowSheets301827').click();  //Patient Main Information;
            browser.waitForVisible('#addAResult');
            $('#addAResult').click();
            browser.waitForVisible('#column2');
            console.log('arFlowSheets2', arFlowSheets2);
            /**Begin set data in flowSheets**/
            browser.pause();

            browser.execute(`document.getElementById('column2').value="${arFlowSheets2.LMP}"`);

            $('#column3').selectByValue(arFlowSheets2.SA); //Sexually Active

            $('#column4').selectByValue(arFlowSheets2.PP);  // Pregnancy Prevention \ Birth Control

            $('#column5').setValue(arFlowSheets2.CS); //C\S Cesarean

            browser.execute(`document.getElementById('column6').value="${arFlowSheets2.CSDate}"`);

            $('#column7').setValue(arFlowSheets2.NSVD); //Birth Normal Vaginal

            browser.execute(`document.getElementById('column8').value="${arFlowSheets2.NSVDDate}"`);

            $('#column9').setValue(arFlowSheets2.GP); //date of Birth Normal Vaginal

            $('#column10').setValue(arFlowSheets2.FT); //

            $('#column11').setValue(arFlowSheets2.PREM); //
            $('#column12').setValue(arFlowSheets2.ABIND); //
            $('#column13').setValue(arFlowSheets2.ABSPO); //
            $('#column14').setValue(arFlowSheets2.ECT); //
            $('#column15').setValue(arFlowSheets2.MBIRT); //
            $('#column16').setValue(arFlowSheets2.LIV); //
            browser.execute(`document.getElementById('column17').value="${arFlowSheets2.HYS}"`);

            $('#column18').selectByVisibleText(arFlowSheets2.MMG);
            $('#column19').selectByVisibleText(arFlowSheets2.LPS);
            $('#column20').selectByVisibleText(arFlowSheets2.DB);
            $$('.ui-button-text').forEach(x => {
                if (x.getText() === 'Save' && x.isVisible()) {
                    x.click()
                }
            });
            browser.pause();
            if (browser.isVisible('#emptyValuesAlertDialog')) {
                browser.click('/html/body/div[33]/div[11]/div/button/span');
                browser.click('/html/body/div[34]/div[11]/div/button[3]/span');
            }else{
                bot.changeStatusFlowheets(obj);
            }
        });
        //}
    });
});