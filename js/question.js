require(['jquery', 'b', 'barrager','wxjsapi'], function($, b, barrager, wx) {
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
    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
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
        imgUrl: 'https://imgpub.chuangkit.com/barrageImg/share.jpg@100w',
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
        imgUrl: 'https://imgpub.chuangkit.com/barrageImg/share.jpg@100w',
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
    checkLogin(); // 获取用户登录信息

  }

    var bgm = document.getElementById('bgm');

    function audioAutoPlay(id){
      var audio = document.getElementById(id);
      audio.play();
      document.addEventListener("WeixinJSBridgeReady", function () {
        audio.play();
      }, false);
      document.addEventListener('YixinJSBridgeReady', function() {
        audio.play();
      }, false);
    }
    audioAutoPlay('bgm');

  bgm.load();
  bgm.oncanplay = function() {
    bgm.play();
  };

  function wocao() {
    this.play();
  }
  
  /*
  bgm.addEventListener('canplay', function() {
    alert('asdasd');
    bgm.play();
  });*/


    window.questionIndex = 0;

    getQuestion();

    $('.mask').click(function() {
        $(this).fadeOut();
        $('.answer-wrap').fadeOut();
        $('.answer-btn').removeClass('active');
    });

    $('.answer-btn').click(function() {
      if (!isWx) {
        $("#tip").css('display', 'block')
        return
      }
        $('.answer-wrap, .mask').fadeIn();
        $('#answerInput').focus();
        $(this).addClass('active');
    });

    $('.send-btn').click(function() {
        var answer = $(this).prev().val();
        if (answer.length > 0) {
            saveAnswer(answer);
            $('.answer-btn').removeClass('active');
        }
    });

    $('#answerInput').keyup(function(event) {
        var answer = $(this).val();
        if (answer.length > 0) {
            $(this).next().addClass('active');
        } else {
            $(this).next().removeClass('active');
        }
    });

    $('#answerInput').keypress(function(event) {
        if (event.keyCode == 13) {
            $(this).next().click();
            $(this).blur();
            $('.answer-btn').removeClass('active');
        }
    });

    // 弹幕活动-获取题目
    function getQuestion() {

        $.ajax({
            url: "/activity/listBarrageQuestion.do",
            type: "POST",
            dataType: "json",
            success: function(data) {

                if (data.questionList) {
                    window.questionList = data.questionList;
                    $('.question-wrap').css('background-image', 'url(' + window.questionList[window.questionIndex].imgUrl + ')')
                    getBarrage();
                    var $img,
                        $body = $('body');
                    for (var i = 0; i < window.questionList.length; i++) {
                        $img = $('<img src="' + window.questionList[i].imgUrl + '" class="hide" />');
                        $body.append($img);
                        var div = $('<div></div>');
                        div.css('background-image', 'url(' + window.questionList[i].imgUrl + ')')
                        $('.background-wrap').append(div);
                    }

                } else if (data.code == -1) {
                    window.location.href = 'index.html';
                } else if (data.code == -2) {
                    window.questionList = [];
                }

            },
            error: function(data) {
                console.log('弹幕活动-获取题目error!');
            }

        });
    }

    // 弹幕活动-获取答题信息
    function getBarrage() {

        $.ajax({
            url: "/activity/getBarrageAnswerUrl.do",
            type: "POST",
            dataType: "json",
            data: {
                qid: window.questionList[window.questionIndex].id
            },
            success: function(data) {
                // 操作的错误码(-1参数错误;-2未登录;-3暂无用户答题记录)
                if (data.answerUrl) {

                    $.ajax({
                        url: '//' + data.answerUrl,
                        type: "GET",
                        success: function(data) {

                            if (data.body.answerRecordList) {
                                window.barragerIndex = 0;
                                window.barragerList = data.body.answerRecordList;
                                clearTimeout(window.showBarrageClock);
                                showBarrage();
                            }

                        },
                        error: function(data) {
                            console.log('弹幕活动-获取答题信息error!');
                        }

                    });
                } else if (data.code == -1) {
                    window.barragerList = [];
                } else if (data.code == -2) {
                    window.location.href = 'index.html';
                } else {
                    window.barragerIndex = 0;
                    window.barragerList = [];
                    clearTimeout(window.showBarrageClock);
                    window.barragerList = [];
                }

            },
            error: function(data) {
                console.log('弹幕活动-获取答题信息error!');
                console.log(data);
            }

        });

    }

    var winHeight = document.documentElement.clientHeight,
        speedIndex = 0;
        speedList = [
            'slow-speed',
            'mid-speed',
            'high-speed'
        ];

    function showBarrage() {

        var indexBarrage = window.barragerList[window.barragerIndex];
        var barrager = {
            img: indexBarrage.imgUrl, //图片 
            info: indexBarrage.answerContent, //文字 
            close: false, //显示关闭按钮 
            href:'javascript:void(0);', //链接 
            color: '#000', //颜色,默认白色 
            old_ie_color: '#000000', //ie低版兼容色,不能与网页背景相同,默认黑色 
            bottom: parseInt(80 + (winHeight - 180) * Math.random()),
            speedClass: speedList[speedIndex]
        }
        speedIndex++;
        if(speedIndex > 2) {
            speedIndex = 0;
        }

        $('body').barrager(barrager);

        window.showBarrageClock = setTimeout(function() {
            if (window.barragerIndex + 1 < window.barragerList.length) {
                window.barragerIndex++;
                showBarrage();
            } else {
                clearTimeout(window.showBarrageClock);
                getBarrage();
            }
        }, 1100);

    }

    function hideBarrage() {

        var $barrage = $('.barrage');

        $barrage.each(function() {
            var $this = $(this);
            $this.stop();
            $this.animate({
                opacity : 0
            }, 800, function() {
                $this.remove();
            });
        });

    }

    function saveAnswer(answer) {

        $.ajax({
            url: "/activity/saveBarrageAnswer.do",
            type: "POST",
            dataType: "json",
            data: {
                qid: window.questionList[window.questionIndex].id,
                answer: answer
            },
            success: function(data) {

                var code = data.code;
                if (code == 1) {
                    var answerBarrage = {
                        img: window.userInfo.userHeadImgUrl, //图片 
                        info: answer, //文字 
                        close: false, //显示关闭按钮 
                        href:'javascript:void(0);', //链接 
                        bottom: winHeight - 60, //距离底部高度,单位px,默认随机
                        color: '#07AFEC', //颜色,默认白色 
                        old_ie_color: '#07AFEC', //ie低版兼容色,不能与网页背景相同,默认黑色 
                        speedClass: 'mid-speed'
                    };
                    $('body').barrager(answerBarrage);
                    $('.answer-wrap, .mask').fadeOut();
                    $('#answerInput').val('');
                } else if (data.code == -2) {
                    window.location.href = 'index.html';
                }

            },
            error: function(data) {
                console.log('弹幕活动-获取题目error!');
                console.log(data);
            }

        });

    }
  // 获取用户登录信息
  function checkLogin() {
    $.ajax({
      url: "/user/getUserInfo.do",
      dataType: "json",
      type: "GET",
      success: function(data) {
        if (data.LoginTimeOut) {
          // 用户未登录
          applyWechatLogin();
        } else {
          window.userInfo = data.userInfo;
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
                if ((event.changedTouches[0].clientX - window.touchX) < -22) {
                    hideBarrage();
                    window.questionIndex++;
                    if (window.questionIndex < window.questionList.length) {
                        // console.log('下一张');
                        $('#mask').fadeOut();
                        $('.answer-wrap').fadeOut();
                        $('.question-wrap').css('background-image', 'url(' + window.questionList[window.questionIndex].imgUrl + ')');
                        $('.background-wrap').animate({
                          'left': $('.background-wrap').children().width() * -1 * window.questionIndex
                        }, 800);
                        $('.answer-wrap').val('').fadeOut().next().removeClass('active');
                        clearTimeout(window.showBarrageClock);
                        getBarrage();
                    } else {
                        window.location.href = 'share.html';
                    }
                } else if ((event.changedTouches[0].clientX - window.touchX) > 22) {
                    hideBarrage();
                    window.questionIndex--;
                    $('#mask').fadeOut();
                    $('.answer-wrap').fadeOut();
                    if (window.questionIndex >= 0) {
                        $('.question-wrap').css('background-image', 'url(' + window.questionList[window.questionIndex].imgUrl + ')');
                        $('.answer-wrap').val('').fadeOut().next().removeClass('active');
                        $('.background-wrap').animate({
                          'left': $('.background-wrap').children().width() * -1 * window.questionIndex
                        }, 800);
                        clearTimeout(window.showBarrageClock);
                        getBarrage();
                    } else {
                        window.location.href = 'index.html';
                    }
                    // console.log('上一张');
                }
                break;
            case "touchmove":
                event.preventDefault();
                break;
        }
    }

    // var mask = document.getElementById('mask');
    // mask.addEventListener('touchstart', maskTouch, false);
    // mask.addEventListener('touchmove', maskTouch, false);
    // mask.addEventListener('touchend', maskTouch, false);

    // function maskTouch(event) {
    //     var event = event || window.event;
    //     event.preventDefault();
    //     return false;
    // }

    setFontSize();
    //$('body').css('min-height', winHeight + 'px');

    $(window).resize(setFontSize);

    function setFontSize() {
        document.getElementsByTagName('html')[0].style.fontSize = (window.innerWidth / 375) * 100 + 'px';
    }

    $('#bgmbtn').click(function() {
      if($(this).hasClass('bgmbtnyes')) {
        bgm.pause();
        $(this).removeClass('bgmbtnyes');
        $(this).addClass('bgmbtnno');
      } else {
        bgm.play();
        $(this).removeClass('bgmbtnno');
        $(this).addClass('bgmbtnyes');
      }
    });

});
