// import  "https://cdn.bootcdn.net/ajax/libs/js-sha1/0.6.0/sha1.js"
// import  "https://res.wx.qq.com/open/js/jweixin-1.6.0.js"
(function () {
    const MTPlatform = {
        iOS: Symbol('iOS'),
        Android: Symbol('Android'),
        Other: Symbol('Other'),
    }

    const MTApplication = {
        WX: Symbol('WX'),
        QQ: Symbol('QQ'),
        Other: Symbol('Other'),
    }
    // 当前系统平台
    var currentPlatform = null
    // 当前App环境
    var currentAppEnv = null
    // 如果是 Android - wx 环境，是否配置成功
    var wxConfigOk = null
    var androidCanUseCapability = null
    var iOSDefaultOpenApp = null

    async function wxinit() {

        // 生成当前时间戳（以秒为单位）
        var timestampInSeconds = Math.floor(Date.now() / 1000);

        // 转换时间戳为字符串
        var timestampString = timestampInSeconds.toString();

        console.log("生成的时间戳为：" + timestampString);

        function createNonceStr(length = 16) {
            // 获取随机字符串
            var chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            var str = "";
            for (var i = 0; i < length; i++) {
                str += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            return str;
        }

        // 示例调用
        var nonceStr = createNonceStr();
        console.log("生成的随机字符串为：" + nonceStr);

        let ticketUrl = "https://www.letpub.com.cn/weixin/get_keke_app_data.php?action=get_jsapi_ticket";

        // Default options are marked with *
        const response = await fetch(ticketUrl, {
            method: "GET", // *GET, POST, PUT, DELETE, etc.
            cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        }).then(res => {
            return res.json();
        }).catch(err => {
            console.log("请求ticket失败：" + err);
        });

        let ticket = response["jsapi_ticket"]
        let url = location.href.split('#')[0]

        // alert(location.href)
        let step1Str = "jsapi_ticket=" + ticket + "&noncestr=" + nonceStr + "&timestamp=" + timestampString + "&url=" + url;
        console.log("生成的签名第一步字符串为：" + step1Str);
        // 计算 SHA-1 哈希值
        const signature = sha1(step1Str);
        console.log("生成的签名字符串为：" + signature);
        wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印
            appId: 'wxef464937118176ce', // 必填，公众号的唯一标识
            timestamp: timestampString, // 必填，生成签名的时间戳
            nonceStr: nonceStr, // 必填，生成签名的随机串
            signature: signature,// 必填，签名
            jsApiList: ["onMenuShareAppMessage"], // 必填，需要使用的JS接口列表,没有就随便填一个
            openTagList: ['wx-open-launch-app'] //必填， 要申请的开放标签名称
        })
        wx.ready(function () {
            wxConfigOk = true;
            checkBtnShow();
            // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中
            console.log("config 成功");
            // alert("wx.ready");
        });
        wx.error(function (res) {
            wxConfigOk = false;
            checkBtnShow();
            // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名
            console.log("config 失败");
            // alert("wx.error");
        });


    }

    //判断系统类型
    var userAgent = navigator.userAgent.toLowerCase();
    var isIOS = /(iPhone|iPad|iPod)/i.test(userAgent);
    var isAndroid = /Android/i.test(userAgent);
    if (isIOS) {
        currentPlatform = MTPlatform.iOS
    } else if (isAndroid) {
        currentPlatform = MTPlatform.Android
    } else {
        currentPlatform = MTPlatform.Other
    }
    // 判断是否为微信浏览器
    const isWechat = /micromessenger/i.test(userAgent);
    currentAppEnv = isWechat ? MTApplication.WX : MTApplication.Other;
    const isQQ = /qq/i.test(userAgent);
    if (currentAppEnv === MTApplication.Other && isQQ) {
        currentAppEnv = MTApplication.QQ;
    }
    checkBtnShow();

    if (isWechat) {
        console.log("isWechat:" + isWechat);
        wxinit();
    }

    function wxready(e) {
        console.log("wxready" + JSON.stringify(e.detail));
    }
    function wxlaunch(e) {
        // alert("launch+event:" + JSON.stringify(event));
        console.log("wxlaunch" + JSON.stringify(e.detail));
    }
    function wxerror(errMsg) {
        let msg = "errMsg-details:" + JSON.stringify(errMsg.detail) + '\n'
        // alert("error:" + msg);
        console.log(msg);
        // 假设点击按钮launch 失败的话，就调用跳转下载页面逻辑
        androidCanNotUseWxCapability();
    }

    var wxopenBtn = window.document.getElementById('wxlaunchBtn');
    if (wxopenBtn != null) {
        console.log("wxopenBtn:" + wxopenBtn);
        wxopenBtn.addEventListener('launch', wxlaunch);
        wxopenBtn.addEventListener('error', wxerror);
    }

    // Android平台不用微信开放标签跳转
    function androidCanNotUseWxCapability() {
        console.log("androidCanNotUseWxCapability");
        // 呼起APP，不一定能成功打开跳转
        //alert("触发app呼起！");
        window.location.href = 'keke://open';
        var jumpToAppInH5_timer
        // 3s之后跳转到APP下载页（未安装app的情况）
        if (jumpToAppInH5_timer) clearTimeout(jumpToAppInH5_timer);
        jumpToAppInH5_timer = setTimeout(() => {
            window.location.href = 'https://www.letpub.com.cn/app/keke/index/';
        }, 2000);

        // 跳转app之后禁止再跳转中间页
        document.addEventListener('visibilitychange', () => {
            clearTimeout(jumpToAppInH5_timer);
        });
    }
    // iOS按钮跳转到链接
    function iOSOpenApp() {
        window.location.href = "https://app.letpub.com.cn/app/keke/index/";
    }

    function normalButtonAction() {
        if (iOSDefaultOpenApp) {
            iOSOpenApp()
        } else {
            androidCanNotUseWxCapability()
        }
    }

    function checkBtnShow() {
        if (currentPlatform == MTPlatform.Android) {
            if (currentAppEnv == MTApplication.WX) {
                if (wxConfigOk == true) {
                    androidCanUseCapability = true;
                } else if (wxConfigOk == false) {
                    androidCanUseCapability = false;
                }
            } else {
                androidCanUseCapability = false;
            }
        } else {
            /// 其他情况全部和iOS处理方式一样
            iOSDefaultOpenApp = true;
        }
        console.log("androidCanUseCapability:" + androidCanUseCapability + " iOSDefaultOpenApp:" + iOSDefaultOpenApp);
        /// 控制WX按钮显示
        var wxlaunchBtn = document.getElementById('wxlaunchBtn');
        if (wxlaunchBtn != null) {
            if (androidCanUseCapability == true) {
                buttonShow(wxlaunchBtn)
            } else if (androidCanUseCapability == false) {
                buttonHidden(wxlaunchBtn)
            }
        }
        /// 控制按钮显示
        var normalLaunchBtn = document.getElementById('normalLaunchBtn');
        if (normalLaunchBtn != null) {
            if (androidCanUseCapability == false || iOSDefaultOpenApp) {
                buttonShow(normalLaunchBtn)
            } else if (androidCanUseCapability == true) {
                buttonHidden(normalLaunchBtn)
            }
            normalLaunchBtn.onclick = function () {
                normalButtonAction()
            }
        }
    }

    function buttonShow(btn) {
        if (btn != null) {
            btn.style.display = 'block';	// 隐藏选择的元素
        }
    }
    function buttonHidden(btn) {
        if (btn != null) {
            btn.style.display = 'none';	// 以块级样式显示
        }
    }
}())
