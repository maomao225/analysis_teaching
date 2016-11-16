/**
 * Example:
 *    heatmap = Heatmap(selector, options);
 *
 *  Functions:
 *    data(Array): Set the data array.
 */
require('d3');

function heatmap(selector, options) {
	var heatmap = {};

	var _options = {
		data: [],
		margin: {
			top: 10,
			right: 10,
			bottom: 10,
			left: 15
		},
		width: 640,
		height: 320,
		cellWidth: 7,
		cellHeight: 15,
		cellPadding: 1,
		cellGroup: 6,
		cellGroupPadding: 2,
		tickPadding: 3,
		fontSize: 10,
		duration: 400,
		colors: ['#b0ddfd', '#154fa5'],
		minValue: 0,
		maxValue: null,
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
		_scale;

	// Init the svg component
	var _svg = d3.select(selector).append('svg');

	var _chart = _svg.append('g')
		.attr('class', 'chart');

	var _label = _svg.append('g')
		.attr('class', 'label');

	// Compute some values from options
	function measure() {
		_width = _options.width - _options.margin.left - _options.margin.right;
		_height = _options.height - _options.margin.top - _options.margin.bottom;
		_scale = d3.scale.linear()
			.range(_options.colors)
			.domain([_options.minValue,
				_options.maxValue || d3.max(_options.data, function(data) {
					return d3.max(data.children, function(data) {
						return data.value;
					});
				})
			])
			.interpolate(d3.interpolateRgb);
	}

	function render() {
		measure();

		// Setup the component
		_svg.attr('width', _options.width)
			.attr('height', _options.height);

		// Draw cells
		var rows = _chart.selectAll('.row').data(_options.data);

		rows.enter().append('g')
			.attr('class', 'row')
			.attr('transform', function(data, i) {
				return 'translate(' + _options.margin.left + ',' + (_options.cellHeight + _options.cellPadding) * i + ')'
			})
			.append('text')
			.text(function(data) {
				return data.name;
			})
			.attr('x', -_options.tickPadding)
			.attr('y', _options.cellHeight / 2 + _options.fontSize / 3)
			.style('font-size', _options.fontSize)
			.style('text-anchor', 'end');

		var cells = rows.selectAll('.cell')
			.data(function(data, i) {
				for (var key in data.children) {
					data.children[key].offset = i;
					data.children[key].parentName = _options.data[i].name;
				}
				return data.children;
			});

		cells.enter().append('rect')
			.attr('width', _options.cellWidth)
			.attr('height', _options.cellHeight)
			.attr('x', function(data, i) {
				return (_options.cellWidth + _options.cellPadding) * i + (_options.cellGroupPadding - _options.cellPadding) * Math.floor(i / _options.cellGroup);
			})
			.style('fill', function(data) {
				return _scale(_options.minValue);
			})
			.on('mouseover', function(data, i) {
				d3.select(this)
					.style('stroke', '#FFFFFF')
					.style('stroke-width', '2px');
				if (_options.onMouseOver) {
					_options.onMouseOver(data, i, d3.event);
				}
			})
			.on('mouseout', function(data, i) {
				d3.select(this).transition()
					.style('stroke', 'none');
				if (_options.onMouseOut) {
					_options.onMouseOut(data, i, d3.event);
				}
			});

		cells.transition()
			.duration(_options.duration)
			.delay(function(data, i) {
				return (i * .25 + data.offset * .25) * _options.duration;
			})
			.style('fill', function(data) {
				return _scale(data.value);
			});

		if (_options.data[0]) {
			var y = (_options.cellHeight + _options.cellPadding) * _options.data.length + _options.fontSize + _options.tickPadding;
			for (var i = 0; i < _options.data[0].children.length; i += _options.cellGroup) {
				_label.append('text')
					.text(_options.data[0].children[i].name)
					.attr('x', _options.margin.left + (_options.cellWidth + _options.cellPadding) * i + (_options.cellGroupPadding - _options.cellPadding) * Math.floor(i / _options.cellGroup))
					.attr('y', y)
					.attr('font-size', _options.fontSize);
			}
		} else {
			_label.selectAll('text').remove();
		}

		return heatmap;
	}

	// Set data or get data function
	heatmap.data = function(data) {
		if (!arguments.length) return _options.data;

		_options.data = data;
		render();
		return heatmap;
	}

	// Init data
	heatmap.data(_options.data);
	return heatmap;
}

module.exports = heatmap;
