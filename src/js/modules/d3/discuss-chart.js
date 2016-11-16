require('d3');
var nv = require('nvd3');
var AreaChart = require('areaChart')
var nvToolTip = require('nvToolTip')



var renderChart = function(data, ele) {
	var reply_num = {
			children: []
		,	id: '总回帖数'
		,	name: '新增回帖数'
	}, discussion_num = {
			children: []
		, id: '总发帖数'
		, name: '新增发帖数'
	}, no_reply_num = {
			children: []
		, id: '零回帖数'
		,	name: '新增零回帖数'
	}

	data.forEach(function(day, idx){
		var date = day.id

		reply_num.children.push({
				id: idx
			,	name: date
			,	value: day.children[2].value
			, locLine: !new Date(date).getDay()
		})
		discussion_num.children.push({
				id: idx
			,	name: date
			,	value: day.children[0].value
		})
		no_reply_num.children.push({
				id: idx
			,	name: date
			,	value: -day.children[1].value
		})
	})

	// areaData[0].children[5].locLine = true;
	// areaData[0].children[12].locLine = true;

	areaChart = AreaChart(ele, {
		data: [reply_num, discussion_num, no_reply_num],
		width: 210,
		height: 110,
		strokeWidth: 1.5,
		color: d3.scale.ordinal().range(['#80c269', '#0f95ee', '#ff6c5b']),
		onMouseOver: function(data, i, event) {
			var html = '<h3>' + data[0]['name'] + '<h3>';
			for (var i = 0, l=data.length; i < l ; i++) {
				html += '<p class="pro">' + data[i]['parentName'] + '</p><p class="num">' + Math.abs(data[i]['value']) + '</p>';
			}
			nvToolTip(html);
		},
		onMouseOut: function(data, i, event) {
			nvToolTip.removeToolTip();
		}
	});

};

module.exports = renderChart;
