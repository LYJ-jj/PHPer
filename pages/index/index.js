Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

/**
 * 加载文章数据
 */
  getList : function(page){
    var that = this;
    wx.showToast({
      title: '玩命加载中...',
      icon : 'loading',
      duration : 1000
    })
    wx.request({
      url: this.data.appData.serverUrl + 'article/index',
      data: {
        page : page, 
        token: this.data.apiToken
      },
      method: 'GET',
      success: function (res) {
        wx.setStorageSync('articleList', res.data.info);
        wx.setStorageSync('pageInfo', res.data.pageInfo);
        that.setData({
          articleList: res.data.info
        });
        wx.stopPullDownRefresh();
      }
    });
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //1.获取全局数据
      var appData = getApp();
      this.setData({
        appData : appData
      });

    //2.获取token缓存
    // var token = wx.getStorageSync('token');
    this.setData({
      apiToken : appData.secret
    });

    this.getList(1);

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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
     this.getList(1);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    var lists = wx.getStorageSync('articleList');
    var pageInfo = wx.getStorageSync('pageInfo');

    var page =  parseInt(pageInfo.page) + 1 ;
    if( page <= pageInfo.pageCount ){
      wx.showToast({
          title: '玩命加载中...',
          icon : 'loading',
          duration : 500
      })

      wx.request({
        url: this.data.appData.serverUrl + 'article/index',
        method: 'get',
        data: {
          page: page,
          token: this.data.appData.secret
        },
        success: function (res) {
          var newList = lists.concat(res.data.info);
          wx.setStorageSync('articleList', newList);
          wx.setStorageSync('pageInfo', res.data.pageInfo);
          that.setData({
            articleList: newList
          });
        }
      })
    }
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  },

  getArticleDetail : function(event){
      //获取文章id，去请求文章详情
    var aid = event.currentTarget.dataset.aid;
    wx.navigateTo({
      url: '../detail/detail?aid=' + aid,
    })
  }


})