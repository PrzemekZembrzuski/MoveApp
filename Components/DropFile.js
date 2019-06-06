const Notification = require('./Notification');
const notification = new Notification();
const Modal = require('./Modal');
const config = require('config')


// get all data for open modal
const modalBox = document.querySelector('#mainModal');

// create modal object
const modal = new Modal(modalBox);


class DropFile{
    constructor(){
        this.dropBox = document.querySelector('#addDocument');
        this.input = document.querySelector('.file-input');
    }
    checkFileType(file,callback){
        // if(config.get('fileTypes').includes(file.type)){
        //     callback()
        // }else{
        //     notification.emit('zły plik, podaj plik pdf lub xml','error')
        // }
        callback()
    }

    watch(){
        //prevent default action of drop zone (default action is cancel drop)
        ['dragover','dragenter'].forEach(event => {
            this.dropBox.addEventListener(event,e=>{
                e.preventDefault()
            })
        });
        // -------------------------------------------------------------------
        // listen for dropped file
        this.dropBox.addEventListener('drop',e=>{
            this.checkFileType(e.dataTransfer.files[0],()=>{
                modal.setFilePath = e.dataTransfer.files[0].path;
                modal.setFileName = e.dataTransfer.files[0].name;
                modal.show();
                modal.showFilename(e.dataTransfer.files[0].name);
                
            })

        })
        this.input.addEventListener('change', e=>{
            this.checkFileType(e.target.files[0],()=>{
                modal.setFilePath = e.target.files[0].path;
                modal.setFileName = e.target.files[0].name;
                modal.show();
                modal.showFilename(e.target.files[0].name);
                this.input.value = null
            })
        })
    }
}

module.exports = DropFile