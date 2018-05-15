App({

  serverUrl : "https://www.readless.top/api/",
  secret    : "small-app",
  userInfo  : {},
  loginInfo : {},
  isLogin   : false,

  /**
   * 获取积分
   */
  getIntegral: function (loginInfo) {
    if (loginInfo && this.isLogin) {
      var that = this;
      wx.request({
        url: that.serverUrl + 'small-app/get-integral',
        method: 'GET',
        data: {
          token: that.secret,
          openid: loginInfo.openid
        },
        success: function (ret) {
          if (ret.data.code == 1) {
            that.userInfo.integral = ret.data.info;
          }
        }
      })
    }
  },

  /**
   * 用户登录
   */
  userLogin: function () {
    var that = this;
    //1.获得用户授权
    wx.login({
      success: function (res) {
        if (res.code) {
          //2.换取openid
          wx.request({
            url: that.serverUrl + 'small-app/get-openid',
            data: {
              code: res.code,
              token: that.secret
            },
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            method: 'post',
            success: function (ret) {
              //缓存openid
              if (ret.data.code == 1) {
                that.loginInfo = ret.data.info;
              }
              wx.getUserInfo({
                success: function (res) {
                  var userInfo = res.userInfo;

                  if(ret.data.code == 1){
                    //将用户基本信息重发送回后端记录
                    wx.request({
                      url: that.serverUrl + 'small-app/up-userinfo',
                      data: {
                        openid: ret.data.info.openid,
                        userInfo: res.userInfo.nickName,
                        rawData: res.rawData,
                        signature: res.signature,
                        encryptedData: res.encryptedData,
                        iv: res.iv,
                        token: that.secret
                      },
                      header: {
                        "Content-Type": "application/x-www-form-urlencoded"
                      },
                      method: 'post',
                      success: function (msg) {
                        //获取用户相关信息
                        that.getIntegral(that.loginInfo);
                      }
                    });
                  }
    
                  that.userInfo = userInfo;
                  that.isLogin  = true;
                },

                fail : function(res){
                  that.isLogin = false;
                  that.loginInfo = {};
                }
              })
            },
          })
        }
      },

    })
  },

  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function () {
    //1.获取token

      wx.request({
        url: this.serverUrl + 'auth-key/token',
        data : {
           secret : this.secret
        },
        header : {
          "Content-Type" : "application/x-www-form-urlencoded"
        },
        method : 'POST',
        success : function(res){
            if( res.data.code == 1 ){
              var info = res.data.info;
              //2.获取到token
              wx.setStorageSync('token',info.token);
            }else{
              wx.showModal({
                title: 'Sorry',
                content: '数据加载失败!',
                showCancel : false
              })
            }

        },
        fail : function(res){
            console.log('fail');
        }
      }),

      this.userLogin(); //登录
  },

  /**
   * 当小程序启动，或从后台进入前台显示，会触发 onShow
   */
  onShow: function (options) {
    
  },

  /**
   * 当小程序从前台进入后台，会触发 onHide
   */
  onHide: function () {
    
  },

  /**
   * 当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
   */
  onError: function (msg) {
    
  }
})
