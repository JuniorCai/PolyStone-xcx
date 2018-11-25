var config = require("../../../utils/config.js") 
import RequestHelper from "../../../utils/request.js";
import AuthCodeHelper from "../../../utils/authCodeHelper.js";

const app = getApp()

// pages/account/register.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    countDown:60,
    suffix:"获取验证码",
    countDownDisabled:false,
    disabled: true,
    registerModel:{
      phoneNumber:"",
      authCode:""
      }
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
      "registerModel.phoneNumber": e.detail.value,
    });
  },
  codeInput: function (e) {
    this.setData({
      "registerModel.authCode": e.detail.value,
    });
  },
  onCheckInput: function (e) {
    if (this.data.registerModel.phoneNumber.length == 0 || this.data.registerModel.authCode.length == 0) {
      this.setData({
        disabled: true
      })
    } else {
      this.setData({
        disabled: false
      })
    }
  },
  sendPhoneCode:function(){

    var that = this;
    let codeHelper = new AuthCodeHelper(this);
    codeHelper.sendAuthCode(that.data.registerModel.phoneNumber);
  },
  
  toStepTwo: function () {
    let that = this;
    let requestHelper = new RequestHelper(false);
    requestHelper.postRequest('/api/Auth/AuthPhoneCode', that.data.registerModel).then(res=>{
      if (res.data.success) {
        wx.navigateTo({ url: "registerTwo?phone=" + that.data.registerModel.phoneNumber + "&code=" + that.data.registerModel.authCode })
      } else {
        wx.showToast({
          title: "验证码不正确或已过期，请确认验证码或重新发送",
          mask: true,
          icon: "none",
          duration: 1500
        })
      }
    });
  }
})