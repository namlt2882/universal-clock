let $ = require('jquery')
let timeZoneService = require('../service/timezone-service')
var html = `<table>
    <tr>
        <td>Timezone:</td>
        <td class='timezone-name'></td>
    </tr>
    <tr>
        <td>Time:</td>
        <td class='timezone'></td>
    </tr>
    </table>`
function TimeSnippet(timezone, format, template = html) {
    this.timezone = timezone;
    this.format = format
    this.template = template
}
TimeSnippet.prototype.render = function () {
    this.html = $(this.template);
    this.html.find('.timezone-name').text(this.timezone.timezoneName);
    this.html.find('.timezone').text(timeZoneService.getTime(this.timezone.timezoneOffset, this.format))
    return this.html;
}
TimeSnippet.prototype.update = function () {
    this.html.find('.timezone').text(timeZoneService.getTime(this.timezone.timezoneOffset, this.format))
}
module.exports = TimeSnippet
