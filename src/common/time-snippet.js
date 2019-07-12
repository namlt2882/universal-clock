let $ = require('jquery')
let timeZoneService = require('../service/timezone-service')
var html = `<div class="trackingTimezone" style="text-align:center;">
        <span class="timezone-daynight"></span>
        <span class="timezone-name"></span>
        <span class="timezone"></span>
        <span><i class="fa fa-lg fa-trash untrack-timezone track-btn"></i></span>
    </div>`
var seed = 0
function TimeSnippet(timezone, format, cityData, template = html) {
    this.timezone = timezone;
    this.timezone.id = ++seed
    this.format = format
    this.template = template
    this.cityData = cityData
}
TimeSnippet.prototype.render = function () {
    this.html = $(this.template);
    this.html.find('.timezone-name').css('color', `rgb(${Math.random() * 200},${Math.random() * 200},${Math.random() * 200})`).text(this.timezone.timezoneName);
    var moment = timeZoneService.getTime(this.timezone.timezoneOffset, this.format)
    this.html.find('.timezone').text(moment)
    this.resetDaylight(this.isMorning(moment))
    this.html.find('.untrack-timezone').click(() => { this.untrack() })
    return this.html;
}
TimeSnippet.prototype.resetDaylight = function (isMorning = this.morning) {
    if (this.morning != isMorning) {
        this.html.find('.timezone-daynight').html(isMorning ? `<i class="fa fa-sun-o" style="color:#d96b18"></i>` : `<i class="fa fa-moon-o" style="color:silver"></i>`)
        this.morning = isMorning
    }
}
TimeSnippet.prototype.isMorning = function (moment) {
    return moment.endsWith('am')
}
TimeSnippet.prototype.update = function () {
    var moment = timeZoneService.getTime(this.timezone.timezoneOffset, this.format);
    this.html.find('.timezone').text(moment)
    this.resetDaylight(this.isMorning(moment));
}
TimeSnippet.prototype.beforeUntrack = function () {
    return window.confirm(`Are you sure to untrack ${this.timezone.timezoneName}?`)
}
TimeSnippet.prototype.afterUntrack = function (html) { }
TimeSnippet.prototype.untrack = function () {
    if (!this.beforeUntrack()) return
    if (timeZoneService.untrackCity(this.cityData)) {
        this.html.remove();
        this.afterUntrack();
    }
}
module.exports = TimeSnippet
