var commonjs = require('../common/common.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail : {},
    emailVal : '',
    btnDisables : true
  },

  /**
   * 输入框失去焦点时
   */
  inputBlur : function(value){
    var that = this;
    var val = value.detail.value;
    this.setData({
      emailVal : val
    });

    if( val == '' ){
      wx.showModal({
        title: '提示',
        content: '请输入您的邮箱',
      });

      this.setData({  //按钮置灰
        btnDisables: true
      });
    }

    var rs  = commonjs.validEmail(val);
    if(rs == false){
      wx.showModal({
        title: '错误',
        content: '请输入正确的邮箱地址',
        success: function (res) {
          if (res.confirm) {
            that.setData({
              emailVal : ''
            });
          }
        }
      });
    }else //邮箱校验通过
    {
      if (this.data.detail.surplus_num == 0) {  //没有剩余数量
        this.setData({  //按钮置灰
          btnDisables: true
        });
      }else
      {
        this.setData({  //按钮可点
          btnDisables: false
        });
      }
    }
  },

  /**
   * 表单提交前数据校验
   */
  subBeforeValid:function(value){
    var rs = {
      res : true,
      mes : ''
    };

    if(value.email == ""){
      rs.res = false;
      rs.mes = '请输入您的邮箱!';
    }


    return rs;
  },

  /**
   * 兑换
   */
  suborder : function(e){
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确认兑换该商品吗？',
      success: function (res) {
        if (res.confirm) {

          //未授权登录的需要授权
          if (that.data.appData.isLogin == false){
            that.data.appData.userLogin();
          }

          //发送商品及用户信息
          wx.request({
            url: that.data.appData.serverUrl + 'wx-shop/exchange',
            method: 'POST',
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            data: {
              token: that.data.appData.secret,
              id: that.data.gid,
              openid: that.data.appData.loginInfo.openid,
              email : e.detail.value.email
            },
            success: function (res) {
              //给出提示
              if (res.data.code == 1){
                if (that.data.appData.isLogin == false) { //用户未登录的情况
                  wx.showModal({
                    title: '提示',
                    content: '兑换成功，查询兑换记录需要重新授权用户信息',
                    showCancel: false,
                    success: function (res) {
                    }
                  });
                }else
                {
                  wx.showModal({
                    title: '提示',
                    content: '兑换成功',
                    showCancel: false,
                    success: function (res) {
                    }
                  });
                }

                that.setData({  //清空邮箱
                  emailVal: '',
                  btnDisables : true
                });

              }else
              {
                wx.showModal({
                  title: '兑换失败',
                  content: res.data.info,
                  showCancel: false
                })
              }
            }
          });

        }
      }
    });
  },

  /**
   * 获取物品详情
   */
  getGoods : function(){
    var that = this;
    wx.request({
      url: this.data.appData.serverUrl + 'wx-shop/view',
      method: 'GET',
      data: {
        token: this.data.appData.secret,
        id: this.data.gid,
      },
      success: function (res) {
        var goods = res.data;
        goods.g_type = commonjs.getGoodsType(goods.g_type); //商品类型

        that.setData({
          detail: goods
        });
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var app = getApp();
    this.setData({
      appData: app,
      gid: options.gid,
      src: options.imgsrc
    });

    //获取商品详情
    this.getGoods();
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
    this.getGoods();
    wx.showToast({
      title: '玩命加载中...',
      icon: 'loading',
      duration: 500
    })
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },
})