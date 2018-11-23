import Toast from "../../../../customComponent/VantWeapp/toast/toast";
import AuthCodeHelper from "../../../../utils/authCodeHelper.js";

var config = require("../../../../utils/config.js") 
const app = getApp()
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
  sendAuthCode:function(){
    this.checkNewPhoneExist().then(result => {
      if (!result) {
        let codeHelper = new AuthCodeHelper(this);
        codeHelper.sendAuthCode(this.data.authModel.phoneNumber)
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
    if(that.data.authModel.phoneNumber.length>0){
      return new Promise(function (resolve, reject) {
        wx.request({
          url: config.requestHost + '/api/services/app/user/IsPhoneExist',
          data: { phoneNumber: that.data.authModel.phoneNumber },
          method: "POST",
          header: {
            'Content-Type': 'application/json'
          },
          success: function (info) {
            if (info.data.success) {
              resolve(info.data.result);
            } else {
              resolve(false);
            }
          },
          fail: function (info) {
            reject(false);
          }
        })
      });
    }else{
      wx.showToast({
        title: '请输入手机号码',
        mask: true,
        icon: "none",
        duration: 1500
      });
    }    
  },
  submitChangePhone:function(e){
    var that = this;
    var phoneNumber = this.data.authModel.phoneNumber;
    var authCode = this.data.authModel.authCode;
    if (phoneNumber.length == 0) {
      wx.showToast({
        title: '手机号不能为空',
        mask: true,
        icon: "none",
        duration: 1500
      });
      return false;
    }
    if (phoneNumber.length != 11) {
      wx.showToast({
        title: '请输入11位长度手机号',
        mask: true,
        icon: "none",
        duration: 1500
      })
      return false;
    }
    var phoneReg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (!phoneReg.test(phoneNumber)) {
      wx.showToast({
        title: '手机号格式不正确！',
        mask: true,
        icon: "none",
        duration: 1500
      })
      return false;
    }
    if(authCode.length==0){
      wx.showToast({
        title: '请填写短信验证码',
        mask: true,
        icon: "none",
        duration: 1500
      })
      return false;
    }
    let codeHelper = new AuthCodeHelper(this);
    codeHelper.authVerificationCode(this.data.authModel).then(result=>{
        if(result){
          var token = wx.getStorageSync('ticketToken');
          var bearerToken = 'Bearer ' + token;
          var pages = getCurrentPages();
          var centerInfoPage = pages[pages.length - 2];
          var tempUser = centerInfoPage.data.userInfo;
          tempUser.phoneNumber = that.data.authModel.phoneNumber;
          wx.request({
            url: config.requestHost + '/api/services/app/user/UpdateUser',
            data: tempUser,
            method: "POST",
            header: {
              'Content-Type': 'application/json',
              'Authorization': bearerToken
            },
            success: function (result) {
              if (result.data.result) {
                app.globalData.userInfo = tempUser;
                app.globalData.isUserChange = true;
                wx.navigateBack({delta:1});
              }
            }
          })
        }
    });
    
  }
})