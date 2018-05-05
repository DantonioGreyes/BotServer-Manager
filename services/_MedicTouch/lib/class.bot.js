const helpers = require('../../../lib/class.helpers.js');
const fs = require('fs');
const c = require('./class.const');
const _ = require('lodash');

class bots extends helpers {
    getInformation(botname) {
        let query = {"botname" : botname};
        return super._dbReadSync('bots_information',query);
    }

    getPatientsFlowSheets(status) {
        let query = {'flow_sheets': status};
        return super._dbReadSync('medictouch_patient', query);
    }

    scrapingField(field){
        let algo = $$('#medicalhxdata tr').map((x, i) => {
            if (i > 0) return x.getText().replace('Edit Details', '').replace(' ', '_').trim()
        }).splice(1);
        return _.chunk(algo, 2).filter(x=>x[0] === field.replace(' ', '_'))[0][1];
    }

    scrapingPatientCheckIn() {
        //ToDo - join this (replace(' ','_').replace('-','_'))
        let data = [];
        let arrResult = [];
        $$('#dailySchedAppts tbody tr').forEach((x, i) => data.push(x.$$('td').map(y => y.getText().trim())));
        let header = data[0].map(x=>x.toLowerCase().replace(' ','_').replace('-','_'));
        delete data[0];
        //-----------------------------------------------------
        //ToDo - En un futuro conseguire un mejor metodo que este
        data.forEach(x => {
            let obj = {};
            x.forEach((y, i) => {
                if(i === 0){
                    obj['flow_sheets'] = 'false';
                    obj['date'] = super.customDate();
                }
                obj[header[i]] = y
            });
            arrResult.push(obj);
        });
        let result = _.filter(arrResult, {status: 'CHECKED IN'});
        super._dbCreate('medictouch_patient', result);
        return JSON.stringify(result);
    }

    getLastDateObstetrics(a,b){
        return _.zipObject(a.reverse(), b.reverse())
    }

    countElementRepeat(array) {
        var counts = {};
        array.forEach(x => {
            counts[x] = (counts[x] || 0) + 1;
        });
        return counts;
    }

    changeStatusFlowheets(obj){
        let query = {"date" : obj.date, 'chart':obj.chart};
        let newValue = {"flow_sheets" : "true"};
        let collection = 'medictouch_patient';
        return super._dbUpdate(collection, query, newValue);
    }
}

module.exports = bots;