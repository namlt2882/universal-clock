let $ = require('jquery')
let timeZoneService = require('../service/timezone-service')
let TimeSnippet = require('../common/time-snippet')
let LocationName = require('../common/location-name')
var snippets = [];

function onTrackTimezone(cityData) {
    timeZoneService.trackTimezone(cityData)
    renderTrackTimezone(cityData)
}
function renderTrackTimezone(cityData) {
    var locationName = new LocationName().add(cityData.country).add(cityData.province).add(cityData.city).name;
    var snippet = new TimeSnippet({ timezoneName: locationName, timezoneOffset: timeZoneService.getNormalizedUtcOffset(cityData.timezone) }, 'MMMM Do, hh:mm:ss a');
    snippets.push(snippet)
    $('#trackingTimezone').append(snippet.render());
}
function render() {
    var currentTimezone = timeZoneService.getCurrentTimezone();
    var currentSnippet = new TimeSnippet(currentTimezone, 'MMMM Do, hh:mm:ss a',);// current time zone
    snippets.push(currentSnippet);
    $('#currentTimezone').append(currentSnippet.render());
    currentTimezone.trackingTimezones.forEach(cityData => renderTrackTimezone(cityData))
}
function updateSnippet() {
    snippets.forEach(snp => snp.update())
    setTimeout(updateSnippet, 1000);
}
updateSnippet();
render();
module.exports = { onTrackTimezone }
