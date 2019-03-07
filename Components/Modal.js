const Notification = require('./Notification');
const notification = new Notification();
const DatePicker = require('./DatePicker');
const config = require('config');
const Autocomplete = require('./Autocomplete');
const Utils = require('../Utils/Utils');
const Move = require('./Move');
const move = new Move();

class Modal {
    constructor(modalBox, saveButton, closeButton, filenameBox, inputs = []) {
        this.modalBox = modalBox;
        this.saveButton = saveButton;
        this.closeButton = closeButton;
        this.filenameBox = filenameBox;
        this.inputs = inputs;
        this.filepath = null;
        this.filename = null;
        // start watching buttons
        this.watch()
        // init datepicker & assign result to variable
        this.datapicker = DatePicker.initDateInput()[0];
        new Autocomplete(Utils.nodeArraySearch(this.inputs, 'id', 'contractor')[0], config.get('contractors'));
        new Autocomplete(Utils.nodeArraySearch(this.inputs, 'id', 'department')[0], config.get('departments'), 10)
        this.departmentsSet()
    }
    // show modalBox
    show() {
        this.modalBox.classList.add('is-active');
    }
    // hide modalBox
    close() {
        this.inputs.forEach(input=>{
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
            const department = Utils.nodeArraySearch(this.inputs, 'id', 'department')[0].value;
            const contractor = Utils.nodeArraySearch(this.inputs, 'id', 'contractor')[0].value;
            const date = Utils.nodeArraySearch(this.inputs, 'id', 'date')[0].value;
            this.loadingToggle();
            move.moveFile(this.filepath, this.filename,move.createNewPath(department, contractor, date), () => {
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
        const select = Utils.nodeArraySearch(this.inputs, 'id', 'department');
        if (select.length > 0) {
            config.get('departments').forEach(department => {
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