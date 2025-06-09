(function name() {
    var openWxBrowser = window.document.getElementById('testOpenWxH5Btn');
    if (openWxBrowser != null) {
        openWxBrowser.onclick = function () {
            action1()
        }
    }
    console.log(`微信打开浏览器测试按钮:${openWxBrowser}`)
    function action1() {
        let link = "https://www.baidu.com";
        console.log("触发了action，在微信的打开浏览器中打开链接：" + link)
        // window.location.href = `intent://x.com/#Intent;scheme=weixin;package=com.tencent.mm;S.browser_fallback_url=${encodeURIComponent(link)};end`;
        // window.location.href = `weixin://dl/business/webview?url=${encodeURIComponent(link)}`;
        // window.location.href = `intent://www.baidu.com#Intent;scheme=https;category=android.intent.category.BROWSABLE;end`;
        const txOpenLink = 'https://a.app.qq.com/o/simple.jsp?pkgname=com.letpub.keke&android_schema=keke://open&ios_schema=keke://'
        window.location.href = txOpenLink;
    }
})();