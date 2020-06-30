const request = require('postman-request')

// Obtain latitude and longitude of a specified location
const geocode = (address, callback) => {
    const geoUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${address}.json?access_token=${process.env.MAPBOX_KEY}&limit=1`
    request(geoUrl, (error, response, body) => {
        if (error) {
            callback('Uable to connect to get geo location data', defined)
        } else {
            const packet = JSON.parse(body)
            if (packet.features.length === 0) {
                callback('Unable to get geo location incomplete.', undefined);
            } else {
                callback(undefined, {
                    longitude: packet.features[0].center[0],
                    latitude: packet.features[0].center[1],
                    location: packet.features[0].place_name
                })
            }
        }
    })
}

// Use latitude and longitude to obtain local weather data
const forcast = (longitude, latitude, callback) => {
    const forcastUrl = `https://api.darksky.net/forecast/${process.env.DARKSKY_KEY}/${latitude},${longitude}`
    request(forcastUrl, (error, response, body) => {
        if (error) {
            callback('Unable to connect to get forcast data', undefined)
        } else {
            const packet = JSON.parse(body)
            if (packet.error) {
                callback('Unable to find location', undefined)
            } else {
                callback(undefined, {
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
}

module.exports = {
    geocode,
    forcast
}