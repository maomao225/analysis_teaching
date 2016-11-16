module.exports = function($templateCache) {
    var str = $templateCache.get('color.scss')
    var arr = str.split(';')
    var json = {}
    arr.forEach(function(val) {
        if (val.length) {
            var thisArr = val.split(':')
            if (thisArr.length === 2) {
                json[thisArr[0].trim()] = thisArr[1].replace(/!default/, '').trim()
            }
        }
    })
    return json
}
