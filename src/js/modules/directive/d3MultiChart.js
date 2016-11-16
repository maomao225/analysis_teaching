var xtChart = require('d3XtChart');
module.exports = function() {
	return {
		scope: {
			d3MultiChart: '=',
			d3Option: '='
		},
		link: function($scope, ele, attr) {
			var renderChart = function(data, option) {
				ele.empty();
				if (data && data.length) {
					option.container = ele[0];
					new xtChart.multiChart(data, option);
				} else {
					ele.html('<div class="empty">暂无数据</div>');
				}
			};

			renderChart($scope.d3MultiChart, $scope.d3Option);

			$scope.$watch('d3MultiChart', function(newVal, oldVal) {
				if (newVal === oldVal) {
					return false;
				}
				renderChart(newVal, $scope.d3Option);
			});
		}
	};
}
