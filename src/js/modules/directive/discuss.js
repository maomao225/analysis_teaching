var discuss = require('discuss');

module.exports = function() {
	return {
		scope: {
			d3Discuss: '='
		},
		link: function($scope, ele, attr) {
			var fn = function(data) {
				ele.empty();
				if (!data || !data.length) {
					ele.html('<div class="empty">暂无数据</div>');
				} else {
					discuss(data, ele[0]);
				}
			};
			fn($scope.d3Discuss.reply);
			$scope.$watch('d3Discuss', function(newVal, oldVal) {
				if (newVal === oldVal) {
					return false;
				}
				fn(newVal.reply);
			});
		}
	}
}
