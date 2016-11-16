var vitality = require('vitality');

module.exports = function() {
	return {
		scope: {
			d3Vitality: '=',
			d3VitalityOption: '='
		},
		link: function($scope, ele, attr) {
			var fn = function(data) {
				ele.empty();
				if (!angular.isDefined(data) || !angular.isDefined(data.line1) || !data.line1.length) {
					ele.html('<div class="empty">暂无数据</div>');
				} else {
					vitality(data, ele[0], $scope.d3VitalityOption);
				}
			};
			fn($scope.d3Vitality);
			$scope.$watch('d3Vitality', function(newVal, oldVal) {
				if (newVal === oldVal) {
					return false;
				}
				fn(newVal);
			});
		}
	}
}
