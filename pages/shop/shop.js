var commonjs = require('../common/common.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    integral : 0,
    goodsList : [],
    goodsCount : 0,   //商品总数
    pageInfo : {}
  },

  getGoodsList : function(page){  //获取商品列表
    var that = this;
    wx.showToast({
      title: '玩命加载中...',
      icon : 'loading',
      duration: 1000
    });

    wx.request({
      url: this.data.appData.serverUrl + 'wx-shop/index',
      data: {
        page: page,
        token: this.data.apiToken
      },
      method: 'GET',
      success: function (res) {
        var total = res.data.pageInfo.total;
        var resGoodsList = that.listHandle(res.data.info);

        wx.setStorageSync('goodsList', resGoodsList);
        wx.setStorageSync('pageInfo', res.data.pageInfo);

        that.setData({
          goodsList: resGoodsList,
          goodsCount : total
        });
        wx.stopPullDownRefresh();
      }
    });
  },

/**
 * 商品列表信息处理
 */
  listHandle : function(goodsList){
    if( goodsList ){
      var returns = [];
      for (var i = 0;i < goodsList.length; i++){
        var goodsItem = goodsList[i];
        goodsItem.g_type = commonjs.getGoodsType(goodsItem.g_type); //商品类型转义

        if (goodsItem.src == ''){
          goodsItem.src = '/imgs/demo/demo1.jpg';
        }

        returns.push(goodsItem);
      }

      return returns;
    }else
    {
      return goodsList;
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var appInfo = getApp();
    this.setData({
      appData: appInfo
    });

    //赋值token
    this.setData({
      apiToken: appInfo.secret
    });

    //请求商品列表
    this.getGoodsList(1);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.refreshInfo(this.data.appData.loginInfo);
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setValue(this.data.appData);
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
    this.refreshInfo(this.data.appData.loginInfo);
    this.setValue(this.data.appData);
    this.getGoodsList(1);
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    var lists = wx.getStorageSync('goodsList');
    var pageInfo = wx.getStorageSync('pageInfo');

    var page = parseInt(pageInfo.page) + 1;
    if (page <= pageInfo.pageCount) {
      wx.showToast({
        title: '玩命加载中...',
        icon: 'loading',
        duration: 500
      })

      wx.request({
        url: this.data.appData.serverUrl + 'wx-shop/index',
        method: 'get',
        data: {
          page: page,
          token: this.data.appData.secret
        },
        success: function (res) {
          var newList = lists.concat(that.listHandle(res.data.info));
          wx.setStorageSync('goodsList', newList);
          wx.setStorageSync('pageInfo', res.data.pageInfo);
          that.setData({
            goodsList: newList
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

  /**
   * 刷新
   */
  refreshInfo : function(loginInfo){
    if(loginInfo && this.data.appData.isLogin){
      this.data.appData.getIntegral(loginInfo);
    }
  },

  /**
   * 参数赋值
   */
  setValue : function(appData){
    var userInfo = appData.userInfo;
    this.setData({
      integral: userInfo.integral
    });
  },

  /**
   * 商品详情
   */
  getGoodsDetail : function(event){
    var gid    = event.currentTarget.dataset.gid;
    var imgsrc = event.currentTarget.dataset.imgsrc;
    wx.navigateTo({
      url: '../sdetail/sdetail?gid=' + gid + '&imgsrc=' + imgsrc,
    })
  }
})