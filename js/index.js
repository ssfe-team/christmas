require(['jquery', 'b', 'wxjsapi'], function($, b, wx) {

  var isWx = false;
  //判断访问终端
  var browser = {
    versions: function () {
      var u = navigator.userAgent;
      return {
        trident: u.indexOf('Trident') > -1, //IE内核
        presto: u.indexOf('Presto') > -1, //opera内核
        webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
        gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1,//火狐内核
        mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
        ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
        android: u.indexOf('Android') > -1 || u.indexOf('Adr') > -1, //android终端
        iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
        iPad: u.indexOf('iPad') > -1, //是否iPad
        webApp: u.indexOf('Safari') == -1, //是否web应该程序，没有头部与底部
        weixin: u.indexOf('MicroMessenger') > -1, //是否微信 （2015-01-22新增）
        qq: u.match(/\sQQ/i) == " qq" //是否QQ
      };
    }()
  }

  if (!(browser.versions.mobile || browser.versions.android || browser.versions.ios)) {
    // pc 端
    $("#pc-warn").css("display","block");
  } else {
    // 移动端
    isWx = browser.versions.weixin
  }
  var wxConfig = {
    debug: false, // 调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
    appId: '', // 必填，公众号的唯一标识
    timestamp: '', // 必填，生成签名的时间戳
    nonceStr: '', // 必填，生成签名的随机串
    signature: '',// 必填，签名，见附录1
    jsApiList: [
      'checkJsApi',
      'onMenuShareTimeline',
      'onMenuShareAppMessage',
      'onMenuShareQQ',
      'onMenuShareWeibo',
      'onMenuShareQZone',
      'hideMenuItems',
      'showMenuItems',
      'hideAllNonBaseMenuItem',
      'showAllNonBaseMenuItem',
      'translateVoice',
      'startRecord',
      'stopRecord',
      'onVoiceRecordEnd',
      'playVoice',
      'onVoicePlayEnd',
      'pauseVoice',
      'stopVoice',
      'uploadVoice',
      'downloadVoice',
      'chooseImage',
      'previewImage',
      'uploadImage',
      'downloadImage',
      'getNetworkType',
      'openLocation',
      'getLocation',
      'hideOptionMenu',
      'showOptionMenu',
      'closeWindow',
      'scanQRCode',
      'chooseWXPay',
      'openProductSpecificView',
      'addCard',
      'chooseCard',
      'openCard'
    ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
  };
  if (isWx) {
    $.ajax({
      url: "/login/getWxFwhJsApiConfig.do",
      dataType: "json",
      type: "GET",
      success: function(data) {
        wxConfig.appId = data.appId;
        wxConfig.timestamp = data.timestamp;
        wxConfig.nonceStr = data.nonceStr;
        wxConfig.signature = data.signature;
        wx.config(wxConfig);
      },
      error: function() {
        console.log("请求config失败");
      }
    });

    //wx.config(wxConfig);
    wx.ready(function(){
      // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，
      // config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。
      // 对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
      wx.checkJsApi({
        jsApiList: ['onMenuShareAppMessage','onMenuShareTimeline'], // 需要检测的JS接口列表，所有JS接口列表见附录2,
        success: function(res) {
          console.log('suc');
          console.log(JSON.stringify(res));
          // 以键值对的形式返回，可用的api值true，不可用为false
          // 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
        }
      });
      // 2.2 监听“分享给朋友”按钮点击、自定义分享内容及分享结果接口
      wx.onMenuShareAppMessage({
        title: '别把圣诞节过成礼拜一',
        desc: '即使没有朋友喧闹，也该给自己一点微笑',
        link: window.location.origin + '/mod/activity/christmas/index.html',
        imgUrl: 'https://imgpub.chuangkit.com/barrageImg/share_1.jpg@100w',
        trigger: function (res) {
          //不要尝试在trigger中使用ajax异步请求修改本次分享的内容，因为客户端分享操作是一个同步操作，这时候使用ajax的回包会还没有返回
          //alert('用户点击发送给朋友');
        },
        success: function (res) {
          //alert('已分享');
        },
        cancel: function (res) {
          //alert('已取消');
        },
        fail: function (res) {
          //alert(JSON.stringify(res));
        }
      });
      // alert('已注册获取“发送给朋友”状态事件');

      // 2.2 监听“分享到朋友圈”按钮点击、自定义分享内容及分享结果接口

      wx.onMenuShareTimeline({
        title: '圣诞节即使没有喧闹，也要有点微笑',
        link: window.location.origin + '/mod/activity/christmas/index.html',
        imgUrl: 'https://imgpub.chuangkit.com/barrageImg/share_1.jpg@100w',
        trigger: function (res) {
          // 不要尝试在trigger中使用ajax异步请求修改本次分享的内容，因为客户端分享操作是一个同步操作，这时候使用ajax的回包会还没有返回
          //alert('用户点击分享到朋友圈');
        },
        success: function (res) {
          //alert('已分享');
        },
        cancel: function (res) {
          //alert('已取消');
        },
        fail: function (res) {
          //alert(JSON.stringify(res));
        }
      });
      // alert('已注册获取“分享到朋友圈”状态事件');
    });
    wx.error(function (res) {
      // alert(res.errMsg);
    });
  }

//
    $(document).ready(function() {
        // 绑定页面的resize事件以在变化时更新html的font-size
        $(window).resize(setFontSize);
        // checkLogin(); // 获取用户登录信息
      setTimeout(function () {
        $(".line-1").animate({
          top:'.8rem',
          opacity: '1'
        },"slow");
      },300);
      setTimeout(function () {
        $(".line-2").animate({
          top:'1.1rem',
          opacity: '1'
        },"slow");
      },600);
      setTimeout(function () {
        $(".line-3").animate({
          top:'1.4rem',
          opacity: '1'
        },"slow");
      },900);
    });
    document.addEventListener('touchstart', touch, false);
    document.addEventListener('touchmove', touch, false);
    document.addEventListener('touchend', touch, false);

    function touch(event) {
        var event = event || window.event;

        switch (event.type) {
            case "touchstart":
                window.touchX = event.touches[0].clientX;
                break;
            case "touchend":
                if ((window.touchX - event.changedTouches[0].clientX) > 30) {
                    window.location.href = 'question.html';
                }
                break;
        }
    }
//     // 设置html的font-size
    function setFontSize() {
        document.getElementsByTagName('html')[0].style.fontSize = (window.innerWidth / 375) * 100 + 'px';
    }
//     // 获取用户登录信息
    function checkLogin() {
        $.ajax({
            url: "/user/getUserInfo.do",
            dataType: "json",
            type: "GET",
            success: function(data) {
                if (data.LoginTimeOut) {
                    // 用户未登录
                    applyWechatLogin();
                }
            },
            error: function() {
                console.log("网络错误！");
            }
        });
    }
    // 获取微信上自动注册创客贴账号的链接
    function applyWechatLogin() {
        $.ajax({
            url: "/login/webWxFWHLogin.do",
            dataType: "json",
            type: "POST",
            data: {
                redirect_url: window.location.href
            },
            success: function(data) {
                if (data.code == 1) {
                    window.location.href = data.url;
                } else {
                    console.log("出错啦!")
                }
            }
        });
    }
});
