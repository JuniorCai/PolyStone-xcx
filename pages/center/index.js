const app = getApp()
var config = require("../../utils/config.js") 
// pages/center/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasListHead:false,
    hasUserInfo:false,
    userInfo:{},
    fileServer: config.baseHost.fileServer 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.hasUserInfo && app.globalData.userInfo){
        this.setData({
          hasUserInfo: app.globalData.hasUserInfo,
          userInfo: app.globalData.userInfo
        })
    }else{
      let promise = app.getUserInfo();
      promise.then(result => {
        if (result) {
          app.globalData.isUserChange = false;

          this.setData({
            hasUserInfo: app.globalData.hasUserInfo,
            userInfo: app.globalData.userInfo
          })
        }
      });
    }
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
    if ((!this.data.hasUserInfo && app.globalData.hasUserInfo) ||       (this.data.hasUserInfo && app.globalData.isUserChange)) {
      app.globalData.isUserChange = false;

      this.setData({
        hasUserInfo: app.globalData.hasUserInfo,
        userInfo: app.globalData.userInfo
      })
    }
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

  },

  onGetUserInfo:function(){
    wx.navigateTo({
      url: '/pages/account/login/login'
    })
  },
  onShowUserInfo:function(){
    wx.navigateTo({
      url: 'userInfo/userInfo',
    })
  }
})