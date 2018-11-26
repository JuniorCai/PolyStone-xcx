import Toast from "../../../../customComponent/VantWeapp/toast/toast";
import AuthCodeHelper from "../../../../utils/authCodeHelper.js";
import RequestHelper from "../../../../utils/request.js";

var config = require("../../../../utils/config.js");
const app = getApp();
// pages/center/userInfo/changePhone/changePhone.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    authModel: {
      authCode: "",
      phoneNumber: "",
    },
    countDown: 60,
    suffix: "发送验证码",
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
      "authModel.phoneNumber": e.detail,
    });
  },
  codeInput: function (e) {
    this.setData({
      "authModel.authCode": e.detail,
    });
  },
  sendAuthCode: function () {
    var that = this;
    let codeHelper = new AuthCodeHelper(this, config.authCodePurpose.resetPassword);
    codeHelper.sendAuthCode(that.data.authModel.phoneNumber)
  },
  // checkNewPhoneExist:function(){
  //   var that = this;
  //   if(that.data.authModel.phoneNumber.length>0){
  //     let requestHelper = new RequestHelper(false);
  //     var data = { phoneNumber: that.data.authModel.phoneNumber};
  //     return requestHelper.postRequest('/api/services/app/user/IsPhoneExist', data);
  //   }else{
  //     wx.showToast({
  //       title: '请输入手机号码',
  //       mask: true,
  //       icon: "none",
  //       duration: 1500
  //     });
  //   }    
  // },
  submitChangePhone: function (e) {
    var that = this;
    let codeHelper = new AuthCodeHelper(this, config.authCodePurpose.resetPassword);

    var phoneNumber = that.data.authModel.phoneNumber;
    var authCode = that.data.authModel.authCode;

    if (codeHelper.checkPhoneNumberLength(phoneNumber) && codeHelper.checkPhoneNumberReg(phoneNumber)) {
      if (authCode.length == 0) {
        wx.showToast({
          title: '请填写短信验证码',
          mask: true,
          icon: "none",
          duration: 1500
        })
        return false;
      }

      codeHelper.authVerificationCode(that.data.authModel).then(result => {
        if (result) {
          wx.navigateTo({
            url: 'resetPassword/resetPassword?phoneNumber=' + phoneNumber + "&authCode=" + authCode,
          })
        }
      });
    }
  }
})