/**
 * Created by yanguoxu on 15/8/13.
 */
var studyDifficultChart = require("studyDifficultChart");

module.exports = function() {
	return {
		link: function($scope, ele, attr) {
			//console.log($scope.keywords);
			if (!$scope.keywords){
				ele.html('<div class="empty">暂无数据</div>');
				return;
			}

			var fn = function(data) {
				ele.empty();
				if ((!data) || !angular.isDefined(data.keywords) || !angular.isDefined(data.relation) || (data.keywords.lenght<=0)) {
					ele.html('<div class="empty">暂无数据</div>');
				} else {
					studyDifficultChart(data, ele[0]);
				}
			};
			fn($scope.keywords["data"]);
			//$scope.$watch('d3Score', function(newVal, oldVal) {
			//	if (newVal === oldVal) {
			//		return false;
			//	}
			//	fn(newVal);
			//});
		}
	}
}

