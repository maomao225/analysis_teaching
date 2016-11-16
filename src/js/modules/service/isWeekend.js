module.exports = function(dateFormat) {
    return function(date) {
        return (dateFormat(date).format('dddd') === '星期六' || dateFormat(date).format('dddd') === '星期日')
    }
}
