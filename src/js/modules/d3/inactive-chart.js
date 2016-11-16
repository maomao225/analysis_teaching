require('d3');
var nv = require('nvd3');

var renderChart = function(data, ele) {
	var transformData1 = function(obj) {
		// 定义一个数组存储数据
		var arrBig = [];
		var arr = [];
		var jsonBig = {};
		var newJson = {};
		var dicArray = ['revival', 'new_inactive'];
		var val = obj['inactive'].slice(-14);

		for (var j = 0, len1 = dicArray.length; j < len1; j++) {
			jsonBig.key = 'stream' + j;
			for (var i = 0, len = val.length; i < len; i++) {
				newJson.x = Date.parse(val[i].date) + 2 * 3600;
				newJson.y = val[i][dicArray[j]] * (j < 1 ? 1 : -1);
				newJson.background = val[i].weekend && (j == 0) ? val[i].weekend : false;
				newJson.id = i;
				arr.push(newJson);
				newJson = {};
			}
			jsonBig.values = arr;
			arrBig.push(jsonBig);
			jsonBig = {};
			arr = [];
		}
		return arrBig;
	};
	var more2 = transformData1(data);
	var arrw = [];
	more2[0].type = "bar";
	more2[0].yAxis = 2;
	more2[1].type = "bar";
	more2[1].yAxis = 2;

	nv.addGraph(function() {
		var chart = nv.models.activeChart()
			.width(210)
			.height(110)
			.showLegend(false)
			.margin({
				top: 0,
				right: 0,
				bottom: 20,
				left: 0
			})
			.color(['#009ee3', '#ff6c5b'])
			.x(function(d, i) {
				return i
			})
			.multipleNum(5);
		chart.xAxis.showMaxMin(false).tickFormat(function(d, i) {
			return (i == (chart.xAxis.ticks() - 1)) ? '昨日' : '';
		});
		chart.yAxis1.tickFormat(function(d) {
			return '';
		}).showMaxMin(true);
		chart.yAxis2.tickFormat(function(d) {
			return '';
		}).showMaxMin(false);

		d3.select(ele[0])
			.append('svg')
			.attr('width', 210)
			.attr('height', 110)
			.datum(more2)
			.transition().duration(500).call(chart);

		return chart;
	});
	d3.select(ele[0]).selectAll('text')
		.attr('text-anchor', 'end');
};

module.exports = renderChart;
