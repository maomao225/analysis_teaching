require('xuetangxData.filter')
require('pagination')

var popup = require('ngPopup')
var ngIndexSchedule = require('ngIndexSchedule')
var xuetangX_chart = require('d3XtChart')
require('transition')
require('dropdown')

var nv = require('nvd3')
var nvToolTip = require('nvToolTip')

var app = angular.module('xuetangxData.directive', ['xuetangxData.filter', 'ui.bootstrap'])

app.run(['$templateCache', function($templateCache) {
    $templateCache.put('regional.html', require('templates/index/regional.html'))
    $templateCache.put('health.html', require('templates/index/health.html'))
    $templateCache.put('attention.html', require('templates/index/attention.html'))
    $templateCache.put('attentionMooc.html', require('templates/index/attentionMooc.html'))
    $templateCache.put('inactive.html', require('templates/index/inactive.html'))
    $templateCache.put('scheduleMooc.html', require('templates/index/scheduleMooc.html'))
    $templateCache.put('habit.html', require('templates/index/habit.html'))
    $templateCache.put('score.html', require('templates/index/score.html'))
    $templateCache.put('discuss.html', require('templates/index/discuss.html'))
    $templateCache.put('vitality.html', require('templates/index/vitality.html'))
    $templateCache.put('vitalityMooc.html', require('templates/index/vitalityMooc.html'))
    $templateCache.put('assistant.html', require('templates/index/assistant.html'))
    $templateCache.put('schedule.html', require('templates/index/schedule.html'))
    $templateCache.put('template/pagination/pagination.html', require('templates/directive/pagination.html'))
    $templateCache.put('dotMatrix/questionPopup.html', require('templates/directive/dotMatrix/questionPopup.html'))
    $templateCache.put('dotMatrix/videoPopup.html', require('templates/directive/dotMatrix/videoPopup.html'))
    $templateCache.put('dotMatrix/discussionPopup.html', require('templates/directive/dotMatrix/discussionPopup.html'))
    $templateCache.put('dotMatrix/summerPopup.html', require('templates/directive/dotMatrix/summerPopup.html'))
    $templateCache.put('dotMatrix/userPopup.html', require('templates/directive/dotMatrix/userPopup.html'))
    $templateCache.put('dotMatrix/examScore.html', require('templates/directive/dotMatrix/examScore.html'))
    $templateCache.put('index/header.html', require('templates/index/header.html'))
    $templateCache.put('index/indexBlackboard.html', require('templates/index/indexBlackboard.html'))
    $templateCache.put('moocFooter.html', require('templates/index/moocFooter.html'))
    $templateCache.put('forecast.html', require('templates/index/forecast.html'))
    $templateCache.put('forecastCertificate.html', require('templates/index/forecastCertificate.html'))
    $templateCache.put('download.html', require('templates/index/download.html'))
    $templateCache.put('interactMode.html', require('templates/index/interactMode.html'))
    $templateCache.put('difficultyAny.html', require('templates/index/difficultyAny.html'))
    $templateCache.put('studyDifficulty.html', require('templates/index/studyDifficulty.html'))
    $templateCache.put('tpl_left.html', require('templates/layout_template/tpl_left.html'))
    $templateCache.put('tpl_right.html', require('templates/layout_template/tpl_right.html'))
    $templateCache.put('tpl_one.html', require('templates/layout_template/tpl_one.html'))
    $templateCache.put('tpl_small.html', require('templates/layout_template/tpl_small.html'))
    $templateCache.put('tpl_oneouter.html', require('templates/layout_template/tpl_oneouter.html'))
    $templateCache.put('loading.html', require('templates/loading.html'))

}])

app.directive('popup', ['$compile', popup])

app.directive('d3Vitality', require('ngVitality'))

app.directive('d3Radar', require('ngRadar'))

app.directive('d3Geomap', require('ngGeomap'))

app.directive('d3Inactive', require('ngInactive'))

app.directive('d3Heat', require('ngHeat'))

app.directive('d3Radial', require('ngRadial'))

app.directive('d3Cobar', ['interfaces', require('ngCobar')])

app.directive('d3DotMatrix', require('ngDotMatrix'))

app.directive('d3Score', require('ngScore'))

app.directive('d3Study', require('ngStudyWord'))

app.directive('d3Discuss', require('ngDiscuss'))

app.directive('d3MultiChart', require('ngMultiChart'))

ngIndexSchedule(app)
require('ngIndexVitality')(app)

app.directive('initDataLoading', ['$compile', 'ajax', '$rootScope', 'interfaces', '$templateCache', '$q', function($compile, ajax, $rootScope, interfaces, $templateCache, $q) {
    return {
        restrict: 'EA',
        scope: {},
        link: {
            post: function($scope, ele, attr, ctrl) {
                $scope.staticDir = interfaces.staticDir
                if (!attr.initDataLoadingNot) {
                    ele.html($templateCache.get('loading.html'))
                }

                var urlArr = attr.initDataLoading.split(',')
                var storageArr = attr.initDataLoadingStorage.split(',')
                var promiseArr = []
                urlArr.forEach(function(val) {
                    promiseArr.push(ajax({
                        url: val
                    }))
                })

                $q.all(promiseArr).then(function(responseArr) {
                    storageArr.forEach(function(val, i) {
                        $scope[val] = responseArr[i].data
                    })
                    var html = $compile($templateCache.get(attr.initDataLoadingTpl))($scope)
                    ele.html(html)
                }, function(XHR) {
                    console.error(XHR)
                    $scope.$destroy()
                })

            }
        }
    }
}])

app.directive('indexHabit', ['habitTop3', function(habitTop3) {
    return {
        link: {
            pre: function($scope) {
                if ($scope.d3Heat && $scope.d3Heat.study && $scope.d3Heat.study.length) {
                    $scope.hotspot = habitTop3($scope.d3Heat.study)
                }
            },
            post: function() {}
        }
    }
}])

app.directive('indexAssistant', function() {
    return {
        link: function($scope) {

            // 如果有数据
            if ($scope.fetch.assistants_reply && $scope.fetch.assistants_reply.length) {


                $scope.fetch.assistants_reply = $scope.fetch.assistants_reply.sort(function(a, b) {
                    return b.children[1].value - a.children[1].value
                })

                $scope.assistant = $scope.fetch

                $scope.renderData = $scope.fetch.assistants_reply.slice(0, 4)

                // 用于计算百分百
                $scope.baseNum = $scope.renderData[0].children[1].value

                $scope.paginationSeveral = Math.ceil($scope.fetch.assistants_reply.length / 4)


                $scope.refresh = function(event) {
                    var $t = $(event.target)
                    $t.addClass('active').siblings().removeClass('active')
                    var start = $t.index() * 4
                    $scope.renderData = $scope.fetch.assistants_reply.slice(start, start + 4)
                }
            }

        }
    }
})

app.directive('indexHeader', ['$rootScope', function($rootScope) {
    return {
        link: {
            pre: function($scope) {
                $scope.header = $.extend({},
                    $scope.indexCourseProcess, $scope.indexCourseActivityRate,
                    $scope.indexCourseRegisterScale, $scope.indexCourseCommunityStat)

                $scope.courseName = $scope.header.course.name

                // course progress bar
                $scope.courseProgress = $scope.header.course.status
                    // title
                $rootScope.title = '数据展示｜' + $scope.courseName + '｜xuetangX Studio'

                // popup 跳转链接
                $scope.settings = $('body').data('setting')
                $scope.outline = $('body').data('outline')
            }
        }
    }
}])

app.directive('indexDownload', [function() {
    return {
        link: function($scope, $element, attr) {
            //$scope.courseID = $scope.indexDiscuss["course"]["id"];
            function setKeyValue(data) {
                //console.log(data);
                if (typeof data == "string") {
                    data = {}
                    data["itemdata"] = {}
                    return
                }
                var itemdata = data.data
                data["itemdata"] = {}
                for (var i = 0; i < itemdata.length; i++) {
                    var item = itemdata[i]
                    item["disabledClass"] = item["disabled"] ? "disabled" : "enabled"
                    item["download_url"] = item["disabled"] ? "" : item["download_url"]
                        //itemdata[i]["download_url"] = itemdata[i]["download_url"]?itemdata[i]["download_url"]+$scope.courseID+"/"+itemdata[i]["itemname"]:"";
                    data["itemdata"][itemdata[i]["itemname"]] = item
                }
            }
            $("a", $element).on("click", function(e) {
                    if ($(this).attr("href") == "") {
                        e.preventDefault()
                    }
                })
                //setKeyValue($scope.blackboardData);
            setKeyValue($scope.studentData)
                //setKeyValue($scope.scoreData);
                //setKeyValue($scope.lessonData);
                //$scope.blackboard = $scope.blackboardData["itemdata"];
            $scope.lesson = $scope.studentData["itemdata"]
        }
    }
}])

app.directive('indexInteractmode', ["interfaces", function(interfaces) {
    return {
        link: function($scope, $element, attr) {
            $('.ui.dropdown', $element).dropdown()
                //生成发言图
                //console.debug($scope.indexPostStatistics.data);
            var postStatistics_data = $scope.indexPostStatistics.data

            var barColors = ["#009DE6", "#0AA976", "#D2F47E", "#F37469", "#909090"]
            var groupIDs = []
            var groupNames = []
            $scope.groupColors = {}

            for (var i = 0; i < postStatistics_data.length; i++) {
                groupIDs.push(postStatistics_data[i]["group_id"])
                $scope.groupColors[postStatistics_data[i]["group_id"]] = barColors[i]
                groupNames.push(postStatistics_data[i]["group_name"])
            }


            var speakBar = xuetangX_chart.SpeakBar.create(postStatistics_data, {
                width: 215,
                height: 100,
                x_start: 110,
                x_key1: "post_num",
                x_key2: "comment_num",
                y_key: "group_name",
                tickPadding: 10,
                container: $("#leftChart", $element)[0],
                colors: barColors,
                margin: {
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0
                },
                onMouseOver: function(d, i, event) {
                    var html = "<div class='interactMode_tooltip'><h3 class='tip_title'>{group_name}</h3><p  class='count'>" +
                        "<span class='g_num'>{count}</span>人</p><p class='post_num'>总发贴量：<span class='g_num'>{post_num}</span></p>" + "<p class='comment_num'>总回帖量：<span class='g_num'>{comment_num}</span></p></div>"
                    html = xuetangX_chart.base.format(html, d)
                    nvToolTip(html)
                },
                onMouseLeave: function(d, i, event) {
                    nvToolTip.removeToolTip()
                }
            })

            var data_post_statistics_daily = $scope.indexPostStatisticsDaily.data
                //console.debug(data_post_statistics_daily);
            data_post_statistics_daily.sort(function(d1, d2) {
                    return d1["date"] > d2["date"] ? 1 : -1 //升序排列
                })
                //console.log(data_post_statistics_daily);

            var data_Area = []
            var item = {}
            for (var i = 0; i < data_post_statistics_daily.length; i++) {
                var d = data_post_statistics_daily[i]
                if (item['date'] != d["date"]) {
                    // delete item;
                    item = {}
                    item['date'] = d["date"]
                    item['post_num_' + d["group_id"]] = d["post_num"]
                    item['comment_num_' + d["group_id"]] = -d["comment_num"]
                    data_Area.push(item)
                } else {
                    item['post_num_' + d["group_id"]] = d["post_num"]
                    item['comment_num_' + d["group_id"]] = -d["comment_num"]
                }

            }
            //计算昨天的发贴数、回帖数、以及前一天的发帖、回帖数
            var nowDate = new Date()
            var yesterday = new Date(nowDate.valueOf() - 1 * 24 * 60 * 60 * 1000)
            var beforeDay = new Date(nowDate.valueOf() - 2 * 24 * 60 * 60 * 1000)
            yesterday = xuetangX_chart.base.formatDate("yyyy-MM-dd", yesterday)
            beforeDay = xuetangX_chart.base.formatDate("yyyy-MM-dd", beforeDay)

            //如有有数据，则取数据的最后一天
            if (data_Area.length > 0) {
                yesterday = data_Area[data_Area.length - 1]["date"]
                var str = yesterday.replace(/-/g, "/")
                var date = new Date(str)
                beforeDay = new Date(date.valueOf() - 1 * 24 * 60 * 60 * 1000)
                beforeDay = xuetangX_chart.base.formatDate("yyyy-MM-dd", beforeDay)
            }

            //console.log(yesterday);
            var yesterday_data, beforeDay_data
            for (var i = data_Area.length - 1; i >= 0; i--) {
                if (data_Area[i]["date"] == yesterday) {
                    yesterday_data = data_Area[i]
                } else if (data_Area[i]["date"] == beforeDay) {
                    beforeDay_data = data_Area[i]
                } else if (data_Area[i]["date"] < beforeDay) {
                    break
                }
            }

            function getSpeakCount(d) {
                var postCount = 0,
                    commentCount = 0
                for (var i = 0; i < groupIDs.length; i++) {
                    postCount += d['post_num_' + groupIDs[i]]
                    commentCount += Math.abs(d['comment_num_' + groupIDs[i]])
                }
                return [postCount, commentCount]
            }
            if (yesterday_data) {
                var returnData = getSpeakCount(yesterday_data)
                $scope.yesterday_postCount = returnData[0] // 昨日发帖数
                $scope.yesterday_commentCount = returnData[1] // 昨日回帖数
            }

            function toPercent(num) {
                return (Math.round(num * 10000) / 100).toFixed(2) + '%'
            }
            if (yesterday_data && beforeDay_data) {
                var returnData = getSpeakCount(beforeDay_data)
                if (returnData[0] > 0) {
                    $scope.postCountRatio = ($scope.yesterday_postCount - returnData[0]) / returnData[0]
                    $scope.postCountRatio_percent = toPercent($scope.postCountRatio)
                }
                if (returnData[1] > 0) {
                    $scope.commentCountRatio = ($scope.yesterday_commentCount - returnData[1]) / returnData[1]
                    $scope.commentCountRatio_percent = toPercent($scope.commentCountRatio)
                }

            }

            // 计算昨日零回复帖子数量及其环比
            var noCommentPost_data = $scope.indexNoCommentPostsEveryday.data
            noCommentPost_data.sort(function(d1, d2) {
                return d1['date'] > d2['date'] ? 1 : -1 // 升序排列
            })
            var yesterday_data_noComment, beforeDay_date_noComment
            for (var i = noCommentPost_data.length - 1; i >= 0; i--) {
                if (noCommentPost_data[i]['date'] == yesterday) {
                    yesterday_data_noComment = noCommentPost_data[i]
                    $scope.yesterdayCount_noComment = yesterday_data_noComment['num']
                } else if (noCommentPost_data[i]['date'] == beforeDay) {
                    beforeDay_date_noComment = noCommentPost_data[i]
                } else if (noCommentPost_data[i]['date'] < beforeDay) {
                    break
                }
            }
            if (yesterday_data_noComment && beforeDay_date_noComment) {
                if (beforeDay_date_noComment['num'] > 0) {
                    $scope.noCommentRatio = (yesterday_data_noComment['num'] - beforeDay_date_noComment['num']) / beforeDay_date_noComment["num"]
                    $scope.noCommentRatio_percent = toPercent($scope.noCommentRatio)
                }
            }



            var colors = {},
                seriesName = [],
                seriesName2 = []
            for (var i = 0; i < groupIDs.length; i++) {
                colors['post_num_' + groupIDs[i]] = barColors[i]
                colors['comment_num_' + groupIDs[i]] = barColors[i]
                seriesName.push('post_num_' + groupIDs[i])
                seriesName2.push('comment_num_' + groupIDs[i])
            }

            var multiArea = xuetangX_chart.StackArea.create(data_Area, {
                width: 498,
                height: 100,
                container: $('#chart', $element)[0],
                colors: colors,
                NegativeOpacity: 0.5,
                seriesName: seriesName,
                seriesName2: seriesName2,
                margin: {
                    left: 10,
                    right: 0,
                    top: 0,
                    bottom: 0
                },
                onHideBarmouseOver: function(d, event, domNode) {
                    d3.select(domNode).attr('opacity', 0.5)
                    var date = d['date']
                    var sFormatDate = xuetangX_chart.base.formatDate('yyyy.MM.dd', date)
                    var weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']

                    var sDay = date.getDay()
                    var html_p_post = '',
                        html_p_comment = '',
                        postCount = 0,
                        commentCount = 0
                    for (var i = 0; i < groupIDs.length; i++) {
                        html_p_post += "<p class='tip_item'>" + groupNames[i] + "：" + d["post_num_" + groupIDs[i]] + "</p>"
                        postCount += d["post_num_" + groupIDs[i]]
                        html_p_comment += "<p class='tip_item'>" + groupNames[i] + "：" + Math.abs(d["comment_num_" + groupIDs[i]]) + "</p>"
                        commentCount += Math.abs(d["comment_num_" + groupIDs[i]])
                    }

                    var html = "<div class='interactMode_tooltip' style='opacity: 0.9;'><h3 class='tip_title'>" + sFormatDate + "  " + weekDays[sDay] + "</h3>" +
                        "<p class='split'></p><p class='tip_title padBottom2'>新增发帖量</p><p class='g_num count'>" + postCount + "</p>" + html_p_post +
                        "<p class='split'></p><p class='tip_title padBottom2'>新增回帖量</p><p class='g_num count'>" + commentCount + "</p>" + html_p_comment;
                    "</div>"
                    nvToolTip(html, {
                        'origin': 'left',
                        'style': 'background-color: rgba(255,255,255,1);'
                    })
                },
                onHideBarmouseLeave: function(d, event, domNode) {
                    d3.select(domNode).attr('opacity', 0)
                    nvToolTip.removeToolTip()
                }
            })

            // 计算排行榜最大值
            if ($scope.indexCommentRank.data.length > 0) {
                $scope.top5_comment_max = $scope.indexCommentRank.data[0]['total'] + $scope.indexCommentRank.data[0]['count']

            }
            if ($scope.indexPostRank.data.length > 0) {
                $scope.top5_post_max = $scope.indexPostRank.data[0]['total'] + $scope.indexPostRank.data[0]['count']
            }
            var staticDir = interfaces.staticDir

            // 关联图
            if ((!$scope.indexStudentPost.data) || (!$scope.indexPostRelation.data)) {
                return
            }
            if (($scope.indexStudentPost.data.length <= 0) || ($scope.indexPostRelation.data.length <= 0)) {
                return
            }

            // 排序
            $scope.indexStudentPost.data.sort(function(d1, d2) {
                var iResult = d1['group_id'] > d2['group_id'] ? -1 : 1
                if (d1['group_id'] === d2['group_id']) {
                    iResult = Math.max(d1['post_num'], d1['comment_num']) >
                        Math.max(d2['post_num'], d2['comment_num']) ? -1 : 1
                }
                return iResult
            })

            var data = {
                'username': '',
                children: $scope.indexStudentPost.data
            }
            var links = $scope.indexPostRelation.data

            if (links.length > 0) {
                var relationChart = xuetangX_chart.relationChart.create(data, links, {
                    container: $("#relationChart", $element)[0],
                    width: 490,
                    height: 500,
                    showText: false,
                    margin: {
                        left: 30,
                        right: 30,
                        top: 30,
                        bottom: 30
                    },
                    groups: $scope.groupColors,
                    links_key: {
                        source: 'student1',
                        target: 'student2',
                        value: 'num'
                    },
                    linkWidthMax: 1,
                    linkDistance: 2,
                    linkCharge: -2,
                    tension: 0.87,
                    IndexKey: 'uid',
                    valueKey: 'post_num',
                    group_Key: 'group_id',
                    disc_key: 'comment_num', // 实心关键字、回帖数量
                    circle_key: 'post_num', // 空心圆关键字、发言数量
                    onMouseOver: function(d, event) {
                        d.avatar = d.avatar ? d.avatar : staticDir + '/icon/avatar.png'
                        var html = "<div class='interactMode_tooltip'><p><image class='img_avatar' src='{avatar}'></image>" +
                            "<span class='username'>{username}</span></p><p class='relation_item paddingTop5'>总发帖数：{post_num}</p><p class='relation_item'>总回帖数：{comment_num}</p>" +
                            "<p class='split'></p><p class='relation_item'>当前答题得分（率）：{grade_percent}</p></div>"
                        html = xuetangX_chart.base.format(html, d)
                        nvToolTip(html, {
                            'showAngle': true,
                            'offsetLeft': 125,
                            'event': event
                        })
                    },
                    onMouseLeave: function() {
                        nvToolTip.removeToolTip()
                    },
                    onLineMouseOver: function(d, i, event) {
                        var linkData = {}
                        if (d[2]) {
                            linkData['username1'] = d[0]['username']
                            linkData['username2'] = d[2]['username']
                            linkData['num'] = this._link_bundle[i]['value']
                        } else {
                            linkData['username1'] = d['source']['username']
                            linkData['username2'] = d['target']['username']
                            linkData['num'] = d['value']
                        }

                        var html = "<div class='interactMode_tooltip'><p><span class='username'>{username1}</span>" +
                            "<->{username2} 回帖数：{num}</p></div>"
                        html = xuetangX_chart.base.format(html, linkData)
                        nvToolTip(html, {
                            'showAngle': true,
                            'offsetLeft': 125,
                            'event': event
                        })
                    },
                    onLineMouseLeave: function(d, event) {
                        nvToolTip.removeToolTip()
                    }
                })

            }

            setTimeout(function() {
                // 初始化完毕，默认选项
                $('.selection', $element).dropdown('set selected', 'answerMode')
                $('.selection', $element).dropdown({
                    onChange: function(value, text, $selectedItem) {
                        if (relationChart) {
                            relationChart.update()
                        }
                    }
                })
            }, 1000)
                // $(".switchMode",$element).on("change",function(){
                //	//console.debug($(this).val());
                //	if (relationChart){
                //		relationChart.update();
                //	}
                // });
        }
    }
}])

var ngIndexDifficultAny = require('ngIndexDifficultAny')
ngIndexDifficultAny(app)

app.directive('indexForecast', require('ngIndexForecast'))

app.directive('indexHealth', ['interfaces', function(interfaces) {
    return {
        link: {
            pre: function($scope, $element, attr) {
                $scope.d3Radar = $.extend({},
                    $scope.indexCourseProcess, $scope.indexCourseActivityRate,
                    $scope.indexCourseRegisterScale, $scope.indexCourseCommunityStat)
            }
        }
    }
}])

require('bootstrap-table')
require('bootstrap-table-fixedheader-page')
app.directive('bootstrapTable', [function() {
    return {
        restrict: 'EA',
        template: '<table class="bootstrap-table"></table>',
        replace: true,
        link: function($scope, $table, attr) {
            buildTable($table, 10, 20)

            function buildTable($el, cells, rows) {
                var i, j, row,
                    columns = [],
                    data = []

                for (i = 0; i < cells; i++) {
                    columns.push({
                        field: 'field' + i,
                        title: 'Cell' + i,
                        sortable: true
                    })
                }
                columns.unshift({
                    checkbox: true
                })
                for (i = 0; i < rows; i++) {
                    row = {}
                    for (j = 0; j < cells; j++) {
                        row['field' + j] = 'Row-' + i + '-' + j
                    }
                    data.push(row)
                }
                $el.bootstrapTable('destroy').bootstrapTable({
                    columns: columns,
                    data: data,
                    search: true,
                    pagination: true,
                    clickToSelect: true,
                    // showHeader:false,
                    toolbar: '.toolbar',
                    fixedHeaderToPage: true // 页面滚动时固定表头
                })
            }
        }
    }
}])
