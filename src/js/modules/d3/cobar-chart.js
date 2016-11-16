/**
 * Example:
 *    coBar = CoBar(selector, options);
 *
 *  Functions:
 *    data(Array): Set the data array.
 */

require('d3');

function CoBar(selector, options) {
    var coBar = {};

    var _options = {
        data: [],
        margin: {top: 10, right: 10, bottom: 10, left: 35},
        width: 640,
        height: 320,
        barWidth: 20,
        barPadding: 10,
        barGroupPadding: 40,
        barGroupPaddingRight: 15,
		barGroupTitleWidth:90,//90 添加内部标题，所占宽度
        fontSize: 12,
        duration: 800,
        color: d3.scale.category10(),
        minValue: 0,
        maxValue: 100,
        onMouseOver: null,
        onMouseOut: null,
		type:"spoc"
    };
	if(_options.type !=="spoc"){
		_options.barGroupTitleWidth = 0;
	}

    // Extend options from argument
    if (options) {
        for (var key in options) {
            _options[key] = options[key];
        }
    }

    var _width, _height,
        _x, _y, _yAxis,
        _groupCount, _barCount,
        _lines = [],
        _map;

    // Init the svg component
    var _svg = d3.select(selector).append('svg');

    var _chart = _svg.append('g')
        .attr('class', 'chart');

    var _yAxisG = _svg.append('g')
        .attr('class', 'y axis');

    // Compute some values from options
    function measure() {
        _width = _options.width - _options.margin.left - _options.margin.right;
        _height = _options.height - _options.margin.top - _options.margin.bottom;
        _y = d3.scale.linear().range([_height, 0])
            .domain([_options.minValue, _options.maxValue]);
        _yAxis = d3.svg.axis()
            .scale(_y)
            .orient('left')
            .tickSize(1)
            .tickPadding(6)
            .tickValues(_y.ticks(3))
            .tickFormat(function(data) {
                return data + '%';
            });

        // Data ETL
        _groupCount = 0;
        _barCount = 0;
        _map = {};
        //for (var key in _options.data) {
        //    _options.data[key].barOffset = _barCount;
        //    for (var barKey in _options.data[key].children) {
        //        var offset = 0,
        //            length = _options.data[key].children[barKey].children.length;
        //        for (var stateKey = length - 1; stateKey >= 0; stateKey--) {
        //            _options.data[key].children[barKey].children[stateKey].barOffset = _barCount;
        //            _options.data[key].children[barKey].children[stateKey].offset = offset;
        //            offset += _options.data[key].children[barKey].children[stateKey].value;
        //            _map[joinKeys(_options.data[key].id,
        //                _options.data[key].children[barKey].id,
        //                _options.data[key].children[barKey].children[stateKey].id
        //            )] = _options.data[key].children[barKey].children[stateKey];
        //        }
        //        _barCount += 1;
        //    }
        //    _groupCount += 1;
        //}
		//更新了数据结构，重新计算位置偏移
		var _startX = 0;
		for (var key in _options.data) {//小节
			_options.data[key].barOffset = _barCount;

			_options.data[key]._startX = _startX;


			var tmpRecord = _options.data[key],recordBar_count=0;
			var sectionType_startX = _options.barGroupPadding;
			for (var barKey in tmpRecord.children) {
				var tmpSectionType = tmpRecord.children[barKey];//视频类型段
				tmpSectionType["_startX"] = sectionType_startX;
				sectionType_startX += _options.barGroupTitleWidth+(_options.barWidth + _options.barPadding) * tmpSectionType.children.length;

				for(var iLen=0;iLen<tmpSectionType.children.length;iLen++){
					var tmpSection = tmpSectionType.children[iLen];

					var length = tmpSection.children.length,
							offset = 0;
					recordBar_count= recordBar_count +1;
					for (var stateKey = length - 1; stateKey >= 0; stateKey--) {
						tmpSection.children[stateKey].barOffset = _barCount;
						tmpSection.children[stateKey].offset = offset;
						//堆叠高度
						offset +=tmpSection.children[stateKey].value;
						//_map[joinKeys(tmpRecord.id,
						//		tmpSection.id,
						//		tmpSection.children[stateKey].id
						//)] = tmpSection.children[stateKey];
					}
					_barCount += 1;
				}


			}
			_groupCount += 1;
			_options.data[key].bar_count = recordBar_count;
			_startX = _startX + (_options.barWidth + _options.barPadding) * recordBar_count +
			_options.barGroupTitleWidth*(tmpRecord.children.length)+ _options.barGroupPadding + _options.barGroupPaddingRight;

		}
		_options.width = _startX+1;
		//console.dir(_options.data);
    }

    function render() {

        measure();

        // Setup the component
        // _svg.attr('width', _options.width);
        _svg.attr('height', _options.height);

        _yAxisG.attr('transform', 'translate(' + _options.margin.left + ',' + _options.margin.top + ')')
            .call(_yAxis);

        _chart.attr('transform', 'translate(' + _options.margin.left + ',' + _options.margin.top + ')');

        // Draw bars
        var groups = _chart.selectAll('.bar-group').data(_options.data);
        var groupG = groups.enter().append('g')
            .attr('class', 'bar-group')
            .attr('transform', function(data, i) {
                return 'translate(' + data._startX+ ',0)';
            });

        groupG.append('rect')
            .attr('class', 'background')
            .attr('x', 0)
            .attr('y', 0)
            .attr('width', function(data) {
                return _options.barGroupTitleWidth * data.children.length + data.bar_count * (_options.barWidth + _options.barPadding) + _options.barGroupPadding + _options.barGroupPaddingRight;
            })
            .attr('height', _height);

        groupG.append('text')
            .attr('class', 'index g_num')
            .attr('x', _options.barGroupPadding / 2+2)
            .attr('y', function(data) {
                return _height / 2 + _options.fontSize / 3 +4;
            })
            .style('text-anchor', 'middle')
            .style('font-size', _options.fontSize + 'px') //
            .text(function(data, i) { return i+1; });

		groupG.append('text')
				.attr('class', 'title')
				.attr('x', _options.barGroupPadding / 2 - _options.fontSize / 2 + 4)
				.attr('y', -5)
				.text(function(data, i) { return data.name; });


		var bars_group = groups.selectAll(".barType")
				.data(function(data){return data.children})
				.enter().append("g")
				.attr("class","barType")
				.attr("transform",function(data,i){//计算偏移
					return "translate("+data["_startX"]+",0)";
				});
		//1、增加两行数据、标题，百分比
		bars_group.append("text")
					.attr("class","index")
					.attr('x', 20)
					.attr('y', function(data) {
						return 14+10;
					})
					.style('font-size','12px')
					.text(_options.firstTitle);

		if (_options.firstNumTitleX){
			bars_group.append("text")
					.attr("class","index")
					.attr('x', _options.firstNumTitleX)
					.attr('y', function(data) {
						return 14+10;
					})
					.style('font-size','13px')
					.style('font-family','num')
					.text(_options.firstNumTitle);
		}


		bars_group.append("text")
					.attr("class","innerTitle g_num")
					.attr('x', 20)
					.attr('y', function(data) {
						return 48;
					})
					.attr("fill",_options.secondColor)
					//.style('font-size','20px')
					.text(_options.secondTitle);



        var bars = bars_group.selectAll('.bar')
            .data(function(data) { return data.children; });

        bars.enter().append('g')
            .attr('class', 'bar')
            .attr('transform', function(data, i) {//+ _options.barGroupPadding
                return 'translate(' + (_options.barGroupTitleWidth + (_options.barWidth + _options.barPadding) * i) + ',0)';
            });

        var rects = bars.selectAll("rect")
            .data(function(data) { return data.children; });

        rects.enter().append('rect')
            .attr('width', _options.barWidth)
            .attr('y', _height)
            .attr('height', 0)
            .style('fill', _options.color)
            .on('mouseover', function(data, i) {
                updateData(data.map, data.offset, data.value);
                if (_options.onMouseOver) {
                    _options.onMouseOver(data, i, d3.event);
                }
            }).on('mouseout', function(data, i) {
                resetData();
                if (_options.onMouseOut) {
                    _options.onMouseOut(data, i, d3.event);
                }
            });

        rects.transition()
            .duration(_options.duration)
            .delay(function(data, i) {
                if (this._inited) {
                    return data.barOffset * _options.duration * 0.1;
                } else {
                    this._inited = true;
                    return data.barOffset * _options.duration * 0.1 + _options.duration * i * 0.25;
                }
            })
            .attr('y', function(data) {
                if (data.tmpOffset) {
                    return _y(data.tmpOffset + data.offset + data.value);
                } else {
                    return _y(data.offset + data.value);
                }
            })
            .attr('height', function(data) {
                return _y(0) - _y(data.offset + data.value);
            });

        // Add borders
        //var width = _barCount * (_options.barWidth + _options.barPadding) + _groupCount * (_options.barGroupPadding + _options.barGroupPaddingRight) + 1;

        var width = _options.width;

		_chart.selectAll('.border-top, .border-bottom').remove();
        var borderTop = _chart.append('line')
            .attr('class', 'border-top')
            .attr('x1', 0)
            .attr('y1', 0)
            .attr('x2', width)
            .attr('y2', 0);
        // Hack for svg width
        _svg.attr('width', _options.margin.left + width);
		//_svg.attr('width', 1000);

        var lines = _chart.selectAll('.reference')
            .data(_lines);

        lines.enter().append('line')
            .attr('class', 'reference')
            .attr('x1', 0)
            .attr('x2', width);

        lines.attr('y1', _y)
            .attr('y2', _y);

        lines.exit().remove();

        return coBar;
    }

    // Update map data into current data and save the old data to reset
    function updateData(map, offset, value) {
        if (!map) {
            return;
        }
        for (var id1 in map) {
            for (var id2 in map[id1].children) {
                for (var id3 in map[id1].children[id2].children) {
                    var data = _map[joinKeys(map[id1].id,
                                            map[id1].children[id2].id,
                                            map[id1].children[id2].children[id3].id)];
                    if (data) {
                        data.originValue = data.value;
                        data.tmpOffset = offset;
                        data.value = map[id1].children[id2].children[id3].value;
                    }
                }
            }
        }
        _lines = [offset, offset + value];
        render();
    }

    // Reset the origin data
    function resetData() {
        for (var i in _map) {
            _map[i].value = _map[i].originValue || _map[i].value;
            _map[i].tmpOffset = 0;
        }
        _lines = [];
        render();
    }

    function joinKeys(key1, key2, key3) {
        return key1 + key2 + key3;
    }

    // Set data or get data function
    coBar.data = function(data) {
        if (!arguments.length) return _options.data;

        _options.data = data;
        render();
        return coBar;
    };

    // Update the map relation
    coBar.map = function(data) {
        for (var id1 in data.relation) {
            for (var id2 in data.relation[id1].children) {
                for (var id3 in data.relation[id1].children[id2].children) {
                    var dataHit = _map[joinKeys(data.relation[id1].id,
                                                data.relation[id1].children[id2].id,
                                                data.relation[id1].children[id2].children[id3].id)];
                    if (dataHit) {
                        dataHit.map = data.relation[id1].children[id2].children[id3].map;
                    }
                }
            }
        }
    }

    // Init data
    coBar.data(_options.data);
    return coBar;
}

module.exports = CoBar;
