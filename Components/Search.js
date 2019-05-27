const lunr = require('lunr');
const editJsonFile = require("edit-json-file");
const path = require('path');
const config = require('config');

class Search {
    constructor(input) {
        this.input = input;
        this.file = editJsonFile(config.get('listFilepath'));
        this.idx = this.createIndexes();
        this.filterDate;
        this.inputValue;
    }
    createIndexes() {
        const documents = this.file.get('list');
        const idx = lunr(function () {
            this.ref('id');
            this.field('filename');
            this.field('factureNumber');
            this.field('department');
            this.field('contractor');

            documents.forEach((document) => {
                const documentWithoutWhitespaces = {}
                Object.keys(document).map(key=>{
                    documentWithoutWhitespaces[key] = document[key].replace(/\s+/g,'')
                });
                this.add(documentWithoutWhitespaces)
            })
        })
        return idx
    }
    updateIndexes() {
        this.file = editJsonFile(path.resolve(config.get('listFilepath')));
        this.idx = this.createIndexes()
    }
    getIds() {
        const inputValueIDs = this.inputValueFilteredIDs();
        const dateIDs = this.dateFilteredIDs(); 
        if((inputValueIDs.length === 0 && !this.inputValue) && (dateIDs.length === 0 && !this.filterDate)){
            return this.file.get('list').map(item=>item.id)
        }
        if(inputValueIDs.length !== 0 && dateIDs.length !== 0){
            return inputValueIDs.filter(id=>{
              return dateIDs.includes(id)
            }) 
        }
        return [...inputValueIDs,...dateIDs]
    }
    //return id that match input value or if not return undefined
    inputValueFilteredIDs(){
        if(this.inputValue){
            const textWithoutSpaces = this.inputValue.replace(/\s+/g,'');
            return this.idx.search(`*${textWithoutSpaces.toLowerCase()}*`).map(document => {
                return document.ref
            })
        }
        return []
    }
    //return id that match date or if not return undefined
    dateFilteredIDs() {
        if (this.filterDate) {
            const dateSplit = this.filterDate.split('-');
            const startDate = new Date(dateSplit[0].split('/').reverse().join('/'));
            const endDate = new Date(dateSplit[1].split('/').reverse().join('/'));
            return this.file.get('list').filter(listItem => {
                const date = new Date(listItem.date.split('/').reverse().join('/'));
                return date >= startDate && date <= endDate
            }).map(listItem => listItem.id)
        }
        return []
    }
    //set date 
    set setDate(date) {
        this.filterDate = date
    }
    //set input value
    set setInputValue(text) {
        this.inputValue = text
    }

}


module.exports = Search