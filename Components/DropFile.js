const Notification = require('./Notification');
const notification = new Notification();
const Modal = require('./Modal');

// get all data for open modal
const modalBox = document.querySelector('#mainModal');
const saveButton = document.querySelector('#mainModalSaveButton');
const closeButton = document.querySelector('#mainModalCloseButton');
const dateInput = document.querySelector('#date');
const factureNumberInput = document.querySelector('#factureNumber');
const departmentInput = document.querySelector('#department');
const contractorNameInput = document.querySelector('#contractor'); 
const filenameBox = document.querySelector('#filename');
// create modal object
const modal = new Modal(modalBox,saveButton,closeButton,filenameBox,[factureNumberInput,departmentInput,contractorNameInput,dateInput]);


class DropFile{
    constructor(){
        this.dropBox = document.querySelector('#addDocument');
        this.input = document.querySelector('.file-input');
    }
    checkFileType(file,callback){
        if(file.type === 'application/pdf'){
            callback()
        }else{
            notification.emit('zły plik, podaj plik pdf','error')
        }
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
                modal.setFileName = e.dataTransfer.file[0].name;
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