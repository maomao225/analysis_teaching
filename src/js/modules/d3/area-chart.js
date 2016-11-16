require('d3');
var $ = require('jquery');

function areaChart(selector, options) {
	var areaChart = {};

	var _options = {
		data: [],
		margin: {top: 0, right: 0, bottom: 0, left: 0},
		width: 640,
		height: 320,
		color: d3.scale.category10(),
		strokeWidth: 2,
		tickLabel: '昨日',
		fontSize: 10,
		duration: 800,
		opacity: .3,
		hoverColor: '#0f95ee',
		locColor: '#dddfe1',
		onMouseOver: null,
		onMouseOut: null
	};

	// Extend options from argument
	if (options) {
		for (key in options) {
			_options[key] = options[key];
		}
	}

	var _width, _height,
		_x, _y,
		_dataLength,
		_area, _line,
		_hover;

	// Init the svg component
	var _svg = d3.select(selector).append('svg');

	var _background = _svg.append('g')
		.attr('class', 'background');

	var _chart = _svg.append('g')
		.attr('class', 'chart');

	var _label = _svg.append('g')
		.attr('class', 'label');
	_label.append('text');

	// Compute some values from options
	function measure() {
		_width = _options.width - _options.margin.left - _options.margin.right;
		_height = _options.height - _options.margin.top - _options.margin.bottom;
		_dataLength = d3.max(_options.data, function(data) { return data.children.length; });
		_x = d3.scale.linear().range([0, _width]).domain([-0.3, _dataLength - 0.7]);
		_y = d3.scale.linear().range([_height, 0]).domain([
				1.05 * d3.min(_options.data, function(data) { return d3.min(data.children, function(data) { return data.value; }); }),
				1.05 * d3.max(_options.data, function(data) { return d3.max(data.children, function(data) { return data.value; }); })
			]);
		_area = d3.svg.area()
			.x(function(data, i) { return _x(i); })
			.y0(_y(0))
			.y1(function(data) { return _y(data.currentValue); });
		_line = d3.svg.area()
			.x(function(data, i) { return _x(i); })
			.y(function(data) { return _y(data.currentValue); });
	}

	function render() {
		measure();

		// Setup the component
		_svg.attr('width', _options.width)
			.attr('height', _options.height);

		// Draw label
		_label.selectAll('text')
			.attr('x', _x(_dataLength - 1))
			.attr('y', _y(0) - _options.fontSize / 3)
			.style('text-anchor', 'end')
			.style('font-size', _options.fontSize)
			.style('pointer-events', 'none')
			.text(_options.tickLabel);

		// Draw locLine
		_background.selectAll('.loc-line').remove();
		if (_options.data.length > 0) {
			for (var key in _options.data[0].children) {
				if (_options.data[0].children[key].locLine) {
					_background.append('line')
						.attr('class', 'loc-line')
						.attr('y1', 0)
						.attr('y2', _height)
						.attr('x1', _x(key))
						.attr('x2', _x(key))
						.style('stroke', _options.locColor)
						.style('stroke-width', _options.strokeWidth);
				}
			}
		}

		// Mouse events
		_svg.on('mousemove', function() {
			if (_hover == null) {
				_background.append('line')
					.attr('class', 'hover')
					.attr('y1', 0)
					.attr('y2', _height)
					.style('stroke', _options.hoverColor)
					.style('stroke-width', _options.strokeWidth);
				for (var i in _options.data) {
					_background.append('circle')
						.attr('class', 'hover offset' + i)
						.attr('r', _options.strokeWidth * 2)
						.style('fill', _options.color(i));
				}
			}

            var e = d3.event;
			var offsetX = Math.round(_x.invert((e.offsetX || e.clientX - $(e.target).offset().left)));
			if (_hover != offsetX) {
				_background.select('line.hover')
					.attr('x1', _x(offsetX))
					.attr('x2', _x(offsetX));
				for (var i in _options.data) {
					_background.select('circle.hover.offset' + i)
						.attr('cx', _x(offsetX))
						.attr('cy', _y(_options.data[i].children[offsetX].currentValue || 0));
				}
				_hover = offsetX;

				if (_options.onMouseOver) {
					_options.onMouseOver(hoverData(), _hover, d3.event);
				}
			}
		}).on('mouseleave', function() {
			if (_options.onMouseOut) {
				_options.onMouseOut(hoverData(), _hover, d3.event);
			}
			_background.selectAll('.hover').remove();
			_hover = null;
		});

		// Draw areas
		var paths = _chart.selectAll('.group').data(_options.data);

		var pathEnter = paths.enter().append('g')
			.attr('class', 'group')
			.attr('transform', 'translate(' + _options.margin.left + ',' + _options.margin.top + ')');

		pathEnter.append('path')
			.datum(function(data) { return data.children; })
			.attr('class', 'area')
			.style('fill', function(data, i) {
				return _options.color(i);
			})
			.style('opacity', _options.opacity)
		.transition()
			.duration(_options.duration)
			.delay(function(data, i) {
				return i * _options.duration * .1;
			})
			.attrTween('d', function(data, i) {
				return function(t) {
					for (var i in data) {
						data[i].currentValue = t * data[i].value;
					}
					return _area(data);
				};
			});

		pathEnter.append('path')
			.datum(function(data) { return data.children; })
			.attr('class', 'area')
			.style('stroke', function(data, i) {
				return _options.color(i);
			})
			.style('stroke-width', _options.strokeWidth + 'px')
		.transition()
			.duration(_options.duration)
			.delay(function(data, i) {
				return i * _options.duration * .1;
			})
			.attrTween('d', function(data, i) {
				return function(t) {
					for (var key in data) {
						data[key].currentValue = t * data[key].value;
					}
					// Hack for hover circles
					if (_hover != null) {
						_background.select('circle.hover.offset' + i)
							.attr('cy', _y(_options.data[i].children[_hover].currentValue));
					}
					return _line(data);
				};
			});

		return areaChart;
	}

	// Return the hover data or null
	function hoverData() {
		if (_hover == null) {
			return null;
		}
		data = [];
		for (var i in _options.data) {
			_options.data[i].children[_hover].parentName = _options.data[i].name;
			data.push(_options.data[i].children[_hover]);
		}
		return data;
	}

	// Set data or get data function
	areaChart.data = function(data) {
		if (!arguments.length) return _options.data;

		_options.data = data;
		render();
		return areaChart;
	}

	// Init data
	areaChart.data(_options.data);
	return areaChart;
}

module.exports = areaChart;
