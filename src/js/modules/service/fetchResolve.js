module.exports = function(ajax, $q, interfaces) {
    return function(key) {
        var defer = $q.defer()
        ajax({
            url: interfaces[key],
            dataType: 'json'
        }).then(function(response) {
            defer.resolve(response)
        }, function(XHR, reason) {
            defer.resolve({})
            console.error(interfaces[key], XHR, reason)
        })
        return defer.promise
    }
}
