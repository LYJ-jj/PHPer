Page({

  /**
   * 页面的初始数据
   */
  data: {
    name : 'Hello',
    face : '/imgs/icon/smile.png',
    last_login_time : '-',
    historyList : false,
    integral : 0
  },

  /**
   * 获取浏览记录
   */
  getHistory : function(loginInfo){
      if( loginInfo && this.data.appData.isLogin ){
        var that = this;
        wx.request({
          url: this.data.appData.serverUrl + 'history/index',
          method: 'GET',
          data: {
            token: this.data.appData.secret,
            openid: loginInfo.openid
          },
          success : function(ret){
              if(ret.data.code == 1){
                that.setData({
                  historyList: ret.data.info
                });
              }
          }
        })
      }
  },

  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     var appInfo = getApp();
     this.setData({
        appData : appInfo
     });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var loginInfo = this.data.appData.loginInfo;
    if(loginInfo){
      this.refreshUserInfo(loginInfo);
      this.setValue(this.data.appData);
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
     var loginInfo = this.data.appData.loginInfo;
     this.refreshUserInfo(loginInfo);
     this.setValue(this.data.appData);
     wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  },

  /**
   * 给用户信息赋值
   */
  setValue : function(appData){
    var userInfo  = appData.userInfo;
    var loginInfo = appData.loginInfo;
    this.setData({
      name: userInfo.nickName,
      face: userInfo.avatarUrl,
      last_login_time: loginInfo.last_login_time,
      integral: userInfo.integral
    });
  },

  /**
   * 刷新用户信息
   */
  refreshUserInfo : function(loginInfo){
    if(loginInfo){
      this.getHistory(loginInfo);
      this.data.appData.getIntegral(loginInfo);
      var appInfo = getApp();
      this.setData({
        appData: appInfo
      });
    }
  },

  getArticleDetail: function (event) {
    //获取文章id，去请求文章详情
    var aid = event.currentTarget.dataset.aid;
    wx.navigateTo({
      url: '../detail/detail?aid=' + aid,
    })
  }
})