Page({
  
  /**
   * 页面的初始数据
   */
  data: {
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var WxParse = require('../wxParse/wxParse.js');
    var app = getApp();
    this.setData({
       appData : app,
       aid     : options.aid
    });

     //获取文章详情
     var that   = this;
     wx.request({
       url: this.data.appData.serverUrl + 'article/view',
       method : 'GET',
       data : {
          token  : this.data.appData.secret,
          id     : this.data.aid,
       },
       success : function(res){
         that.setData({
           detail : res.data.info
         });
         WxParse.wxParse('content','html',res.data.info.cont,that);
       }
     });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var loginInfo = this.data.appData.loginInfo;
    if (loginInfo) {
      wx.request({
        url: this.data.appData.serverUrl + 'article/up-relainfo',
        method: 'POST',
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        data: {
          token: this.data.appData.secret,
          openid: loginInfo.openid,
          aid: this.data.aid
        },

        success: function (ret) {

        }
      })
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
      
  }
})