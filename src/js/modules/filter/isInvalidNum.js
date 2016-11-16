module.exports = function() {
    return function(num) {
        if (isNaN(num) || num == Infinity) {
            return 0
        } else {
            return num
        }
    }
}
