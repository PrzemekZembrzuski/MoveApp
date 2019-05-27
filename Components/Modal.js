const Notification = require('./Notification');
const notification = new Notification();
const DatePicker = require('./DatePicker');
const config = require('config');
const Autocomplete = require('./Autocomplete');
const Helpers = require('../Helpers/Helpers');
const Move = require('./Move');
const move = new Move();
const editJsonFile = require("edit-json-file");
const path = require('path');
const List = require('./List');
const list = new List();



class Modal {
    constructor(modalBox) {
        this.file = editJsonFile(config.get('listFilepath'));
        this.modalBox = modalBox;
        this.saveButton = document.querySelector('#mainModalSaveButton');
        this.closeButton = document.querySelector('#mainModalCloseButton');
        this.filenameBox = document.querySelector('#filename');
        //get modal inputs & select elements
        const factureNumberInput = document.querySelector('#factureNumber');
        const departmentInput = document.querySelector('#department');
        const contractorNameInput = document.querySelector('#contractor');
        this.inputs = [factureNumberInput, departmentInput, contractorNameInput];
        // --------------------------------------------------------------
        this.filepath;
        this.filename;
        // start watching buttons
        this.watch()
        // init datepicker & assign result to variable
        this.datapicker = DatePicker.initDateInput('#mainModal > .modal-card > .modal-card-body > input[type="date"]', {startDate: Date.now(),...config.get('dateOptions')})[0];
        new Autocomplete(Helpers.nodeArraySearch(this.inputs, 'id', 'contractor')[0],'contractors');
        new Autocomplete(Helpers.nodeArraySearch(this.inputs, 'id', 'department')[0], 'departments', 10)
        this.departmentsSet();
        // init list & watch for search in list 
        list.watch()
        list.startList();
    }
    // show modalBox
    show() {
        this.modalBox.classList.add('is-active');
    }
    // hide modalBox
    close() {
        this.inputs.forEach(input => {
            input.value = ''
        })
        this.datapicker.clear();
        this.modalBox.classList.remove('is-active');
    }
    // toggle loading css class
    loadingToggle() {
        this.saveButton.classList.toggle('is-loading')
    }
    // save button action
    save() {
        const checkingInputResult = this.checkInputs();
        if (!checkingInputResult) {
            const department = Helpers.nodeArraySearch(this.inputs, 'id', 'department')[0].value;
            const contractor = Helpers.nodeArraySearch(this.inputs, 'id', 'contractor')[0].value;
            const factureNumber = Helpers.nodeArraySearch(this.inputs,'id','factureNumber')[0].value;
            const date = this.datapicker.value();
            this.loadingToggle();
            // Move file to specified  directory
            move.moveFile(this.filepath, this.filename, move.createNewPath(department, contractor, date), (newPath) => {
                //add item to JSON file
                list.addItemToJSON(this.filename, factureNumber,department, contractor, date, newPath);
                this.loadingToggle();
                this.close()
            })

        } else {
            notification.emit(`Podaj ${checkingInputResult}`, 'error')
        }
    }
    // show file name
    showFilename(filename) {
        this.filenameBox.innerText = filename;
    }
    // validate inputs if they are not empty
    checkInputs() {
        const emptyInputs = []
        this.inputs.forEach(input => {
            if (!input.value || input.value === "Wybierz apteke") {
                emptyInputs.push({ id: input.id, friendlyName: input.dataset.friendlyname })
            }
        })
        return emptyInputs.length > 0 ? emptyInputs[0].friendlyName : undefined
    }
    // set file path
    set setFilePath(path) {
        this.filepath = path
    }
    // set file name
    set setFileName(name) {
        this.filename = name
    }

    // set departments for select 
    departmentsSet() {
        const select = Helpers.nodeArraySearch(this.inputs, 'id', 'department');
        if (select.length > 0) {
            this.file.get('departments').forEach(department => {
                const option = document.createElement('option');
                option.value = department;
                option.innerText = department;
                select[0].appendChild(option)
            })
        }
    }
    // watch for buttons click
    watch() {
        this.saveButton.addEventListener('click', e => {
            this.save()
        })
        this.closeButton.addEventListener('click', e => {
            this.close()
        })
    }
}

module.exports = Modal