const fs = require('fs-extra');
const config = require('config');
const path = require('path');
const Notification = require('./Notification');
const notification = new Notification();

class Move {

    checkDir(dirPath) {
        try {
            fs.accessSync(dirPath)
            return true
        } catch (error) {
            return false
        }
    }
    createDirectory(newPath,callback) {
            fs.mkdirs(newPath,err=>{
                if(err){
                    console.log(err)
                    notification.emit('nie można stworzyć katalogu','error')
                    return
                }
                callback()
            })
    }
    createNewPath(department, contractor, date) {
        const rootPath = path.resolve(config.get('rootPath'));
        const splitDate = date.split('/');
        const day = splitDate[0];
        const month = splitDate[1];
        const year = splitDate[2];
        return path.join(rootPath,department,contractor,year,month,day)

    }
    moveFile(filepath,filename, newPath,callback) {
        this.createDirectory(newPath,()=>{
            const newPathWithFilename = path.join(newPath,filename)
            fs.move(filepath, newPathWithFilename,err=>{
                if(err){
                    notification.emit('nie można przenieść do katalogu','error')
                }
                notification.emit('Udało się')
                callback()
            });
        });
    }
}

module.exports = Move