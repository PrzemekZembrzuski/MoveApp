const config  = require('config');


class DatePicker {
    // initialize date picker
    static initDateInput() {
        return bulmaCalendar.attach('[type="date"]', {startDate: Date.now(),...config.get('dateOptions')});
    }
}    

module.exports = DatePicker
