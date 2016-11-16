require('jquery')

module.exports = function($scope, interfaces, $location, $rootScope) {
    $scope.staticDir = interfaces.staticDir
    $scope.interfaces = interfaces
    $scope.download_nav_click = function() {
        var maxTop = $('#footer_download')[0].offsetTop
        var startTop = $(window).scrollTop()

        function animateScrollTop() {
            startTop += 100
            if (startTop >= maxTop) {
                startTop = maxTop
            }
            $(window).scrollTop(startTop)
            if (startTop < maxTop) {
                setTimeout(animateScrollTop, 100)
            }
        }
        animateScrollTop()

    }
}
