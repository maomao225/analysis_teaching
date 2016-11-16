module.exports = function() {
	return function(wk) {
		var temp = [];
		var value = '';
		var html = '';

		wk.map(function(day) {
			value = 0;
			day.children.forEach(function(hour) {
				var id = hour.id;
				var map = {
					5: '凌晨',
					11: '上午',
					17: '下午',
					23: '晚上'
				};

				if (id == 0 || id == 6 || id == 12 || id == 18) {
					value = 0
				} else {
					value += hour.value
				}

				if (id == 5 || id == 11 || id == 17 || id == 23) {
					temp.push({
						name: day.name + map[id],
						value: value
					});
				}
			})
		})

		temp = temp.sort(function(a, b) {
			return b.value - a.value;
		}).splice(0, 3).map(function(ele) {
			return ele.name;
		});

		html = temp.join(' ');

		return html;
	}
};
