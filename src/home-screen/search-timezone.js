let $ = require('jquery')
let timeZoneService = require('../service/timezone-service')
let home = require('./home-view')
let TimeSnippet = require('../common/time-snippet')
let LocationName = require('../common/location-name')
let { ipcRenderer } = require('electron')
let snippets = []
let searchData = []

/**
 * Render search area when get the search result from Main process
 * @param cityData Search result from Main process
 */
function onSearch(cityData) {
    var resultArea = $('#searchTimezone .search-result');
    resultArea.html(null);
    snippets = []
    searchData = cityData
    if (cityData.length == 0) {
        resultArea.html(`<div>No result found</div>`)
    } else {
        var remove = $(`<a href="" class="search-remove">Remove ${cityData.length} result(s)</a>`)
        remove.click((e) => {
            searchData = []
            e.preventDefault();
            resultArea.scrollTop(0);
            resultArea.html(null)
            searchInput.val('')
        })
        var renderData = nextResults()
        resultArea.html(renderData.map((location, i) => renderResult(location, i + 1)))
        resultArea.append(remove)
    }
}
/**
 * Get next 10 searching results
 */
function nextResults() {
    return searchData.splice(0, searchData.length >= 10 ? 10 : searchData.length)
}
/**
 * Render search item HTML component
 * @param location The name of search result
 * @param index The index of search result
 */
function renderResult(location, index) {
    var locationName = new LocationName().add(location.country).add(location.province).add(location.city).name;
    var content = $(`<div class='search-item'/>`)
    var button = $(`<i class="fa fa-eye track-btn" title="Track ${location.city}"></i>`)
    button.on('click', function () {
        home.onTrackTimezone(location)
    })
    var snippet = new TimeSnippet({ timezoneOffset: timeZoneService.getNormalizedUtcOffset(location.timezone) }, 'MMMM Do, hh:mm a', null, `<span><span class="timezone-daynight"></span><span class='timezone'></span><span>`);
    snippets.push(snippet)
    content.append(`#${index} | ${locationName} | `).append(snippet.render()).append(button)
    return content;
}
/**
 * This function will get more search results (if any) and append to search area
 */
function showMoreSearchResult() {
    var renderData = nextResults()
    var resultArea = $('#searchTimezone .search-result')
    var base = resultArea.children().length - 1;
    resultArea.append(renderData.map((location, i) => renderResult(location, i + 1 + base)))
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
$(function () {
    $('#searchTimezone .search-result').on('scroll', function () {
        if ($(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight) {
            showMoreSearchResult();
        }
    })
});
module.exports = {}
