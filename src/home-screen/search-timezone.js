let $ = require('jquery')
let timeZoneService = require('../service/timezone-service')
let home = require('./home-view')
let TimeSnippet = require('../common/time-snippet')
let LocationName = require('../common/location-name')
let { ipcRenderer } = require('electron')
let snippets = []

function onSearch(cityData) {
    var resultArea = $('#searchTimezone .search-result');
    resultArea.html(null);
    snippets = []
    if (cityData.length == 0) {
        resultArea.html(`<div>No result found</div>`)
    } else {
        resultArea.html(cityData.map(location => {
            var locationName = new LocationName().add(location.country).add(location.province).add(location.city).name;
            var content = $(`<div class='search-item'/>`)
            var button = $(`<i class="fa fa-eye track-btn" title="Track ${location.city}"></i>`)
            button.on('click', function () {
                home.onTrackTimezone(location)
            })
            var snippet = new TimeSnippet({ timezoneOffset: timeZoneService.getNormalizedUtcOffset(location.timezone) }, 'MMMM Do, hh:mm a', null, `<span><span class="timezone-daynight"></span><span class='timezone'></span><span>`);
            snippets.push(snippet)
            content.append(`${locationName} | `).append(snippet.render()).append(button)
            return content;
        }))
        var remove = $('<a href="" class="search-remove">Remove</a>')
        remove.click((e) => {
            e.preventDefault();
            resultArea.html(null)
            searchInput.val('')
        })
        resultArea.append(remove)
    }
}
function updateSnippet() {
    snippets.forEach(snippet => snippet.update())
}
setInterval(updateSnippet, 60000)

var searchInput;
var searchButton;
$(function () {
    var area = $('#searchTimezone');
    searchInput = area.find("input[name='search']");
    searchButton = area.find("button[name='search-btn']");
    searchInput.keypress((e) => {
        if (e.which == 13) {
            searchButton.click()
        }
    })
    searchButton.on('click', () => {
        var searchValue = searchInput.val();
        ipcRenderer.send('search-timezone', searchValue)
    })
})
ipcRenderer.on('search-timezone', (event, data) => {
    onSearch(data)
})
module.exports = {}
