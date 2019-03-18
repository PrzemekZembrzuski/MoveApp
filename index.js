const DropFile = require('./Components/DropFile');
const dropFile = new DropFile();
const AddAutocompleteTips = require('./Components/AddAutocompleteTips');
const Utils = require('./Components/Utils');


module.exports = ()=>{
    dropFile.watch();
    new AddAutocompleteTips();
    new Utils()
}
