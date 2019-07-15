let { ipcMain } = require('electron')
let timeZoneService = require('../service/timezone-service')
function onSearch(searchValue) {
    if (searchValue && (searchValue = searchValue.trim())) {
        var cityData = timeZoneService.getCityDataForLocation(searchValue);
        return cityData;
    }
    return []
}

ipcMain.on('search-timezone', (event, searchValue) => {
    var result = onSearch(searchValue)
    event.sender.send('search-timezone', result)
})
module.exports = {}