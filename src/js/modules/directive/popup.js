var $ = require('jquery');
window.$ = window.jQuery = $;
require('jquery.easing');
require('popup');
var config = require('popupConfig');

module.exports = function($compile) {
	return {
		link: function($scope, ele, attr) {

			$scope.$evalAsync(function() {
				var HTML = '';
				if (attr.popup) {
					HTML = $(attr.popup).html();
				} else {
					HTML = config[attr.popupHash];
				}

				if (HTML.indexOf('{{') !== -1) {
					HTML = $compile(HTML)($scope);
				}

				ele.popup({
					html: HTML,
					delay: {
						hide: 50
					},
					inline: attr.popupInline || false,
					hoverable: true,
					position: attr.popupPosition
				});
			});
		}
	}
};
