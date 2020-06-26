const fs = require('fs')
const dayInMillisecond = 86400000

// load current data file
const loadData = (fileName) => {
    try {
        const dataBuffer = fs.readFileSync(fileName);
        const dataJSON = dataBuffer.toString();
        return JSON.parse(dataJSON);
    } catch (e) {
        return [];
    }
}

// write to data file
const saveData = (fileName, data) => {
    const dataJSON = JSON.stringify(data)
    fs.writeFileSync(fileName, dataJSON)
}

// add a JSON entry into the file
const addEntry = (fileName, entry) => {
    const data = loadData(fileName)
    data.push(entry)
    saveData(fileName, data)
}

// clean up data file. Number of file is specified in the environment file.
const cleanUpData = (today) => {
    const path = process.env.LOGFILE_DIR
    fs.readdir(path, (err, files) => {
        if (err) {
            return console.log(`Error reading file while cleaning up: ${err}`)
        }
        const retain_since = today.valueOf() - process.env.RETAIN_LOGFILE_DAY * dayInMillisecond
        files.forEach((file) => {
            const pathFile = `${path}/${file}`
            const fileTimeInMillisecond = Math.floor(fs.statSync(pathFile).birthtimeMs)
            if (fileTimeInMillisecond < retain_since) {  // remove this file
                fs.unlink(pathFile, (err) => {
                    if (err) {
                        console.log(`Clean up file error: ${err}`)
                    } else {
                        console.log(`Removed: ${pathFile}`)
                    }
                })
            }
        })
    })
}

module.exports = {
    addEntry,
    cleanUpData
}