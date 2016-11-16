require('d3');
var nv = require('nvd3');
var $ = require('jquery');

var renderChart = function(data, ele, options) {
	var _options = {
		"width": 468,//100%
		"height": "280px",
		"margin": {
			"top": 30,
			"right": 60,
			"bottom": 50,
			"left": 30
		},
		"popupLabel": [],
		"showLegend": false,
		"stacked": false,
		"xtype": "time",
		"xFormat": "",
		"y1Format": ",f",
		"y2Format": ",f",
		'ticks': 5,
		"line1": {
			"size": 15,
			"color": "#009ee3",
			"label": "line1",
			"type": "bar",
			"yAxis": 2
		},
		"line2": {
			"size": 15,
			"color": "#ff6c5b",
			"label": "line2",
			"type": "bar",
			"yAxis": 2
		},
		"line3": {
			"size": 15,
			"color": "#68cacc",
			"label": "line3",
			"type": "line",
			"yAxis": 1
		},
		"ele": "#blaChart624 svg"
	};
	// var data = {
	// 	"line1": [{
	// 		"x": 1427846400000,
	// 		"y": 125,
	// 		"background": false
	// 	}, {
	// 		"x": 1427932800000,
	// 		"y": 121,
	// 		"background": false
	// 	}, {
	// 		"x": 1428019200000,
	// 		"y": 128,
	// 		"background": false
	// 	}, {
	// 		"x": 1428105600000,
	// 		"y": 123,
	// 		"background": true
	// 	}, {
	// 		"x": 1428192000000,
	// 		"y": 88,
	// 		"background": true
	// 	}, {
	// 		"x": 1428278400000,
	// 		"y": 97,
	// 		"background": false
	// 	}, {
	// 		"x": 1428364800000,
	// 		"y": 174,
	// 		"background": false
	// 	}, {
	// 		"x": 1428451200000,
	// 		"y": 230,
	// 		"background": false
	// 	}, {
	// 		"x": 1428537600000,
	// 		"y": 306,
	// 		"background": false
	// 	}, {
	// 		"x": 1428624000000,
	// 		"y": 270,
	// 		"background": false
	// 	}, {
	// 		"x": 1428710400000,
	// 		"y": 290,
	// 		"background": true
	// 	}, {
	// 		"x": 1428796800000,
	// 		"y": 277,
	// 		"background": true
	// 	}],
	// 	"line2": [{
	// 		"x": 1427846400000,
	// 		"y": -1,
	// 		"background": false
	// 	}, {
	// 		"x": 1427932800000,
	// 		"y": -1,
	// 		"background": false
	// 	}, {
	// 		"x": 1428019200000,
	// 		"y": -1,
	// 		"background": false
	// 	}, {
	// 		"x": 1428105600000,
	// 		"y": 0,
	// 		"background": true
	// 	}, {
	// 		"x": 1428192000000,
	// 		"y": 0,
	// 		"background": true
	// 	}, {
	// 		"x": 1428278400000,
	// 		"y": 0,
	// 		"background": false
	// 	}, {
	// 		"x": 1428364800000,
	// 		"y": -2,
	// 		"background": false
	// 	}, {
	// 		"x": 1428451200000,
	// 		"y": -2,
	// 		"background": false
	// 	}, {
	// 		"x": 1428537600000,
	// 		"y": -2,
	// 		"background": false
	// 	}, {
	// 		"x": 1428624000000,
	// 		"y": -5,
	// 		"background": false
	// 	}, {
	// 		"x": 1428710400000,
	// 		"y": -1,
	// 		"background": true
	// 	}, {
	// 		"x": 1428796800000,
	// 		"y": 0,
	// 		"background": true
	// 	}],
	// 	"line3": [{
	// 		"x": 1427846400000,
	// 		"y": 125,
	// 		"background": false
	// 	}, {
	// 		"x": 1427932800000,
	// 		"y": 246,
	// 		"background": false
	// 	}, {
	// 		"x": 1428019200000,
	// 		"y": 374,
	// 		"background": false
	// 	}, {
	// 		"x": 1428105600000,
	// 		"y": 497,
	// 		"background": true
	// 	}, {
	// 		"x": 1428192000000,
	// 		"y": 585,
	// 		"background": true
	// 	}, {
	// 		"x": 1428278400000,
	// 		"y": 682,
	// 		"background": false
	// 	}, {
	// 		"x": 1428364800000,
	// 		"y": 856,
	// 		"background": false
	// 	}, {
	// 		"x": 1428451200000,
	// 		"y": 1086,
	// 		"background": false
	// 	}, {
	// 		"x": 1428537600000,
	// 		"y": 1392,
	// 		"background": false
	// 	}, {
	// 		"x": 1428624000000,
	// 		"y": 1662,
	// 		"background": false
	// 	}, {
	// 		"x": 1428710400000,
	// 		"y": 1952,
	// 		"background": true
	// 	}, {
	// 		"x": 1428796800000,
	// 		"y": 2229,
	// 		"background": true
	// 	}]
	// };

	// Extend options from argument

	$.extend(_options, options || {});

	var transdata = function(data) {
		var obj = {};
		var datalist = [];
		for (var key in data) {
			obj = {
				'key': key,
				values: data[key],
				color: _options[key].color,
			}
			for (var eles in obj.values) {
				obj.values[eles].color = _options[key].color
			}
			datalist.push(obj);
		}
		return datalist;
	}
	var dataArray = transdata(data).map(function(series) {
		series.values = series.values.map(function(d) {
			return {
				x: d.x,
				y: d.y,
				color: d.color,
				background: d.background
			}
		});
		return series;
	});
	for (var i in dataArray) {
		dataArray[i].type = _options[dataArray[i].key].type;
		dataArray[i].yAxis = parseInt(_options[dataArray[i].key].yAxis);
	}

	var _width, _height,
		_x, _y,
		_dataLength,
		_area, _line,
		_hover;

	nv.addGraph(function() {
		switch (_options.xtype) {
			case 'ordinal':
				var chart = xt.models.multiDisBarChart();
				chart.xAxis.tickFormat(function(d) {
					return d;
				});
				break;
			case 'time':
				var chart = nv.models.multiChart();
				chart.xAxis.tickFormat(function(d) {
					var dx = d || 0;
					if (dx > 0) {
						return d3.time.format('%Y-%m-%d')(new Date(dx))
					}
					return null;
				});
				break;
			default:
				var chart = nv.models.multiChart();
				chart.xAxis.tickFormat(d3.format(_options.xFormat));
		}
		chart.margin(_options.margin || {
				top: 30,
				right: 60,
				bottom: 50,
				left: 70
			})
			.color(_options.color || d3.scale.category10().range())
			.showLegend(_options.showLegend);


		chart.yAxis1.tickFormat(function(d) {
			var dy = d || 0;
			var prefix = d3.formatPrefix(dy);
			return (prefix.scale(dy) + prefix.symbol);
		});
		chart.yAxis2.tickFormat(function(d) {
			var dy = d || 0;
			var prefix = d3.formatPrefix(dy);
			return (prefix.scale(dy) + prefix.symbol);
		});
		var tooltip = function(date, arg0, arg1, arg2, e, graph) {
			// return '<h3>' + date + '</h3>' +
			// 	'<p class="pro">活跃用户数</p>' +
			// 	'<p class="num">' + arg0 + '</p>' +
			// 	'<p class="pro">新增复活用户数</p>' +
			// 	'<p class="num">' + arg1 + '</p>' +
			// 	'<p class="pro">新增沉睡用户数</p>' +
			// 	'<p class="num">' + arg2 + '</p>';

			return '<h3>' + date + '</h3>' +
				'<p class="pro">' + _options.popupLabel[0] + '</p>' +
				'<p class="num">' + arg0 + '</p>' +
				'<p class="pro">' + _options.popupLabel[1] + '</p>' +
				'<p class="num">' + arg1 + '</p>' +
				'<p class="pro">' + _options.popupLabel[2] + '</p>' +
				'<p class="num">' + arg2 + '</p>';

		}
		chart.tooltip(tooltip);
		d3.select(ele)
			.append('svg')
			.attr('width', _options.width)
			.attr('height', _options.height)
			.datum(dataArray)
			.transition().duration(500).call(chart);

		return chart;
	});
};

module.exports = renderChart;
