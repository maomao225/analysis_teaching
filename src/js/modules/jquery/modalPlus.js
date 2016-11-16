var $ = require('jquery')
    // modal 创建前触发
    // $doc.on('modal.create', function(event, $modal) {
    // 	if ($($modal).hasClass('div')) {
    // 	}
    // })

// modal 创建后触发
// $doc.on('modal.created', function(event, $modal) {})

// modal 移除前触发
// $doc.on('modal.remove', function(event, $modal) {})

// modal 移除后触发
// $doc.on('modal.removed', function(event, $modal) {})

// modal btn点击事件
// $modal.on('modal.btn0.click', function(event, $btn) {})

// 高大上浏览器肯定支持。
$.support.transition = true

var $doc = $(document)
var $win = $(window)
var $body = $('body')
var $backupCss = $body.css('overflow')

$.modalPlus = function(option) {

    // 如果传入的不是json，就remove对话框
    if (!$.isPlainObject(option)) {

        var $modal = $('#g_modal').addClass('g_modal_remove')

        if ($.support.transition) {
            $modal.on('bsTransitionEnd', function() {
                $doc.trigger('modal.remove', $modal)
                $modal.remove()
                $doc.trigger('modal.removed', $modal)
            })
        } else {
            $doc.trigger('modal.remove', $modal)
            $modal.remove()
            $doc.trigger('modal.removed', $modal)
        }

        return false
    }

    // 主参数
    var opt = $.extend({
        title: '',
        HTML: '',

        type: 'normal', // normal=>正常, confirm=>确认， alert=>提示， hint=> 自动消失的提示
        color: 'purple', // purple, red, green
        btns: {}, // {color: red, text: '确定'} 多个按钮用数组
        minHeight: 100, // 最小高度
        hasCloseBtn: true,
        zIndex: 151, // 默认zIndex
        className: '' // 会加在最外层的div上，供自定义样式
    }, option || {})


    if (opt.type === 'confirm') {
        opt.title = '提示信息'
        opt.btns = [{
            color: '',
            text: '取消'
        }, {
            color: 'purple',
            text: '确定'
        }]
        opt.HTML = '<div class="g_modal_plus_alert_text">' + opt.HTML + '</div>'
    } else if (opt.type === 'alert') {
        opt.title = '提示信息'
        opt.btns = [{
            color: 'purple',
            text: '确定'
        }]
        opt.HTML = '<div class="g_modal_plus_alert_text">' + opt.HTML + '</div>'
    } else if (opt.type === 'hint') {
        if ($('#g_modal_hint').length) {
            return false
        }
        var hintHTML = '<div class="g_modal_hint" id="g_modal_hint">' + opt.HTML + '</div>'

        var $hint = $(hintHTML).appendTo('body')

        setTimeout(function() {
            $hint.stop().animate({
                opacity: 0

            }, 1500, function() {
                $hint.remove()
            })
        }, 1500)


        return $hint
    }

    // 主HTML代码
    if (!$.isArray(opt.btns)) {
        opt.btns = [opt.btns]
    }

    var HTMLBtn = ''

    if (opt.btns[0].text) {
        HTMLBtn += '<div class="g_modal_plus_btns_wrap">'

        for (var i = 0, l = opt.btns.length; i < l; i++) {

            HTMLBtn += '<div class="ui button ' + opt.btns[i].color + '">' + opt.btns[i].text + '</div>'
        }
        HTMLBtn += '</div>'
    }

    var HTMLCloseBtn = ''

    if (opt.hasCloseBtn) {
        HTMLCloseBtn = '<div class="g_modal_closeBtn" title="关闭"></div>'
    }

    var HTML = '<div class="g_modal g_modal_plus ' + opt.className + '" id="g_modal" style="z-index: ' + opt.zIndex + '">' +
        '<div class="g_modal_cell">' +
        '<div class="g_modal_wrap ' + 'g_modal_plus_' + opt.color + '">' +
        '<div class="g_modal_plus_title"><span class="anti_sawtooth"></span>' + opt.title + '</div>' +
        '<div>' + opt.HTML + '</div>' +
        '<div class="g_modal_plus_btns">' + HTMLBtn + '</div>' +
        HTMLCloseBtn +
        '</div>' +
        '</div>' +
        '</div>'

    var $modal = $(HTML)

    // 屏幕大于最小高度的自定义事件
    $modal.on('taller', function() {
        $modal.removeClass('g_modal_scroll')
        $modal.height('100%')
    })

    // 屏幕小于最小高度的自定义事件
    $modal.on('untaller', function() {
        var $modalWrap = $modal.find('.g_modal_wrap')
        $modal.addClass('g_modal_scroll').height($win.height()).find('.g_modal_cell').add($modalWrap).css({
            'min-height': opt.minHeight + 'px'
        })
    })

    // 触发自定义事件的事件
    $modal.on('changeStatus', function() {
        if (parseInt($win.height()) >= opt.minHeight) {
            $modal.trigger("taller")
        } else {
            $modal.trigger("untaller")
        }
    })

    // 触发一次自定义事件的事件
    $modal.trigger("changeStatus")

    // 当浏览器大小改变时再次触发
    $win.on('resize', function() {
        $modal.trigger("changeStatus")
    })

    // 触发模态框创建前的回调
    $doc.trigger("modal.create", $modal)

    $modal.appendTo("body")

    // 触发模态框创建成功的回调
    $doc.trigger("modal.created", $modal)

    var $closeBtn = $modal.find(".g_modal_closeBtn")
    var $wrap = $modal.find(".g_modal_wrap")

    // 关闭按钮事件
    $closeBtn.on('click', function(event) {
        event.stopPropagation()
        $.modalPlus()
    })

    // 点击遮罩层， 关闭modal
    // $modal.on("click", function() {
    // 	$.modalPlus();
    // });

    // 点击内容区域 不关闭modal
    // $wrap.on("click", function() {
    // 	event.stopPropagation();
    // });


    // 按钮点击事件
    var $btns = $modal.find('.g_modal_plus_btns_wrap').eq(0).find('.button')
    if ($btns.length) {
        $btns.on('click', function() {
            $modal.trigger('modal.btn' + $(this).index() + '.click', $(this))
        })
    }

    // modal为 confirm或alert时，点击取消按钮时的事件
    if (opt.type === 'confirm' || opt.type === 'alert') {
        $modal.on('modal.btn0.click', function() {

            $.modalPlus()

        })
    }

    return $modal
}

$doc.on('modal.created', function() {
    $body.css({
        overflow: 'hidden'
    })
})

$doc.on('modal.removed', function() {
    $body.css({
        overflow: $backupCss
    })
})

module.exports = function() {
    return function(option) {
        return $.modalPlus(option)
    }
}
