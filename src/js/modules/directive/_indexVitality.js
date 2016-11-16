module.exports = function(app) {
	app.directive('indexVitality', ['interfaces', 'isWeekend', '$rootScope', '$filter', function(interfaces, isWeekend, $rootScope, $filter) {
		return {
			link: {
				pre: function($scope) {

					$scope.staticDir = interfaces.staticDir;
					$scope.chartData = {};
					$scope.chartData.line1 = [];
					$scope.chartData.line2 = [];
					$scope.chartData.line3 = [];

					// 如果没有数据，就什么都不做。ui会显示“暂无数据”
					if (!$scope.fetch || !$scope.fetch.data || !$scope.fetch.data.length) {
						return false;
					}

					$scope.yesterdayData = $scope.fetch.data[$scope.fetch.data.length - 1];
					var beforeYesterdayData = $scope.fetch.data[$scope.fetch.data.length - 2];
					// 环比
					$scope.ratio = {
						// 活跃用户环比 昨天的值减去前天的值 然后 除以前天的值
						active: $filter('isInvalidNum')((($scope.yesterdayData.active - beforeYesterdayData.active) / beforeYesterdayData.active * 100).toFixed(2)),
						newinactive: $filter('isInvalidNum')((($scope.yesterdayData.newinactive - beforeYesterdayData.newinactive) / beforeYesterdayData.newinactive * 100).toFixed(2)),
						revival: $filter('isInvalidNum')((($scope.yesterdayData.revival - beforeYesterdayData.revival) / beforeYesterdayData.revival * 100).toFixed(2))
					};

					var total = $scope.fetch.data.reduce(function(prev, next) {
						var isWeekendResult = isWeekend(next.date);
						var thisTime = new Date(next.date).getTime();
						// revival
						$scope.chartData.line1.push({
							y: next.revival,
							x: thisTime,
							background: isWeekendResult
						});
						// newinactive
						$scope.chartData.line2.push({
							y: next.newinactive * -1,
							x: thisTime,
							background: isWeekendResult
						});
						// active
						$scope.chartData.line3.push({
							y: next.active,
							x: thisTime,
							background: isWeekendResult
						});
						return {
							active: prev.active + next.active,
							newinactive: prev.newinactive + next.newinactive || 0,
							revival: prev.revival + next.revival || 0
						}
					}, {
						active: 0,
						newinactive: 0,
						revival: 0
					});

					// 占比
					$scope.proportion = {
						// 昨天的活跃人数 除以 这段时间内（应该是2周内）的总活跃人数
						// active: $filter('isInvalidNum')(($scope.yesterdayData.active / $rootScope.__customData.curregisterTotal * 100).toFixed(2)) + '%',
						active: $filter('isInvalidNum')(($scope.yesterdayData.active / $scope.curregisterTotal.regist_count * 100).toFixed(2)) + '%',
						// 昨天的沉睡人数除以昨天的活跃人数
						newinactive: $filter('isInvalidNum')(($scope.yesterdayData.newinactive / $scope.yesterdayData.active * 100).toFixed(2)) + '%',
						// 昨天的复活人数除以昨天的活跃人数
						revival: $filter('isInvalidNum')(($scope.yesterdayData.revival / $scope.yesterdayData.active * 100).toFixed(2)) + '%'
					};
				},
				post: function() {}
			}
		};
	}]);

	app.directive('indexVitalityMooc', [function() {
		return {
			restrict: 'EA',
			link: {
				pre: function($scope, ele, attr) {
					$scope.chartData = {
						line1: [],
						line2: [],
						line3: []
					};

					if ($scope.d3Vitality && $scope.d3Vitality.detail && $scope.d3Vitality.detail.length) {
						$scope.d3Vitality.detail.forEach(function(val) {

							var thatTime = new Date(val.date).getTime();
							var obj1 = {
								x: thatTime,
								y: val.enroll_acts * 1,
								background: val.weekend
							};
							var obj2 = {
								x: thatTime,
								y: val.unenroll_acts * -1,
								background: val.weekend
							};
							var obj3 = {
								x: thatTime,
								y: val.enrollments * 1,
								background: val.weekend
							};
							$scope.chartData.line1.push(obj1);
							$scope.chartData.line2.push(obj2);
							$scope.chartData.line3.push(obj3);
						});
					}
				}
			}
		};
	}]);
}
