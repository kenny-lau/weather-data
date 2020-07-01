const request = require('postman-request')

// Obtain latitude and longitude of a specified location
const geocode = (address) => {
    return new Promise((resolve, reject) => {
        const geoUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${address}.json?access_token=${process.env.MAPBOX_KEY}&limit=1`
        request(geoUrl, (error, response, body) => {
            if (error) {
                reject('Uable to connect to get geo location data')
            } else {
                const packet = JSON.parse(body)
                if (packet.features.length === 0) {
                    reject('Unable to get geo location incomplete.');
                } else {
                    resolve({
                        longitude: packet.features[0].center[0],
                        latitude: packet.features[0].center[1],
                        location: packet.features[0].place_name
                    })
                }
            }
        })
    })
}

const forcast = (longitude, latitude) => {
    return new Promise((resolve, reject) => {
        const forcastUrl = `https://api.darksky.net/forecast/${process.env.DARKSKY_KEY}/${latitude},${longitude}`
        request(forcastUrl, (error, response, body) => {
            if (error) {
                reject('Unable to connect to get forcast data')
            } else {
                const packet = JSON.parse(body)
                if (packet.error) {
                    reject('Unable to find location')
                } else {
                    resolve({
                        time: packet.currently.time,
                        temperature: packet.currently.temperature,
                        humidity: packet.currently.humidity,
                        pressure: packet.currently.pressure,
                        windSpeed: packet.currently.windSpeed,
                        uvIndex: packet.currently.uvIndex,
                        visibility: packet.currently.visibility
                    })
                }
            }
        })
    })
}

module.exports = {
    geocode,
    forcast
}