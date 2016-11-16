var nvToolTip = require('nvToolTip')
require('d3')

module.exports = function() {
  return {
    link: {
      pre: function($scope) {
        if ($scope.forecast && $scope.forecast.data && $scope.forecast.data.data && $scope.forecast.data.data.length) {
          var len = $scope.forecast.data.data.length

          var bar1 = {
            data: [],
            type: 'bar',
            yAxis: 1,
            color: '#FF897C'
          }
          var bar2 = {
            data: [],
            type: 'bar',
            yAxis: 1,
            color: '#35B1E9'
          }

          $scope.forecast.data.data = $scope.forecast.data.data.map(function(val, index, arr) {

            bar1.data.push({
              size: val.overcome * 100,
              date: 'week' + (index + 1)
            })

            bar2.data.push({
              size: (1 - val.overcome) * 100,
              date: 'week' + (index + 1)
            })

            return val
          })

          // 最后一个竖条 透明
          bar1.data[len - 1].styleClass = 'opacity'
          bar2.data[len - 1].styleClass = 'opacity'

          $scope.chartOption = {
            width: 720,
            height: 275,
            x_key: 'date',
            y_key: 'size',
            x_ordinalInterval: Math.round($scope.forecast.data.data.length / 10) * 2,
            y1_format: function(d) {
              return d + '%'
            },
            y1_rang: [0, 100],
            y1_tickValues: [0, 20, 40, 60, 80, 100],
            onMouseMove: function(d, index, e) {
              var data = $scope.forecast.data.data[index]
              var innerHTML = '<p class="pro">' + data.date + '</p><p class="pro">流失人数</p><p class="num">' + data.dropout + '</p><p class="pro">活跃人数</p><p class="num">' + data.active + '</p><p class="pro">流失比例</p><p class="num">' + (data.overcome * 100).toFixed(2) + '%</p>'
              nvToolTip(innerHTML)
            },
            onMouseLeave: function() {
              nvToolTip.removeToolTip()
            }
          }

          $scope.chartData = [bar1, bar2]

        }
      }
    }
  }
}
