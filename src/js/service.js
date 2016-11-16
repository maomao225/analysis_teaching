var fetchResolve = require('fetchResolve')
var habitTop3 = require('habitTop3')
var dateFormat = require('dateFormat')
var serviceIsWeekend = require('service.isWeekend')
var serviceSassConfig = require('service.sassConfig')
var serviceIndexSchedule = require('service.indexSchedule')

var app = angular.module('xuetangxData.service', [])

var $body = $('body').eq(0)
// cms的MD5算法好奇怪, 不仅改文件名还改目录名
var MD5staticDir = ''
if ($('#GET_MD5_CODE').length) {
    MD5staticDir = $('#GET_MD5_CODE').attr('src').match(/(\/static\/.*)\/images\//)
}

app.value('interfaces', {
    indexCourseProcess: $body.data('index_course_process_interface'),
    indexCourseActivityRate: $body.data('index_course_activity_rate_interface'),
    indexCourseRegisterScale: $body.data('index_course_register_scale_interface'),
    indexCourseCommunityStat: $body.data('index_course_community_stat_interface'),
    indexDashboardModules: $body.data('index_dashboard_modules_interface'),
    staticDir: 'http://storage.xuetangx.com/public_assets/xuetangx/images/analysis_teaching'
})

app.run(['$templateCache', function($templateCache) {
    $templateCache.put('color.scss', require('!html!config.scss'))
}])

serviceIndexSchedule(app)

app.provider('sassConfig', function() {
    return {
        $get: ['$templateCache', serviceSassConfig]
    }
})

app.provider('resolve', function() {
    return {
        $get: ['ajax', '$q', 'interfaces', fetchResolve]
    }
})

app.provider('isWeekend', function() {
    return {
        $get: ['dateFormat', serviceIsWeekend]
    }
})

app.provider('dateFormat', function() {
    return {
        $get: dateFormat
    }
})

app.provider('habitTop3', function() {
    return {
        $get: habitTop3
    }
})

app.provider('ajax', function() {
    return {
        $get: ['$http', function($http) {
            var record = []
            return function(option) {
                var forReturn = null
                record.forEach(function(val) {
                    if (val.url === option.url && val.method === option.method && val.data === option.data && val.params === option.params) {
                        forReturn = val.promise
                    }
                })

                if (!forReturn) {
                    forReturn = $http(option)
                    record.push({
                        url: option.url,
                        promise: forReturn,
                        method: option.method,
                        data: option.data,
                        params: option.params
                    })
                }
                return forReturn
            }
        }]
    }
})

app.provider('tmpl', function() {
    return {
        $get: function() {
            var tmpl = function(str, data) {
                var f = !/[^\w\-\.:]/.test(str) ? tmpl.cache[str] = tmpl.cache[str] ||
                    tmpl(tmpl.load(str)) :
                    new Function(
                        tmpl.arg + ",tmpl",
                        "var _e=tmpl.encode" + tmpl.helper + ",_s='" +
                        str.replace(tmpl.regexp, tmpl.func) +
                        "';return _s;"
                    )
                return data ? f(data, tmpl) : function(data) {
                    return f(data, tmpl)
                }
            }
            tmpl.cache = {}
            tmpl.load = function(id) {
                return document.getElementById(id).innerHTML
            }
            tmpl.regexp = /([\s'\\])(?!(?:[^{]|\{(?!%))*%\})|(?:\{%(=|#)([\s\S]+?)%\})|(\{%)|(%\})/g
            tmpl.func = function(s, p1, p2, p3, p4, p5) {
                if (p1) { // whitespace, quote and backspace in HTML context
                    return {
                        "\n": "\\n",
                        "\r": "\\r",
                        "\t": "\\t",
                        " ": " "
                    }[p1] || "\\" + p1
                }
                if (p2) { // interpolation: {%=prop%}, or unescaped: {%#prop%}
                    if (p2 === "=") {
                        return "'+_e(" + p3 + ")+'"
                    }
                    return "'+(" + p3 + "==null?'':" + p3 + ")+'"
                }
                if (p4) { // evaluation start tag: {%
                    return "';"
                }
                if (p5) { // evaluation end tag: %}
                    return "_s+='"
                }
            }
            tmpl.encReg = /[<>&"'\x00]/g
            tmpl.encMap = {
                "<": "&lt;",
                ">": "&gt;",
                "&": "&amp;",
                "\"": "&quot;",
                "'": "&#39;"
            }
            tmpl.encode = function(s) {
                /*jshint eqnull:true */
                return (s == null ? "" : "" + s).replace(
                    tmpl.encReg,
                    function(c) {
                        return tmpl.encMap[c] || ""
                    }
                )
            }
            tmpl.arg = 'o'
            tmpl.helper = ",print=function(s,e){_s+=e?(s==null?'':s):_e(s);}" +
                ",include=function(s,d){_s+=tmpl(s,d);}"
            return tmpl
        }
    }
})

app.provider('template_tpl_layout', function() {
    return {
        $get: ['$compile', 'ajax', '$rootScope', 'interfaces', '$templateCache', '$q', 'tmpl',
            function($compile, ajax, $rootScope, interfaces, $templateCache, $q, tmpl) {
                return function(modules_ary, layoutType) {
                    //模版配置项
                    var modules_config = {
                        "vitality.html": {
                            interface: "{{interfaces.indexVitality + ',' + interfaces.indexAttention}}",
                            storage: "fetch,curregisterTotal",
                            styleClass: "heat"
                        },
                        "attention.html": {
                            interface: "{{interfaces.indexAttention}}",
                            storage: "regist_count",
                            styleClass: "attention"
                        },
                        "habit.html": {
                            interface: "{{interfaces.indexHabit}}",
                            storage: "d3Heat",
                            styleClass: "habit"
                        },
                        "schedule.html": {
                            interface: "{{interfaces.indexChapter + ',' + interfaces.indexProcess + ',' + interfaces.indexDotmatrix + ',' + interfaces.indexAttention + ','+interfaces.indexScheduleExam}}",
                            storage: "fetchChapter,cobar,dotMatrix,curregisterTotal,indexScheduleExam",
                            styleClass: "schedule"
                        },
                        "scheduleMooc.html": {
                            interface: "{{interfaces.indexChapter + ',' + interfaces.indexProcessMooc + ',' + interfaces.indexAttention}}",
                            storage: "chapter,cobar,curregisterTotal",
                            styleClass: "schedule_mooc"
                        },
                        "discuss.html": {
                            interface: "{{interfaces.indexDiscuss}}",
                            storage: "d3Discuss",
                            styleClass: "discuss"
                        },
                        "score.html": {
                            interface: "{{interfaces.indexScore}}",
                            storage: "d3Score",
                            styleClass: "score"
                        },
                        "assistant.html": {
                            interface: "{{interfaces.indexAssistant}}",
                            storage: "fetch",
                            styleClass: "assistant"
                        },
                        "interactMode.html": {
                            interface: "{{interfaces.indexTotalPostNum + ','+interfaces.indexTotalCommentNum + ',' +interfaces.indexNoCommentPosts + ',' + interfaces.indexNoCommentPostsEveryday + ',' + interfaces.indexPostStatistics + ',' + interfaces.indexPostStatisticsDaily + ',' + interfaces.indexPostRank + ',' + interfaces.indexCommentRank + ',' + interfaces.indexStudentPost + ',' + interfaces.indexPostRelation}}",
                            storage: "speakTotalCount,indexTotalCommentNum,indexNoCommentPosts,indexNoCommentPostsEveryday,indexPostStatistics,indexPostStatisticsDaily,indexPostRank,indexCommentRank,indexStudentPost,indexPostRelation",
                            styleClass: "container2 interactMode_parent"
                        },
                        "download.html": {
                            interface: "{{interfaces.indexDownloadStudent}}",
                            storage: "studentData",
                            styleClass: ""
                        },
                        "difficultyAny.html": {
                            interface: "{{interfaces.indexChapter}}",
                            storage: "fetchChapter",
                            styleClass: "heat container2"
                        },
                        "studyDifficulty.html": {
                            interface: "{{interfaces.indexKeywords}}",
                            storage: "keywords",
                            styleClass: "studyDifficulty"
                        },
                        "vitalityMooc.html": {
                            interface: "{{interfaces.indexVitalityMooc}}",
                            storage: "d3Vitality",
                            styleClass: "heat"
                        },
                        "regional.html": {
                            interface: "{{interfaces.indexRegional}}",
                            storage: "geomap",
                            styleClass: "regional"
                        },
                        "attentionMooc.html": {
                            interface: "{{interfaces.indexAttentionMooc}}",
                            storage: "count",
                            styleClass: "attention"
                        },
                        "inactive.html": {
                            interface: "{{interfaces.indexInactive + ',' + interfaces.indexAttention}}",
                            storage: "d3Inactive,curregisterTotal",
                            styleClass: "inactive"
                        },
                        "forecast.html": {
                            interface: "{{interfaces.indexForecast}}",
                            storage: "forecast",
                            styleClass: ""
                        },
                        "forecastCertificate.html": {
                            interface: "{{interfaces.indexForecastCertificate + ',' +interfaces.indexAttention}}",
                            storage: "forecast,enrollmentTotal",
                            styleClass: "forecast_certificate"
                        },
                        "moocFooter.html": {
                            template: '<footer class="index_footer mt100" init-data-loading="{{interfaces.indexLogdate}}" init-data-loading-storage="data" init-data-loading-tpl="moocFooter.html" init-data-loading-not="true"> </footer>',
                            isFooter: true
                        }
                    }

                    // 加载固定布局模版
                    var layout_template = 'tpl_left.html'
                    if (layoutType == 'tpl_left') {
                        layout_template = 'tpl_left.html'
                    } else if (layoutType == 'tpl_right') {
                        layout_template = 'tpl_right.html'
                    } else if (layoutType == 'tpl_one') {
                        layout_template = 'tpl_one.html'
                    } else if (layoutType == 'tpl_small') {
                        layout_template = 'tpl_small.html'
                    }

                    var template = $templateCache.get(layout_template),
                        sType = 'common'
                    var startSize = 1
                    var $scope = {}
                    var template_name
                    for (var i = 0; i < modules_ary.length; i++) {
                        // 获取数据，
                        $scope.staticDir = interfaces.staticDir
                        var curModule = modules_ary[i]
                        var urlArr = curModule['interfaces']
                        for (var name in urlArr) {
                            // 将接口url填充到interfaces里
                            var urlValue = urlArr[name]
                            interfaces[name] = urlValue
                        }

                        if (curModule['template'] === 'moocFooter.html') {
                            return {
                                type: 'footer',
                                contentHtml: modules_config['moocFooter.html']['template']
                            }
                        }
                        if (curModule['template'] === 'download.html') {
                            sType = 'download'
                            layout_template = 'tpl_oneouter.html'
                            template = $templateCache.get(layout_template)
                        }
                        if (curModule.size.col + '' === '3') {
                            curModule.sizeClass = 'size' + startSize
                            var tmpSize = 'size' + startSize
                            startSize++
                            template_name = curModule['template']
                            if (modules_config[template_name]) {
                                $scope[tmpSize + '_data'] = modules_config[template_name]['interface']
                                $scope[tmpSize + '_storage'] = modules_config[template_name]['storage']
                                $scope[tmpSize + '_template'] = template_name
                                $scope[tmpSize + '_class'] = modules_config[template_name]['styleClass']
                            }
                        } else if ((curModule.size.col + '' === '6') || (curModule.size.col + '' === '9')) {
                            template_name = curModule['template']
                            if (modules_config[template_name]) {
                                $scope['mainSize_data'] = modules_config[template_name]['interface']
                                $scope['mainSize_storage'] = modules_config[template_name]['storage']
                                $scope['mainSize_class'] = modules_config[template_name]['styleClass']
                                $scope['mainSize_template'] = template_name
                            }
                        }
                    }
                    var html = tmpl(template, $scope)
                    return {
                        type: sType,
                        contentHtml: html
                    }
                }
            }
        ]
    }
})
