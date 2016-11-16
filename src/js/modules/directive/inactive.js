// attr.d3Inactive 双向绑定 数据

var xuetangX_chart = require('d3XtChart');
var nvToolTip = require('nvToolTip');

var fn = function() {
	return {
		scope: {
			d3Inactive: '='
		},
		link: function($scope, ele, attr) {
			var fn = function(data) {
				ele.empty();

				var bar1 = {
					data: [],
					type:"bar",
			        yAxis:1,
			        color:"#66C5EE"
				};
				var bar2 = {
					data: [],
					type:"bar",
		            yAxis:1,
		            color:"#FFA89E"
				};

				var backGroundData = [];

				data.inactive.forEach(function(val, index, arr) {
					bar1.data.push({
						date: val.date,
						size: val.revival
					});
					bar2.data.push({
						date: val.date,
						size: val.new_inactive * -1
					});

					if (val.weekend) {
						var last = backGroundData[backGroundData.length - 1];
						if (last && last.data.length < 2 && ( new Date(val.date) - new Date(last.data[0]) === 86400000 )) {
							last.data.push(val.date);
						} else {
							var json = {
								data: [val.date],
								color: '#E9F2F8'
							};
							backGroundData.push(json);
						}
					}

				});
				if (backGroundData[0].data.length < 2) {
					backGroundData[0].data.push(backGroundData[0].data[0]);
				}

				if (backGroundData[backGroundData.length - 1].data.length < 2) {
					backGroundData[backGroundData.length - 1].data.push(backGroundData[backGroundData.length - 1].data[0]);
				}

				bar2.data[bar2.data.length - 1].color = '#FF6C5B';
				bar2.data[bar2.data.length - 1].text = '昨日';

				new xuetangX_chart.multiChart([bar1, bar2], {
					container: ele[0],
					margin: {
						top: 0,
						left: 0,
						right: 0,
						bottom: 0
					},
					x_start:10,
        			y_start:10,
					width: 200,
					height: 100,
					x_key: "date",
					y_key: "size",
					hideXAxis: true,
					hideYAxis: true,
					backGroundData: backGroundData,
					onMouseMove: function(d, index) {
						var data1 = data.inactive[index];
						var innerHTML = '<p class="pro">' + data1.date + '</p><p class="pro">新增唤醒人数</p><p class="num">' + data1.revival + '</p><p class="pro">新增沉睡人数</p><p class="num">' + data1.new_inactive + '</p>';
						nvToolTip(innerHTML);
					},
					onMouseLeave: function() {
						nvToolTip.removeToolTip();
					}
				});
			};

			fn($scope.d3Inactive);

			$scope.$watch('d3Inactive', function(newVal, oldVal) {
				if (newVal === oldVal) {
					return false;
				}
				fn(newVal);
			});
		}
	}
};

module.exports = fn;
