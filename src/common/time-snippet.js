let $ = require('jquery')
let timeZoneService = require('../service/timezone-service')
var html = `<div style="text-align:center;">
        <span class="timezone-daynight"></span>
        <span class="timezone-name"></span>
        <span class="timezone"></span>
    </div>`
function TimeSnippet(timezone, format, template = html) {
    this.timezone = timezone;
    this.format = format
    this.template = template
}
TimeSnippet.prototype.render = function () {
    this.html = $(this.template);
    this.html.find('.timezone-name').css('color', `rgb(${Math.random() * 200},${Math.random() * 200},${Math.random() * 200})`).text(this.timezone.timezoneName);
    var moment = timeZoneService.getTime(this.timezone.timezoneOffset, this.format)
    this.html.find('.timezone').text(moment)
    this.resetDaylight(this.isMorning(moment))
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
module.exports = TimeSnippet
