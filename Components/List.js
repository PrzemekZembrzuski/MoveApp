const editJsonFile = require("edit-json-file");
const config = require('config');
const path = require('path');
const DatePicker = require('./DatePicker');
const Search = require('./Search');
const Open = require('./Open');

class List {
    constructor() {
        this.file = editJsonFile(path.resolve(config.get('listFilepath')));
        this.table = document.querySelector('#documentList > table');
        this.tableBody = this.table.children[1];
        this.input = document.querySelector('#search > input[type="text"]');
        this.search = new Search(this.input);
        this.datepicker = DatePicker.initDateInput('#documentList > #search > input[type="date"]', { isRange: true,...config.get('dateOptions')})[0];
    }
    addItemToJSON(filename, factureNumber, department, contractor, date, filepath) {
        const listArray = this.file.get('list');
        const id = listArray[0] ? (parseInt(listArray[0].id) + 1).toString() : (0).toString();
        const newObjItem = {
            id,
            filename,
            factureNumber,
            department,
            contractor,
            date,
            filepath
        }
        const newListArray = [newObjItem, ...listArray]
        this.file.set('list', newListArray)
        this.file.save(() => {
            this.reloadJSON();
            this.search.updateIndexes(newObjItem);
            this.addToList();
        })

    }
    reloadJSON(){
        this.file = editJsonFile(path.resolve(config.get('listFilepath')));
    }
    // start list with all elements
    startList(){
        this.addToList()
    }
    //clear all list content
    clear(){
        this.tableBody.innerHTML = null;
    }
    // add items to list table, if no argument add all element to the lits. (argument must be array of items)
    addToList(itemList = this.file.get('list')){
        this.clear();
        itemList.forEach(listItem => {
            const row = `
                 <tr>
                    <td>${listItem['filename']}</td>
                    <td>${listItem['factureNumber']}</td>
                    <td>${listItem['department']}</td>
                    <td>${listItem['contractor']}</td>
                    <td>${listItem['date']}</td>
                    <td><button class="button is-info" data-path="${listItem['filepath']}">Plik</button></td>
                </tr>
            `;
            this.tableBody.insertAdjacentHTML('beforeend', row)
        });
    }
    //update table items, with item of specified id
    updatedTable(ids = []) {
        this.clear();
        const itemsArray = this.file.get('list').filter(listItem => {
            return ids.length !== 0 ? ids.includes(listItem.id.toString()) : false
        })
        this.addToList(itemsArray)
    }

    watch() {
        this.input.addEventListener('input', e => {
            this.search.setInputValue = e.target.value;
            this.updatedTable(this.search.getIds())
        })
        this.datepicker.element.bulmaCalendar.on('select',datepicker=>{
            this.search.setDate = datepicker.data.value();
            this.updatedTable(this.search.getIds())
        })
        this.datepicker.element.bulmaCalendar.on('clear',datepicker=>{
            this.search.setDate = datepicker.data.value();
            this.updatedTable(this.search.getIds())
        })
        this.table.addEventListener('click',e=>{
            if(e.target.nodeName === 'BUTTON'){
                const folderPath = e.target.dataset.path;
                Open.folder(folderPath)
            }
        })
    }
}

module.exports = List