/**
 * Reference from https://stackoverflow.com/questions/37001869/how-to-get-time-zone-of-city-or-country-in-javascript
 */

var moment = require('moment-timezone')
var fs = require('fs')
var cityTimeZones = require('city-timezones')
const path = require('path')
const usrDataPath = path.join(__dirname, './../../usr.dat');

function readConfigTimezone(callback) {
    createUserdataFile();
    fs.readFile(usrDataPath, callback);
}
function readConfigTimezoneSync(callback) {
    createUserdataFile();
    return fs.readFileSync(usrDataPath, { encoding: 'utf8' });
}
function saveConfigTimezone(config) {
    createUserdataFile();
    fs.writeFileSync(usrDataPath, JSON.stringify(config));
}
function createUserdataFile() {
    if (!fs.existsSync(usrDataPath)) {
        var currentTimezoneOffset = getNormalizedUtcOffset(moment.tz.guess());
        var usrdata = require('../utility/timezone')
        usrdata.timezoneOffset = currentTimezoneOffset;
        fs.writeFileSync(usrDataPath, JSON.stringify(usrdata));
    }
}
function trackTimezone(cityData) {
    var config = getCurrentTimezone();
    config.trackingTimezones.push(cityData);
    saveConfigTimezone(config)
}
function getCurrentTimezone() {
    var data = readConfigTimezoneSync()
    data = JSON.parse(data)
    return data;
}

function getTime(timezoneOffset, format) {
    var time = moment().utcOffset(timezoneOffset, false);
    if (format) time = time.format(format)
    return time;
}

/**
 * Returns the UTC offset for the given timezone
 * @param timezone Example: America/New_York
 */
function getNormalizedUtcOffset(timezone) {
    const momentTimezone = moment.tz(timezone);
    if (!momentTimezone) {
        return null;
    }
    let offset = momentTimezone.utcOffset();
    if (momentTimezone.isDST()) {
        // utcOffset will return the offset normalized by DST. If the location
        // is in daylight saving time now, it will be adjusted for that. This is
        // a NAIVE attempt to normalize that by going back 1 hour
        offset -= 60;
    }
    return offset / 60;
}

/**
 * Returns the offset range for the given city or region
 * @param location
 */
function getUtcOffsetForLocation(location) {
    const timezones = cityTimeZones.findFromCityStateProvince(location);
    if (timezones && timezones.length) {
        // timezones will contain an array of all timezones for all cities inside
        // the given location. For example, if location is a country, this will contain
        // all timezones of all cities inside the country.
        // YOU SHOULD CACHE THE RESULT OF THIS FUNCTION.
        const offsetSet = new Set();
        for (let timezone of timezones) {
            const offset = getNormalizedUtcOffset(timezone.timezone);
            if (offset !== null) {
                offsetSet.add(offset);
            }
        }

        return [...offsetSet].sort((a, b) => a - b);
    }
    return [];
}
function getCityDataForLocation(location) {
    const cityData = cityTimeZones.findFromCityStateProvince(location);
    return cityData;
}
module.exports = { getCurrentTimezone, getNormalizedUtcOffset, getUtcOffsetForLocation, getCityDataForLocation, getTime, trackTimezone }
