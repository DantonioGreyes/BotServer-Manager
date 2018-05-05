/**************************************************************************
 * BOT - MedicTouch
 *
 * This 'bot' is functional alone for '_MedicTouch'.
 * and this allow download informations of the clients.
 *-------------------------------------------------------------------------
 *
 * Created      18/05/2018 11:33 AM
 * Author       Jesus Perez jasp402@gmail.com
 * Copyright    Codisoti – www.codisoti.pe
 * Version      1.0.0
 *
 **************************************************************************/
const bots = require('./lib/class.bot');
const c = require('./lib/class.const');
let bot = new bots();
let botDetail;
// =========================================================================
//  RUN BOT & EXECTUTE SUITE OF TEST
// =========================================================================
describe('BOT - MedicTouch  -  Scraping Patient CheckIn', () => {
    it('should, get Credentials', () => {
        botDetail = bot.getInformation('medictouch')[0];
        browser.pause();
        console.log(botDetail);
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

    it('should, Enter in Daily Schedule and set filters', () => {
        let URL_DAILY_SCHEDULE = browser.getAttribute('//*[@id="app_menu_pms"]/li[4]/ul/li[1]/a', 'href');
        console.log(URL_DAILY_SCHEDULE);
        browser.url(URL_DAILY_SCHEDULE);
        browser.waitForExist(c.SELECT_PROVIDER);
        browser.selectByVisibleText(c.SELECT_PROVIDER, 'ALL RESOURCES');
    });

    it('should, scraping all patient with status "CHECK IN"', () => {
        bot.scrapingPatientCheckIn();
    });

    it('should, Return to main page', () => {
        browser.url(botDetail.baseUrl);
    });

});

