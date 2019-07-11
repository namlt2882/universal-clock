let $ = require('jquery')
let timeZoneService = require('../service/timezone-service')

function render() {
    var currentTimezone = timeZoneService.getCurrentTimezone();
    var snippets = [];
    var content = `<table>
    <tr>
        <td>Timezone:</td>
        <td class='timezone-name'></td>
    </tr>
    <tr>
        <td>Time:</td>
        <td class='timezone'></td>
    </tr>
    </table>`;

    function createSnippet() {
        snippets.push(new Snippet($('#currentTimezone'), content, currentTimezone));// current time zone
        snippets.forEach(snp => snp.render())
    }

    function updateSnippet() {
        snippets.forEach(snp => snp.update())
        setTimeout(updateSnippet, 1000);
    }
    createSnippet();
    updateSnippet();
}

function Snippet(parent, html, timezone) {
    this.parent = parent;
    this.html = html;
    this.timezone = timezone;
}
Snippet.prototype.render = function () {
    var parent = $(this.parent);
    parent.html(this.html);
    parent.find('.timezone-name').text(this.timezone.timezoneName);
    parent.find('.timezone').text(timeZoneService.getTime(this.timezone.timezoneOffset))
}

Snippet.prototype.update = function () {
    var parent = $(this.parent);
    parent.find('.timezone').text(timeZoneService.getTime(this.timezone.timezoneOffset))
}
render();
module.exports = { render, Snippet }
