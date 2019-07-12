let $ = require('jquery')
let timeZoneService = require('../service/timezone-service')
let home = require('./home-view')
let TimeSnippet = require('../common/time-snippet')
let LocationName = require('../common/location-name')
let snippets = []

function onSearch(searchValue) {
    var resultArea = $('#searchTimezone .search-result');
    resultArea.html(null);
    snippets = []
    if (searchValue && (searchValue = searchValue.trim())) {
        var cityData = timeZoneService.getCityDataForLocation(searchValue);
        if (cityData.length == 0) {
            resultArea.html(`<div>No result found</div>`)
        } else {
            resultArea.html(cityData.map(location => {
                var locationName = new LocationName().add(location.country).add(location.province).add(location.city).name;
                var content = $(`<div class='search-item'/>`)
                var button = $('<button>Track</button>')
                button.on('click', function () {
                    home.onTrackTimezone(location)
                })
                var snippet = new TimeSnippet({ timezoneOffset: timeZoneService.getNormalizedUtcOffset(location.timezone) }, 'MMMM Do, hh:mm:ss a', `<span><span class='timezone'></span><span>`);
                snippets.push(snippet)
                content.append(`${locationName} | `).append(snippet.render()).append(button)
                return content;
            }))
        }
    }
}
function updateSnippet() {
    snippets.forEach(snippet => snippet.update())
    setTimeout(updateSnippet, 1000)
}
updateSnippet();
$(function () {
    var area = $('#searchTimezone');
    area.find("button[name='search-btn']").on('click', () => {
        var searchValue = area.find("input[name='search']").val();
        onSearch(searchValue);
    })
})
module.exports = {}
