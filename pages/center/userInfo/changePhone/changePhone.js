import Toast from "../../../../customComponent/VantWeapp/toast/toast";
import AuthCodeHelper from "../../../../utils/authCodeHelper.js";

var config = require("../../../../utils/config.js") 

// pages/center/userInfo/changePhone/changePhone.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    authModel:{
      authCode: "",
      phoneNumber: "",
    },
    countDown: 60,
    suffix: "获取验证码",
    countDownDisabled: false

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
  phoneInput: function (e) {
    this.setData({
      "authModel.phoneNumber": e.detail.value,
    });
  },
  codeInput: function (e) {
    this.setData({
      "authModel.authCode": e.detail.value,
    });
  },
  sendAuthCode:function(){
    checkNewPhoneExist().then(result => {
      if (result) {
        let codeHelper = new AuthCodeHelper(this);
        codeHelper.sendAuthCode(this.data.phoneNumber)
      }else{
        wx.showToast({
          title: '该手机号已被绑定',
          mask: true,
          icon: "none",
          duration: 1500
        });
      }
    });
  },
  checkNewPhoneExist:function(){
    var that = this;
    return new Promise(function(resolve,reject){
      wx.request({
        url: config.requestHost + '/api/services/app/user/IsPhoneExist',
        data: { phoneNumber: that.data.authModel.phoneNumber},
        method: "POST",
        header: {
          'Content-Type': 'application/json'
        },
        success: function (info) {
          if (info.data.success) {
            resolve(true);
          } else {
            resolve(false);
          }
        },
        fail: function (info) {
          reject(false);
        }
      })  
    });
  }
})