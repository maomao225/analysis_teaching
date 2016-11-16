/**
 * Example:
 *    coBar = CoBar(selector, options);
 *
 *  Functions:
 *    data(Array): Set the data array.
 */

require('d3');

function CoBarMooc(selector, options) {
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
		fontSize: 12,
		duration: 800,
		color: d3.scale.category10(),
		minValue: 0,
		maxValue: 100,
		onMouseOver: null,
		onMouseOut: null
	};

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
		for (var key in _options.data) {
			_options.data[key].barOffset = _barCount;
			for (var barKey in _options.data[key].children) {
				var offset = 0,
						length = _options.data[key].children[barKey].children.length;
				for (var stateKey = length - 1; stateKey >= 0; stateKey--) {
					_options.data[key].children[barKey].children[stateKey].barOffset = _barCount;
					_options.data[key].children[barKey].children[stateKey].offset = offset;
					offset += _options.data[key].children[barKey].children[stateKey].value;
					_map[joinKeys(_options.data[key].id,
							_options.data[key].children[barKey].id,
							_options.data[key].children[barKey].children[stateKey].id
					)] = _options.data[key].children[barKey].children[stateKey];
				}
				_barCount += 1;
			}
			_groupCount += 1;
		}
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
					return 'translate(' + ((_options.barWidth + _options.barPadding) * data.barOffset +
							(_options.barGroupPadding + _options.barGroupPaddingRight) * i) + ',0)';
				});

		groupG.append('rect')
				.attr('class', 'background')
				.attr('x', 0)
				.attr('y', 0)
				.attr('width', function(data) {
					return data.children.length * (_options.barWidth + _options.barPadding) + _options.barGroupPadding + _options.barGroupPaddingRight;
				})
				.attr('height', _height);

		groupG.append('text')
				.attr('class', 'index')
				.attr('x', _options.barGroupPadding / 2)
				.attr('y', function(data) {
					return _height / 2 + _options.fontSize / 3;
				})
				.style('text-anchor', 'middle')
				.style('font-size', _options.fontSize + 'px')
				.text(function(data, i) { return i; });

		groupG.append('text')
				.attr('class', 'title')
				.attr('x', _options.barGroupPadding / 2 - _options.fontSize / 2)
				.attr('y', -5)
				.text(function(data, i) { return data.name; });


		var bars = groups.selectAll('.bar')
				.data(function(data) { return data.children; });

		bars.enter().append('g')
				.attr('class', 'bar')
				.attr('transform', function(data, i) {
					return 'translate(' + (_options.barGroupPadding + (_options.barWidth + _options.barPadding) * i) + ',0)';
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
		var width = _barCount * (_options.barWidth + _options.barPadding) + _groupCount * (_options.barGroupPadding + _options.barGroupPaddingRight) + 1;
		_chart.selectAll('.border-top, .border-bottom').remove();
		var borderTop = _chart.append('line')
				.attr('class', 'border-top')
				.attr('x1', 0)
				.attr('y1', 0)
				.attr('x2', width)
				.attr('y2', 0);
		// Hack for svg width
		_svg.attr('width', _options.margin.left + width);

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

module.exports = CoBarMooc;
