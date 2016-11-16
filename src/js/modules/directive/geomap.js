// attr.d3Geomap 双向绑定 数据

var GeomapChart = require('geomap')

module.exports = function() {
    return {
        scope: {
            d3Geomap: '='
        },
        link: function($scope, ele, attr) {

            $scope.$watch('d3Geomap', function(newVal, oldVal) {
                if (newVal === oldVal) {
                    return false
                }
                fn(newVal)
            })

            var fn = function(val) {
                ele.empty()
                new GeomapChart({
                    selector: ele[0],
                    geoJSON: val,
                    mapWidth: 210,
                    mapHeight: 170,
                    change: function(data) {
                        console.dir(data)
                    }
                })
            }
            fn($scope.d3Geomap)
        }
    }
}
