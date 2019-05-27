const printJS = require('print-js')
const editJsonFile = require("edit-json-file");
const path = require('path');
const config = require('config');
const DatePicker = require('./DatePicker');
const Search = require('./Search');
const search = new Search()
const Notification = require('./Notification');
const notification = new Notification();



class Utils {
    constructor() {
        this.file = editJsonFile(config.get('listFilepath'));
        this.date = new Date();
        this.startDate = new Date(this.date.getFullYear(), this.date.getMonth() - 1, 1);
        this.endDate = new Date(this.date.getFullYear(), this.date.getMonth() - 1, new Date(this.date.getFullYear(), this.date.getMonth(), 0).getDate())
        // init datepicker & assign result to variable
        this.datapicker = DatePicker.initDateInput('#utils > input[type="date"]', { isRange: true, startDate: this.startDate, endDate: this.endDate, ...config.get('dateOptions') })[0];
        this.watch()
    }
    prepareJSON() {
        const list = this.file.get('list');
        const json = list.filter(document => {
            return search.getIds().includes(document.id)
        })
        const properties = [
            { field: 'filename', displayName: 'Nazwa' },
            { field: 'factureNumber', displayName: 'Numer faktury'},
            { field: 'department', displayName: 'Oddział' },
            { field: 'contractor', displayName: 'Kontrahent' },
            { field: 'date', displayName: 'Data' }
        ]
        return {
            json,
            properties
        }
    }
    print(json, properties) {
        printJS({ printable: json, type: 'json', properties })
    }
    watch() {
        document.querySelector('#utils > button').addEventListener('click', e => {
            search.setDate = this.datapicker.value();
            if (search.getIds().length === 0) {
                notification.emit('brak wyników', 'error');
                return
            }
            const { json, properties } = this.prepareJSON();
            this.print(json, properties)

        })
    }
}

module.exports = Utils