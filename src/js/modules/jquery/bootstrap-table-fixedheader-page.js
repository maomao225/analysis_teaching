/**
 * Created by yanguoxu on 15/11/10.
 * 主要功能：
 * 页面滚动到表格顶端时，表格头部跟随页面滚动，页面回到上部时，表格头部返回原来位置
 * 翻页时，返回原来位置
 */
(function($) {
    'use strict'
    $.extend($.fn.bootstrapTable.defaults, {
        fixedHeaderToPage: false
    })

    var BootstrapTable = $.fn.bootstrapTable.Constructor,
        _initHeader = BootstrapTable.prototype.initHeader,
        _initBody = BootstrapTable.prototype.initBody

    var initTop = -1
    BootstrapTable.prototype.initHeader = function() {

        if (this.options.fixedHeaderToPage) {
            if (!this.options.height) {
                this.options.height = 'auto'
            }
            var that = this
            var footerTop = -1,
                iLeft

            if (!this.isBindWindowScroll) {
                $(window).scroll(function(e) {
                    // 判断滚动条位置，自身位置
                    var scrollTop = $(window).scrollTop()
                    if (initTop < 0) {
                        initTop = that.$tableHeader.offset().top
                        iLeft = that.$tableHeader.offset().left
                    }
                    footerTop = initTop + that.$container[0].offsetHeight - that.$tableHeader[0].offsetHeight * 2


                    if ((scrollTop >= initTop) && (scrollTop <= footerTop)) {
                        that.$tableHeader.addClass("fixedPage-table-header")
                        that.$tableHeader.css("left", iLeft)

                    } else {
                        that.$tableHeader.removeClass("fixedPage-table-header")
                        that.$tableHeader.css("left", "auto")
                    }
                })
            }
            this.isBindWindowScroll = true
        }

        this.isBindWidowResize = true
        _initHeader.apply(this)
    }

    BootstrapTable.prototype.initBody = function(fixedScroll) {
        _initBody.apply(this, [fixedScroll])
        if (this.options.fixedHeaderToPage) {
            setTimeout(function() {
                if (initTop > 0) {
                    $(window).scrollTop(initTop - 10)
                }

            }, 200)
        }
    }

})(jQuery)
