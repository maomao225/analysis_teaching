var RadialChart = require('radial');

module.exports = function() {
	return {
		scope: {
			d3Radial: '='
		},
		link: function($scope, ele, attr) {
			var fn = function(data) {
				if (!angular.isDefined(data) || !angular.isDefined(data.data) || !data.data.length) {
					ele.html('<div class="empty">暂无数据</div>');
				} else {
					RadialChart(ele[0], data);
				}
			};
			$scope.$watch('d3Radial', function(newVal, oldVal) {
				if (newVal === oldVal) {
					return false;
				}
				// 先清空原来的图
				ele.empty();
				fn(newVal);
			});
			fn($scope.d3Radial);
		}
	}
};
