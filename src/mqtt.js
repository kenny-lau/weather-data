const mqtt = require('mqtt')
const server = 'mqtt:' + process.env.MQTT_SERVER
const topic = process.env.MQTT_TOPIC

// Connect to MQTT broker
let connected = false
const client = mqtt.connect(server)

client.on('connect', () => {
    connected = true
    console.log(`Connected: ${server}`)
})

// Publish data
const publishObject = (entryObject) => {
    if (connected) {
        const dataJSON = JSON.stringify(entryObject)
        client.publish(topic, dataJSON)
    }
}

// Actually it is terminated connection to MQTT broker
const disconnectMqtt = () => {
    client.end()
}

module.exports = {
    publishObject,
    disconnectMqtt
}