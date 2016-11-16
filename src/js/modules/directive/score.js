var score = require('score');

module.exports = function() {
	return {
		scope: {
			d3Score: '='
		},
		link: function($scope, ele, attr) {
			var fn = function(data) {
				ele.empty();
				if (!angular.isDefined(data.distribution) || !angular.isDefined(data.distribution.children) || !data.distribution.children) {
					ele.html('<div class="empty">暂无数据</div>');
				} else {
					score(data, ele[0]);
				}
			};
			fn($scope.d3Score);
			$scope.$watch('d3Score', function(newVal, oldVal) {
				if (newVal === oldVal) {
					return false;
				}
				fn(newVal);
			});
		}
	}
}
