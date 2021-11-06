/**
 * 让我帮你百度一下【重制版】
 * GitHub 开源地址：https://github.com/mengkunsoft/lmbtfy
 **
 * 原始版本来自 bangbang(http://lmbtfy.cn/)，mengkun(https://mkblog.cn) 在原作的基础上进行了重制，风格变更为新版百度 UI，并适配了移动端
 * 交互效果参考了 不会百度么？(http://buhuibaidu.me/)
 **
 * 转载或使用时，还请保留以上信息，谢谢！
 */ 

/* 低版本 IE polyfill */ 
if(!window.location.origin) {
    window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port: '');
}

/* 扩展一个getUrlParam的方法 */
$.getUrlParam = function(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r !== null) return unescape(r[2]); return null;
};

$(function() {
    var $kw = $('#kw'),
        $searchSubmit = $('#search-submit'),
        $urlOutput = $('#url-output'),
        $tips = $('#tips'),
        $stop = $('#stop'),
        $arrow = $('#arrow');
    
    var stepTimeout, typeInterval;
    
    /* 获取并解析查询参数。参数加 Base64 编码是防止别人直接从链接中猜出了结果，而拒绝点击 */ 
    var query = $.getUrlParam('q');
    if(!!query) {
        try {
            query = Base64.decode(query);
        } catch(e) {
            console.log(e);
        }
    }
    
    /* 有参数，启动百度教程 */
    if(!!query) {
        $tips.html('让我来教你正确的打开方式');
        $stop.fadeIn();
        
        stepTimeout = setTimeout(function() {
            $tips.html('1、找到输入框并选中');
            
            $arrow.removeClass('active').show().animate({
                left: $kw.offset().left + 20 + 'px',
                top: ($kw.offset().top + $kw.outerHeight() / 2) + 'px'
            }, 2000, function () {
                $tips.html('2、输入你要找的内容');
                $arrow.addClass('active');
                
                stepTimeout = setTimeout(function() {
                    $arrow.fadeOut();
                    
                    var i = 0;
                    typeInterval = setInterval(function () {
                        $kw.val(query.substr(0, i));
                        if (++i > query.length) {
                            clearInterval(typeInterval);
                            $tips.html('3、点击下“百度一下”按钮');
                            
                            $arrow.removeClass('active').fadeIn().animate({
                                left: $searchSubmit.offset().left + $searchSubmit.width()  / 2 + 'px',
                                top:  $searchSubmit.offset().top  + $searchSubmit.height() / 2 + 'px'
                            }, 1000, function () {
                                $tips.html('<strong>还不会就被你整无语辣😅</strong>');
                                $arrow.addClass('active');
                                
                                stepTimeout = setTimeout(function () {
                                    window.location = 'https://www.baidu.com/s?ie=utf-8&wd=' + encodeURIComponent(query);
                                }, 10);
                            });
                        }
                    }, 200);
                }, 500);
            });
        }, 1000);
    }
    
    /* 提交 */
    $('#search-form').submit(function() {
        if(!!query) return false;
        
        var question = $.trim($kw.val());
        if(!question) {
            $tips.html('<span style="color: red">搜了个寂寞？</span>');
            $kw.val('');
        } else {
            $tips.html('↓↓↓ 复制下面的链接，教伸手党使用百度');
            $('#output').fadeIn();
            $urlOutput.val(window.location.origin + window.location.pathname + '?q=' + Base64.encode(question)).focus().select();
        }
        return false;
    });
    
    /* 复制结果 */ 
    var clipboard = new ClipboardJS('[data-clipboard-target]');
    clipboard.on('success', function(e) {
        $tips.html('<span style="color: #4caf50">复制成功！赶紧把链接甩给伸手党们！</span>');
    });
    clipboard.on('error', function(e) {
        $tips.html('<span style="color: red">复制失败，请手动复制...</span>');
    });
    
    /* 预览 */ 
    $('#preview').click(function() {
        var link = $urlOutput.val();
        if (!!link) {
            window.open(link);
        }
    });
});
