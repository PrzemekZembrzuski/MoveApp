const child_process = require('child_process');
const path = require('path');


class Open{
    static folder(folderPath){
        const formatedPath = path.resolve(path.dirname(folderPath));
        child_process.exec(`start "" "${formatedPath}"`);
    }
}

module.exports = Open