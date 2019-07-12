let $ = require('jquery')
let timeZoneService = require('../service/timezone-service')
let TimeSnippet = require('../common/time-snippet')
let LocationName = require('../common/location-name')
var snippets = [];
var seed = 0;
function onTrackTimezone(cityData) {
    if (!timeZoneService.trackTimezone(cityData)) return
    renderTrackTimezone(cityData)
}
function renderTrackTimezone(cityData) {
    var locationName = new LocationName().add(cityData.country).add(cityData.province).add(cityData.city).name;
    var snippet = new TimeSnippet({ id: ++seed, timezoneName: locationName, timezoneOffset: timeZoneService.getNormalizedUtcOffset(cityData.timezone) }, 'MMMM Do, hh:mm:ss a', cityData);
    snippets.push(snippet)
    snippet.afterUntrack = function () {
        for (var i = 0; i < snippets.length; i++) {
            if (snippets[i].timezone.id == snippet.timezone.id)
                snippets.splice(i, 1)
        }
    }
    $('#trackingTimezone').append(snippet.render());
}
function render() {
    var currentTimezone = timeZoneService.getCurrentTimezone();
    var currentSnippet = new TimeSnippet(currentTimezone, 'MMMM Do, hh:mm:ss a');// current time zone
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
