const { addEntry, cleanUpData } = require('./datatracker')
const { publishObject, disconnectMqtt } = require('./mqtt')
const { geocode, forcast } = require('./request')
const cron = require('node-cron')

// Set tracking location
const address = process.env.LOCATION

let longitude, latitude
geocode(address).then((code) => {
    longitude = code.longitude
    latitude = code.latitude
}).catch((error) => {
    console.log('geocode error: ', error)
    process.exit(1)
})
console.log(`Start tracking: ${address}`)

// Wake up every 15 minutes to retrieve data
cron.schedule('*/15 * * * *', () => {
    forcast(longitude, latitude).then((forcastData) => {
        // Get current time to setup local data file name
        const now = new Date()
        const fileName = `./${process.env.LOGFILE_DIR}/${new Date().toISOString().substr(0, 10)}.json`
        console.log(now.toISOString())
        publishObject(forcastData)
        addEntry(fileName, forcastData)
        cleanUpData(now)
    }).catch((error) => {
        console.log(error)
    })
})

// Catch the Control-C to disconnect from database and unsubscribe the mqtt message
const sigHandler = (signal) => {
    console.log(`Received ${signal}`)
    disconnectMqtt()
    process.exit(1)
}
process.on('SIGINT', sigHandler)