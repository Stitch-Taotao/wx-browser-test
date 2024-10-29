<script setup>
import HelloWorld from './components/HelloWorld.vue'
import TheWelcome from './components/TheWelcome.vue'
import { computed, onMounted, ref, getCurrentInstance } from 'vue'

const launchBtn = ref(null)

const { proxy } = getCurrentInstance();

onMounted(() => {
  async function init() {

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
    // let ticket = "sM4AOVdWfPE4DxkXGEs8VMSTVo7Rx3gPA1QdkpjQIXTYm2chgXdWYDHbpKYq13tbHsnMKtD2TtKi7kXk_gCN1Q"
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
      wxConfigOk.value = true;
      // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中
      console.log("config 成功");
      // alert("wx.ready");
    });
    wx.error(function (res) {
      wxConfigOk.value = false;
      // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名
      console.log("config 失败");
      // alert("wx.error");
    });
    // function ready() {
    //   console.log("ready" + appid + extinfo);
    // }
    // function launch(event) {
    //   // alert("launch+event:" + JSON.stringify(event));

    // }
    // function error(errMsg) {
    //   let msg = "errMsg-details:" + JSON.stringify(errMsg.detail) + '\n'
    //   // alert("error:" + msg);
    //   console.log(msg);
    // }
    // // var btn = window.document.getElementById('launch-btn');
    // var btn = proxy.$refs.launchBtn;
    // console.log("btn:" + btn);
    // btn.addEventListener('launch', launch);
    // btn.addEventListener('error', error);

  }



  //判断浏览器类型

  var userAgent = navigator.userAgent.toLowerCase();
  var isIOS = /(iPhone|iPad|iPod)/i.test(userAgent);
  var isAndroid = /Android/i.test(userAgent);
  // 判断是否为微信浏览器
  const isWechat = /micromessenger/i.test(userAgent);
  currentAppEnv.value = isWechat ? MTApplication.WX : MTApplication.Other;
  if (isWechat) {
    console.log("isWechat:" + isWechat);
    init();
  }
  // init();
  // 其他浏览器则尝试
  if (isIOS) {
    currentPlatform.value = MTPlatform.iOS
  } else if (isAndroid) {
    currentPlatform.value = MTPlatform.Android
  } else {
    currentPlatform.value = MTPlatform.Other
  }
  afterCheckEnv.value = true;
  function wxready() {
    console.log("ready" + appid + extinfo);
  }
  function wxlaunch(event) {
    // alert("launch+event:" + JSON.stringify(event));

  }
  function wxerror(errMsg) {
    let msg = "errMsg-details:" + JSON.stringify(errMsg.detail) + '\n'
    // alert("error:" + msg);
    console.log(msg);
    // 假设点击按钮launch 失败的话，就调用跳转下载页面逻辑
    androidCanNotUseWxCapability();
  }

})
// Android平台跳转
function androidCanNotUseWxCapability() {
  // 呼起APP，不一定能成功打开跳转
  //alert("触发app呼起！");
  window.location.href = 'letpub://keke.com.cn/open';
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
// 响应式状态
const count = ref(0)

// 用来修改状态、触发更新的函数
function increment() {
  count.value++
}

var wxConfigOk = ref(null)
var afterCheckEnv = ref(false)

const MTPlatform = {
  iOS: Symbol('iOS'),
  Android: Symbol('Android'),
  Other: Symbol('Other'),
}
var currentPlatform = ref(MTPlatform.Other)
const MTApplication = {
  WX: Symbol('WX'),
  Other: Symbol('Other'),
}
var currentAppEnv = ref(MTApplication.Other)
// TODO 考虑检测应用是否安装成功。
// 如果微信配置成功，显示按钮（不需要任何处理）
const showAndroidWxButton = computed(() => {
  let show = afterCheckEnv.value && currentPlatform.value == MTPlatform.Android && currentAppEnv.value == MTApplication.WX && wxConfigOk.value
  return show
})
// 如果微信配置失败，显示按钮，点击跳转到下载App网页
const showAndroidWxConfigErrorButton = computed(() => {
  let show = afterCheckEnv.value && currentPlatform.value == MTPlatform.Android && currentAppEnv.value == MTApplication.WX && wxConfigOk.value==false
})
// Android其他平台（非微信平台）
const showAndroidOtherEnvButton = computed(() => {
  return afterCheckEnv.value && currentPlatform.value == MTPlatform.Android && currentAppEnv.value == MTApplication.Other
})
// 所有的ios都配置成这个
const showIosWxButton = computed(() => {
  return afterCheckEnv.value && currentPlatform.value == MTPlatform.iOS
})
</script>

<template>
  <wx-open-launch-app v-if="showAndroidWxButton" ref="launchBtn" @launch="wxlaunch" @error="wxerror" id="launch-btn" appid="wxe2f29d15a85badb7"
    extinfo="extinfo">
    <!-- <script type="text/wxtag-template">
      <button class="btn">Android微信配置成功</button>
    </script> -->
    <component :is="'script'" type="text/wxtag-template">
      <button class="btn">Android微信配置成功</button>
    </component>
  </wx-open-launch-app>
  <div>
    <p id="result"></p>
  </div>
  <button v-if="showAndroidWxConfigErrorButton" @click="androidCanNotUseWxCapability" class="btn">Android微信配置失败</button>
  <button v-if="showAndroidOtherEnvButton" @click="androidCanNotUseWxCapability"
    class="btn">Android平台非微信环境</button>
  <button v-if="showIosWxButton" class="btn" @click="iOSOpenApp">iOS打开App</button>
  <button @click="increment">Count is: {{ count }} 点击加1</button>
</template>

<style scoped lang="css">
.btn {
  padding: 12px;
  width: fit-content;
  background-color: #24bfee
}
</style>
