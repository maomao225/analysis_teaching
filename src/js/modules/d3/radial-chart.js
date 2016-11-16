/**
 * Example:
 *    radialProgress = RadialProgress(selector, options);
 *
 *  Functions:
 *    data(Array): Set the data array.
 *    colors(): Return the colors of data.
 *    emphasize(index): Set other arc's opacity to 0.5.
 *    deemphasize(): Reset all arcs.
 */
require('d3');

function RadialProgress(selector, options) {
    var radialProgress = {};

    var _options = {
        data: [],
        margin: {top: 0, right: 0, bottom: 0, left: 0},
        width: 320,
        height: 240,
        arcWidth: 10,
        arcPadding: 1,
        stroke: false,
        backgroundArcWidth: 0,
        backgroundArcColor: '#FFFFFF',
        duration: 800,
        color: d3.scale.category20b(),
        startAngle: 0,
        minValue: 0,
        maxValue: 100,
        fontSize: 0,
        subtitleFontSize: 0,
        detailFontSize: 0,
        onMouseOver: null,
        onMouseOut: null,
        label: {
            title: '',
            subtitle: [],
            detail: [],
        },
        showLegend: false,
        legendFontSize: 12,
        legendPadding: 8,
        legendFormat: function(data) {
            return data;
        }
    };

    // Extend options from argument
    if (options) {
        for (var key in options) {
            _options[key] = options[key];
        }
    }

    var _radius,
        _startAngle, _scale,
        _fontSize,
        _offsetX, _offsetY,
        _arc;

    // Init the svg component
    var _svg = d3.select(selector).append('svg');

    var _chart = _svg.append('g')
        .attr('class', 'chart');
    _chart.append('path')
        .attr('class', 'background-arc');

    var _label = _svg.append('g')
        .attr('class', 'label');
    _label.append('text')
        .attr('class', 'title');

    function arc(data, i) {
        var outerRadius = _radius - (_options.arcWidth + _options.arcPadding) * i;
        return (_arc
            .endAngle(_startAngle + _scale(data) * 2 * Math.PI)
            .outerRadius(outerRadius)
            .innerRadius(outerRadius - _options.arcWidth))(data, i);
    }

    function arcTween(data, i) {
        var that = this;
        this._current = this._current || 0;
        var interpolate = d3.interpolate(this._current, data);

        return function(t) {
            that._current = interpolate(t);
            return arc(interpolate(t), i);
        };
    }

    // Tween function when removing the arc
    function arcRemoveTween(data, i) {
        var interpolate = d3.interpolate(this._current, 0);

        return function(t) {
            return arc(interpolate(t), i);
        };
    }

    // Compute some values from options
    function measure() {
        var _width = _options.width - _options.margin.left - _options.margin.right,
            _height = _options.height - _options.margin.top - _options.margin.bottom;
        _radius = Math.min(_width / 2, _height / 2);
        _startAngle = _options.startAngle * (Math.PI/180);
        _scale = d3.scale.linear().domain([_options.minValue, _options.maxValue]);
        _fontSize = _options.fontSize || _radius * 0.44;
        _subtitleFontSize = _options.subtitleFontSize || _fontSize * 0.28;
        _detailFontSize = _options.detailFontSize || _fontSize * 0.28;
        _offsetX = (_options.showLegend ? _radius : _width / 2) + _options.margin.left;
        _offsetY = _height / 2 + _options.margin.top;
        _arc = d3.svg.arc()
            .startAngle(_startAngle);
    }

    function render() {
        measure();

        // Setup the component
        _svg.attr('width', _options.width)
            .attr('height', _options.height);

        // Draw arcs
        _chart.select('path.background-arc')
            .attr('transform', 'translate(' + _offsetX + ',' + _offsetY + ')')
            .attr('fill', _options.backgroundArcColor)
            .attr('d', _arc
                .endAngle(_startAngle + 2 * Math.PI)
                .outerRadius(_radius)
                .innerRadius(_radius - _options.backgroundArcWidth));

        var arcs = _chart.selectAll('path.arc').data(_options.data);

        var arcEnter = arcs.enter().append('path')
            .attr('class', 'arc')
            .attr('transform', 'translate(' + _offsetX + ',' + _offsetY + ')')
            .style('fill', function(data, i) { return _options.color(i); })
            .on('mouseover', function(data, i) {
                emphasize(i);
                if (_options.onMouseOver) {
                    _options.onMouseOver(data, i, d3.event);
                }
            })
            .on('mouseout', function(data, i) {
                deemphasize();
                if (_options.onMouseOut) {
                    _options.onMouseOut(data, i, d3.event);
                }
            })
            .attr('d', function(data, i) {
                return arc(data.value, i);
            });

        // Add strock to fix 0.5 pixel blank when non-padding problem
        if (_options.stroke) {
            arcEnter.attr('stroke', function(data, i) { return _options.color(i); });
        }

        arcs.transition()
            .duration(_options.duration)
            .attrTween('d', function(data, i) {
                return arcTween(data.value, i);
            });

        arcs.exit().transition()
            .duration(_options.duration)
            .attrTween('d', arcRemoveTween)
            .remove();

        // Draw title
        _label.select('.title')
            .text(_options.label.title)
            .attr('x', _offsetX)
            .attr('y', _offsetY + _fontSize / 3)
            .attr('text-anchor', 'middle')
            .style('font-size', _fontSize + 'px');

        // Draw subtitles
        if (_options.label.subtitle) {
            var subtitles = _label.selectAll('.subtitle').data(_options.label.subtitle);

            subtitles.enter().append('text')
                .text(function(data) {
                    return data;
                })
                .attr('class', 'subtitle')
                .attr('x', _offsetX)
                .attr('y', function(data, i) {
                    return _offsetY - _fontSize * 0.7 - _subtitleFontSize * 1.2 * (_options.label.subtitle.length - 1 - i);
                })
                .attr('text-anchor', 'middle')
                .style('font-size', _subtitleFontSize + 'px');

            subtitles.exit().remove();
        }

        // Draw details
        if (_options.label.detail) {
            var details = _label.selectAll('.detail').data(_options.label.detail);

            details.enter().append('text')
                .text(function(data) {
                    return data;
                })
                .attr('class', 'detail')
                .attr('x', _offsetX)
                .attr('y', function(data, i) {
                    return _offsetY + _fontSize * 0.5 + _detailFontSize * 1.2 * (i + 1);
                })
                .attr('text-anchor', 'middle')
                .style('font-size', _detailFontSize + 'px');

            details.exit().remove();
        }

        // Draw legend
        if (_options.showLegend) {
            var legend = _label.selectAll('.legend').data(_options.data);
            var offsetY = _offsetY - ((_options.legendFontSize + _options.legendPadding) * _options.data.length - _options.legendPadding) / 2;

            var g = legend.enter().append('g')
                .attr('class', 'legend')
                .attr('transform', function(data, i) {
                    return 'translate(' +
                      (_offsetX + _radius + 10) + ',' +
                      (offsetY + (_options.legendFontSize + _options.legendPadding)* i) + ')';
                })
                .on('mouseover', function(data, i) {
                    emphasize(i);
                    if (_options.onMouseOver) {
                        _options.onMouseOver(data, i, d3.event);
                    }
                })
                .on('mouseout', function(data, i) {
                    deemphasize();
                    if (_options.onMouseOut) {
                        _options.onMouseOut(data, i, d3.event);
                    }
                });

            g.append('rect')
                .attr('x', 0)
                .attr('y', _options.legendFontSize * 0.6 - 5)
                .attr('width', 10)
                .attr('height', 10)
                .style('fill', function(data, i) {
                    return _options.color(i);
                });

            g.append('text')
                .attr('x', 15)
                .attr('y', _options.legendFontSize)
                .style('font-size', _options.legendFontSize + 'px')
                .text(_options.legendFormat);

			//新增数字显示
			if (_options.showNum){
				g.append('text')
						.attr('x', _options.showNum_X)
						.attr('y', _options.legendFontSize)
						.style('font-size', _options.legendNumFontSize + 'px')
						.style('font-family', 'num')
						.text(_options.legendNumFormat);
			}




        }

        return radialProgress;
    }

    function emphasize(index) {
        deemphasize();
        _chart.selectAll('path.arc')
            .filter(function(_, i) {
                return index != i;
            })
            .transition(_options.duration)
            .style('opacity', 0.1);
        _label.selectAll('.legend')
            .filter(function(_, i) {
                return index != i;
            })
            .transition(_options.duration)
            .style('opacity', 0.1);
    }

    function deemphasize() {
        _svg.selectAll('path.arc, .legend')
            .transition(_options.duration)
            .style('opacity', 1);
    }

    // Set data or get data function
    radialProgress.data = function(data) {
        if (!arguments.length) return _options.data;

        _options.data = data;
        render();
        return radialProgress;
    };

    // Get the colors of arc, this function will calculate the colors when you call it
    radialProgress.colors = function(data) {
        colors = [];
        for (var i in _options.data) {
            colors.push(_options.color(i));
        }
        return colors;
    };

    // Init data
    radialProgress.data(_options.data);
    radialProgress.emphasize = emphasize;
    radialProgress.deemphasize = deemphasize;
    return radialProgress;
}

module.exports = RadialProgress;
