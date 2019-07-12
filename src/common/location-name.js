function LocationName() {
    this.name = ''
}
LocationName.prototype.add = function (add) {
    if (!add) return this
    if (this.name != '')
        this.name += ', '
    this.name += add
    return this;
}
module.exports = LocationName
