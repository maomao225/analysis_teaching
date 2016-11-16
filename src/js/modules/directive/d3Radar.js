var RadarChart = require('radar');

// attr.d3Radar  双向绑定  画图数据
var fn = function() {
	return {
		scope: {
			d3Radar: '='
		},
		link: function($scope, ele, attr) {
			var renderChart = function(data) {
				ele.empty();
				if (data && data.weekly_active_rate && data.weekly_active_rate.overcome) {
					var chart = RadarChart.chart(),
						cfg = {
							axisText: true,
							levels: 5,
							w: 175,
							h: 175
						}

					var svg = d3.select(ele[0]).append('svg')
						.attr('width', cfg.w + 17)
						.attr('height', cfg.h + 3)

					chart.config(cfg)
					svg.append('g').datum([{
						axes: [{
							axis: "1",
							value: data.weekly_active_rate.overcome ? data.weekly_active_rate.overcome.value * 100 : 0
						}, {
							axis: "2",
							value: data.registered_scale.overcome ? data.registered_scale.overcome.value * 100 : 0
						}, {
							axis: "3",
							value: data.discussion_reply_rank.overcome ? data.discussion_reply_rank.overcome.value * 100 : 0
						}, {
							axis: "4",
							value: data.active_count_rank.overcome ? data.active_count_rank.overcome.value * 100 : 0
						}, {
							axis: "5",
							value: data.active_num_rank.overcome ? data.active_num_rank.overcome.value * 100 : 0
						}],
						colors: ["#009ee3", "#0cc99a", "#ec482c", "#8957a1", "#ea68a2"]
					}]).call(chart);
				} else {
					ele.html('暂无数据').addClass('empty').css({
						color: 'rgba(255, 255, 255, .3)'
					});
				}
			};

			renderChart($scope.d3Radar);

			$scope.$watch('d3Radar', function(newVal, oldVal) {
				if (newVal === oldVal) {
					return false;
				}
				renderChart(newVal);
			});

		}
	};
};

module.exports = fn;
