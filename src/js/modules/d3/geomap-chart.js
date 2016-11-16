var D3Map = function(options) {
    var defaults = {
        arrRadius: [],
        mapWidth: 300,
        mapHeight: 300,
        cityColor: '#009ee3',
        provinceColor: '#fff',
        mouseOverColor: '#009ee3',
        selectedColor: '#e32f02',
        selector: 'body',
        selectedArea: '',
        geoJSON: null,
        change: $.noop,
        toolTip: function(pro, r) {
            var html = '<div class="mapTip_index">' +
                '<p class="map_pro">' + pro + '选课人数</p>' +
                '<p class="map_r">' + r.toLocaleString() + '</p>' +
                '</div>'
            return html
        }
    }
    options = $.extend(defaults, options)
    if (!options.geoJSON) {
        throw new Error('miss param geoJSON')
    }
    this._init(options)
    return this
}
D3Map.prototype.arrRadius = []
D3Map.prototype.transformData = function(geoArr, dataArr) {
    var self = this
    var getValue = function(arr, id) {
        var value = 0
        for (var i = 0, l = arr.length; i < l; i++) {
            if (arr[i].id === id) {
                value = arr[i].value
                break
            }
        }
        return value
    }

    for (var i = 0, l = geoArr.length; i < l; i++) {
        var prov = geoArr[i].properties.province
        for (var h = 0, k = dataArr.length; h < k; h++) {
            var city = dataArr[h].name.split('-')[1]
            if (city == prov) {
                var radius = getValue(dataArr[h].children, 'total_enrolls')
                geoArr[i].r = radius
                self.arrRadius.push(Math.sqrt(radius))
            }
        }
    }

    return geoArr
}

D3Map.prototype._getTipPos = function(e) {
    var mouseX
    var mouseY
    var tipWidth = $('.mapTip').outerWidth()
    var tipHeight = $('.mapTip').outerHeight()
    if (e && e.pageX) {
        mouseX = e.pageX
        mouseY = e.pageY
    } else {
        mouseX = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft
        mouseY = event.clientY + document.body.scrollTop + document.documentElement.scrollTop
    }
    var tipX = mouseX - tipWidth / 2 < 0 ? 0 : mouseX - tipWidth / 2
    var tipY = mouseY - tipHeight - 10 < 0 ? mouseY + 10 : mouseY - tipHeight - 10
    return [tipX, tipY]
}

D3Map.prototype._init = function(options) {
    var self = this
    var selector = options.selector

    $(selector).on('GEOJSON_DONE', function(event, json) {
        json = self.transformData(window.geoJSON.features, json.area)
        for (var i = 0; i < json.length - 1; ++i) {
            if (json[i]['properties']['type'] !== 'city') {
                continue
            }
            for (var j = i + 1; j < json.length; ++j) {
                if (!json[j]['r'] || (json[i]['r'] < json[j]['r'])) {
                    var k = json[i]
                    json[i] = json[j]
                    json[j] = k
                }
            }
        }
        var mapWidth = options.mapWidth
        var mapHeight = options.mapHeight
        var cityColor = options.cityColor
        var provinceColor = options.provinceColor
        var selectedColor = options.selectedColor
        var selectedArea = options.selectedArea.split(',')
        var projection = d3.geo.albers()
            .scale(mapWidth * 1.21)
            .translate([mapWidth / 2, mapHeight / 2])
            .rotate([-105, 0])
            .center([0, 36])
            .parallels([27, 45])
        var path = d3.geo.path().projection(projection)
        var scale = d3.scale.linear()
        scale.domain(d3.extent(self.arrRadius))
            .range([4, mapWidth * .12])
        path.pointRadius(function(data) {
            return scale(Math.sqrt(data.r)) || 0
        })
        var svg = d3.select(selector)
            .append('svg')
            .attr({
                'width': mapWidth,
                'height': mapHeight
            })
        svg.selectAll('path .map2')
            .data(json)
            .enter()
            .append('path')
            .attr('d', path)
            .attr('class', 'map2')
            .attr('stroke', '#9baeb2')
            .attr('stroke-width', '.5')
            .attr('data-type', function(data) {
                return data.properties.type
            })
            .attr('data-province', function(data) {
                return data.properties.province
            })
            .attr('data-name', function(data) {
                return data.properties.name
            })
            .attr('data-r', function(data) {
                return Math.sqrt(data.r)
            })
            .attr('fill', function(data) {
                var path = d3.select(this)
                if (data.properties.type === 'city') {
                    var str = data.properties.province + '|' + data.properties.name

                    return selectedArea.indexOf(str) !== -1 || path.attr('data-selected') === 'true' ? (path.attr('data-selected', 'true'), selectedColor) : cityColor
                } else {
                    var str = data.properties.province
                    if (selectedArea.indexOf(str) !== -1) {
                        d3.selectAll('[data-province=' + data.properties.name + ']')
                            .attr('data-selected', 'true')
                            .attr('fill', selectedColor)
                        return selectedColor
                    } else {
                        return provinceColor
                    }
                }
            })
        var city = d3.selectAll('path[data-type=city]').filter(function(d) {
            return d.r != 'undefined'
        })
        city
            .attr('fill-opacity', 0.3)
            .attr('stroke', 'none')

        city.on('mouseover', function(data) {
                var path = d3.select(this)
                path.transition().attr('fill-opacity', 0.8)
                if ($('.mapTip').length === 0) {
                    $(document.body).append('<div class="mapTip"></div>')
                }

                $('.mapTip').html(options.toolTip(data.properties.province, data.r))
                var xy = self._getTipPos(d3.event)
                $('.mapTip').css({
                    left: xy[0],
                    top: xy[1]
                }).show()
            })
            .on('mouseout', function(data) {
                var path = d3.select(this)
                path.transition().attr('fill-opacity', 0.3)
                $('.mapTip').hide()
            })
    })

    if (!window.geoJSON) {
        $.getScript(window.location.protocol + '//storage.xuetangx.com/public_assets/xuetangx/analysis_teaching/geoJSON.js', detectReady)
    } else {
        detectReady()
    }

    function detectReady() {
        if ($.isPlainObject(options.geoJSON)) {
            $(selector).trigger('GEOJSON_DONE', options.geoJSON)
        } else {
            d3.json(options.geoJSON, function(json) {
                $(selector).trigger('GEOJSON_DONE', json)
            })
        }
    }
}

module.exports = D3Map
