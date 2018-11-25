import RequestHelper from "../../../utils/request.js";

var config = require("../../../utils/config.js");

const app = getApp();


// pages/account/login.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      disabled:true,
      loginModel:{
        phone:"",
        password:"",
        loginType:1,
      }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let promise = app.getUserInfo();
    promise.then(result => {
      if (result) {
        wx.switchTab({
          url: '/pages/center/index',
        })
      }
    });
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
  phoneInput:function(e){
      this.setData({
        "loginModel.phone":e.detail.value,
      });
  },
  passwordInput: function (e) {
    this.setData({
      "loginModel.password": e.detail.value,
    });
  },
  onLogin:function(e){
    if (this.data.loginModel.phone.length == 0 || this.data.loginModel.password.length == 0)    {
      wx.showToast({
        title: '手机号码或密码不能为空',
        mask:true,
        duration:1500
      });
      // setTimeout(function(){
      //   wx.hideToast()
      // },2000);
    } else if (this.data.loginModel.phone.length != 11){
      wx.showToast({
        title: '请输入11位手机号码!',
        icon: 'none',
        duration: 1500
      })

      // setTimeout(function () {
      //   wx.hideToast()
      // }, 2000)
    } else if (e.detail.value.password.length < 6 || e.detail.value.password.length > 20) {
      wx.showToast({
        title: '请输入6-20密码!',
        icon: 'none',
        duration: 1500
      })
      // setTimeout(function () {
      //   wx.hideToast()
      // }, 2000)
    }else{
      var loginRequestHelper = new RequestHelper(false);
      loginRequestHelper.postRequest('/api/Account/Authenticate', this.data.loginModel).then(res=>{
        if (res.data.success) {
          wx.setStorageSync('ticketToken', res.data.result)
          var bearerToken = 'Bearer ' + res.data.result;
          wx.request({
            url: config.requestHost + '/api/Account/GetCurrentUserInfo',
            data: "",
            method: "GET",
            header: {
              'Content-Type': 'application/json',
              'Authorization': bearerToken
            },
            success: function (info) {
              app.globalData.userInfo = info.data.result;
              app.globalData.hasUserInfo = true;
              wx.switchTab({
                url: '/pages/center/index',
              })
            }, fail: function (ex) {
              var d = ex;
            }
          })
        } else {
          var title = "";
          switch (res.data.error.code) {
            case 100001:
              title = "手机号或密码不正确";
              break;
            case 100004:
              title = "账号已被禁用，请联系客服";
              break;
            default:
              break;
          }
          wx.showToast({
            title: title,
            icon: 'none',
            duration: 1500
          })

          setTimeout(function () {
            wx.hideToast()
          }, 2000)
        }
      });
    }
  },
  onCheckInput:function(e){
    if (this.data.loginModel.phone.length == 0 || this.data.loginModel.password.length==0){
      this.setData({
        disabled:true
      })
    }else{
      this.setData({
        disabled: false
      })
    }
  }
})