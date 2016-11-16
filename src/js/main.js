require('angular')
require('angular-ui-router')
require('xuetangxData.controller')

var app = angular.module('xuetangxData', ['ui.router', 'xuetangxData.controller'])

app.run(['$templateCache', function($templateCache) {
    $templateCache.put('detail.html', require('templates/layout_template/detail.html'))
}])

app.config(['$interpolateProvider', '$stateProvider', '$urlRouterProvider', function($interpolateProvider, $stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/index')

    $stateProvider.state('index', {
        url: '/index',
        templateProvider: ['$http', '$q', 'template_tpl_layout', 'tmpl', 'interfaces', function($http, $q, template_tpl_layout, tmpl, interfaces) {
            var defer = $q.defer()
            var $body = $('body').eq(0)
            $http({
                method: 'get',
                url: interfaces.indexDashboardModules,
                data: {}
            }).then(function(response) {
                // 根据配置项，修改index.html模版，同时修改对应的URL获取方式
                var index_html = require('templates/index/index_config.html')
                var modules_template = ''
                var download_nav = 'none'
                var footer_default = 'block'
                var footer = ''
                for (var i = 0; i < response.data.groups.length; i++) {
                    var module_tpl = response.data.groups[i]
                    var returnObj = template_tpl_layout(module_tpl['modules'], module_tpl['template'])
                    if (returnObj['type'] == 'common') {
                        modules_template += returnObj['contentHtml']
                    } else if (returnObj['type'] == 'download') {
                        modules_template += returnObj['contentHtml']
                        download_nav = 'block'
                    } else if (returnObj['type'] == 'footer') {
                        footer_default = 'none'
                        footer = returnObj['contentHtml']
                    }
                }
                index_html = tmpl(index_html, {
                    'groups': modules_template,
                    'download_nav': download_nav,
                    'footer_default': footer_default,
                    'footer': footer
                })
                defer.resolve(index_html)
            }, function() {
                console.error('indexDashboardModules error')
            })
            return defer.promise
        }],
        controller: 'home'
    }).state('detail', {
        url: '/detail',
        templateUrl: 'detail.html'
    })
}])

angular.bootstrap(document, ['xuetangxData'])
