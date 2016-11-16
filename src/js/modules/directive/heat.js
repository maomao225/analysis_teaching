var heatChart = require('heatChart');
var nvToolTip = require('nvToolTip');
// attr.d3Heat  双向绑定  画图数据
module.exports = function() {
	return {
		scope: {
			d3Heat: '='
		},
		link: function($scope, ele, attr) {

			var fn = function(data) {
				ele.empty();

				if (!angular.isDefined(data) || !data.length) {
					ele.html('<div class="empty">暂无数据</div>');
				} else {
					heatChart(ele[0], {
						data: data,
						onMouseOver: function(data, i, event) {
							var innerHTML = '<p class="pro">' + data.parentName + data.name + '·平均学习人数' + '</p><p class="num">' + data.value + '</p>';
							nvToolTip(innerHTML);
						},
						onMouseOut: function() {
							nvToolTip.removeToolTip();
						},
						width: 215,
						height: 130,
					});
				}
			}

			fn($scope.d3Heat.study);

			$scope.$watch('d3Heat', function(newVal, oldVal) {
				if (newVal === oldVal) {
					return false;
				}
				fn(newVal.study);
			});

		}
	}
};
