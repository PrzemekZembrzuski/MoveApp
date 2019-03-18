const editJsonFile = require("edit-json-file");
const path = require('path');
const config = require('config');
const Notification = require('./Notification');
const notification = new Notification();

class AddAutocompleteTips{
    constructor(){
        this.file = editJsonFile(path.resolve(config.get('listFilepath')));
        this.buttonsContainer = document.querySelector('#addAutocompleteTips > #addButtons');
        this.input = document.querySelector('#addAutocompleteTips > input');
        this.watch();
    }
    watch(){
        this.buttonsContainer.addEventListener('click',e=>{
            if(e.target.nodeName === 'BUTTON'){
                if(this.input.value){
                    const type = e.target.dataset.typename.toString();
                    const newValue = this.input.value;
                    const oldArray = this.file.get(type);
                    const newArray = [newValue, ...oldArray]
                    this.file.set(type, newArray)
                    this.file.save(()=>{
                        this.input.value = ""
                        notification.emit('Dodano')
                    })
                }else{
                    notification.emit(`Wypełnij pole`, 'error')
                }
            }
        })
    }
}
module.exports = AddAutocompleteTips