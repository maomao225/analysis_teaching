var nv = require('nvd3');


module.exports = function(data, ele) {
	var transformData3 = function(obj) {
		// 定义一个数组存储数据
		var arrBig = [];
		var arr = [];
		var jsonBig = {};
		var newJson = {};
		var dicArray = ['children'];
		var val = obj['distribution']['children'];
		for (var j = 0, len1 = dicArray.length; j < len1; j++) {
			jsonBig.key = 'stream' + j;
			for (var i = 0, len = val.length; i < len; i++) {
				newJson.x = (parseInt(val[i].id) + 1) * 2;
				newJson.y = val[i].value;
				newJson.name = val[i].name;
				newJson.above = val[i].above;
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
	var answerData = transformData3(data);

	nv.addGraph({
		generate: function() {
			var width = 210,
				height = 110;

			var chart = nv.models.multiBarChart()
				.width(width)
				.height(height)
				.margin({
					top: 0,
					right: 15,
					bottom: 20,
					left: 15
				})
				.stacked(true)
				.delay(0)
				.showControls(false)
				.showLegend(false)
				.color(['#0ba2e4']);
			chart.dispatch.on('renderEnd', function() {
				// console.log('Render Complete');
			});
			chart.yAxis.tickFormat(function(d, i) {
				var commasFormatter = d3.format(",s");
				return (commasFormatter(d) + ((i == (chart.yAxis.ticks() - 1)) ? '•人' : ''));
			}).showMaxMin(false);
			chart.xAxis.tickFormat(function(d) {
				var commasFormatter = d3.format(",f");
				return d < 0 ? '' : commasFormatter(d) + '%';
			}).showMaxMin(false);
			var tooltip = function( key,x, y, e, graph) {
				var str = x.replace('%','');
				var num = new Number(str);
				num = num-2;
				return '<h3>' + num + '%到' + x + '得分人数</h3>' +
					'<p class="num">' +  y + '</p>'
			}
			chart.tooltip(tooltip);
			var svg = d3.select(ele)
				.append('svg')
				.attr('width', width)
				.attr('height', height)
				.datum(answerData);
			// console.log('calling chart');
			svg.transition().duration(0).call(chart);

			return chart;
		}
	});
}
