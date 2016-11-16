module.exports = function(dateFormat) {
    return function(date) {
        if (!date) {
            return '--'
        } else {
            return dateFormat(date).fromNow()
        }
    }
}
