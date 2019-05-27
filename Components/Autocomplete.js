const editJsonFile = require("edit-json-file");
const path = require('path');
const config = require('config');
const Notification = require('./Notification');
const notification = new Notification();

class Autocomplete {
    constructor(input, tipGroupName, tipsNumber = 5) {
        this.input = input;
        this.tipGroupName = tipGroupName;
        this.file = editJsonFile(config.get('listFilepath'));
        this.tips = this.file.get(tipGroupName);
        this.tipsNumber = tipsNumber;
        this.tipsContainer = this.input.parentNode.nextElementSibling.children[0];
        this.autocompleteContainer = this.input.parentNode.parentNode;
        this.watch()
    }
    // reload tips from file
    reloadTips(){
        this.file = editJsonFile(path.resolve(config.get('listFilepath')));
        this.tips = this.file.get(this.tipGroupName);
    }
    // filter for tips
    filter(searchString) {
        return this.tips.filter(tip => {
            return tip.toLowerCase().includes(searchString.toLowerCase())
        }).slice(0, this.tipsNumber)
    }
    //open autocomplete
    open() {
        if (!this.autocompleteContainer.classList.contains('is-active')) {
            this.input.focus()
            this.reloadTips();
            this.autocompleteContainer.classList.add('is-active');
        }
    }
    //close autocomplete
    close() {
        if (this.autocompleteContainer.classList.contains('is-active')) {
            this.autocompleteContainer.classList.remove('is-active');
            if(!this.tips.includes(this.input.value)){
                notification.emit('Podaj poprawną wartość ze słownika','error')
                this.input.value = '';
            }
            this.reset()
        }
    }
    //reset all
    reset() {
        this.tipsContainer.innerHTML = null
    }
    //check if autocomplete is active
    isActive() {
        return this.autocompleteContainer.classList.contains('is-active') ? true : false
    }
    //add tips to the autocomplete
    addTips(tips) {
        if(tips.length !== 0){
            tips.forEach(tip => {
                const div = document.createElement('div');
                const p = document.createElement('p');
                div.classList.add('dropdown-item');
                p.innerText = tip;
                div.appendChild(p);
                this.tipsContainer.appendChild(div);
            });
            this.setActiveMenuItem(this.tipsContainer.children[0])
        }else{
            this.close()
        }
    }
    // set input value
    setValue(value) {
        this.input.value = value
    }
    // get active tips
    getActiveTip() {
        return [...this.tipsContainer.children].filter(element => {
            return element.classList.contains('dropdown-item-active')
        })[0]

    }
    // set item of menu active
    setActiveMenuItem(element) {
        [...this.tipsContainer.children].forEach(item => item.classList.remove('dropdown-item-active'));
        element.classList.add('dropdown-item-active');
        this.scroll();
    }
    //scroll tips container
    scroll() {
        this.tipsContainer.scrollTop = this.getActiveTip().offsetTop
    }
    //keyboard controll
    keyboardControl(key) {
        const lastElement = !this.getActiveTip().nextElementSibling;
        const firstElement = !this.getActiveTip().previousElementSibling;
        if (key === 38 && !firstElement) {
            this.setActiveMenuItem(this.getActiveTip().previousElementSibling);
        }
        if (key === 40 && !lastElement) {
            this.setActiveMenuItem(this.getActiveTip().nextElementSibling);
        }
        if (key === 13) {
            const value = this.getActiveTip().children[0].innerText;
            this.setValue(value)
            this.close()
        }

    }
    // event watch
    watch() {
        this.input.addEventListener('input', e => {
            if (e.target.value) {
                this.open()
                this.addTips(this.filter(e.target.value))
            } else {
                this.close()
            }
        })
        this.input.addEventListener('blur',e=>{
            setTimeout(()=>this.close(),200)
        })
        this.tipsContainer.addEventListener('click', e => {
            if ((e.target.nodeName === 'P' && e.target.parentElement.classList.contains('dropdown-item')) || (e.target.nodeName === 'DIV' && e.target.classList.contains('dropdown-item'))) {
                this.setValue(e.target.innerText)
                this.close()
            }
        })
        document.addEventListener('keyup', e => {
            if (this.isActive()) {
                this.keyboardControl(e.keyCode)
            }
        })
        document.body.addEventListener('click', e => {
            if (this.isActive()) {
                if (e.target.nodeName !== 'P' && !e.target.parentElement.classList.contains('dropdown-item')) {
                    this.close()
                }
            }
        });
    }
}

module.exports = Autocomplete