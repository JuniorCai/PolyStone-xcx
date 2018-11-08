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
    if (this.data.registerModel.phoneNumber.length == 0){
      wx.showToast({
        title: '手机号不能为空',
        mask:true,
        icon:"none",
        duration:1500
      });
      return false;
    }
    if(this.data.registerModel.phoneNumber.length!=11){
      wx.showToast({
        title: '请输入11位长度手机号',
        mask: true,
        icon: "none",
        duration: 1500
      })
      return false;
    }
    var phoneReg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (!phoneReg.test(this.data.registerModel.phoneNumber)) {
      wx.showToast({
        title: '手机号有误！',
        mask: true,
        icon: "none",
        duration: 1500
      })
      return false;
    }
    this.getVerificationCode();

  },
  getVerificationCode:function(){
    let that = this;
    let interval = null;
    let current = 60;
    that.setData({
      countDownDisabled:true,
      suffix: current+"秒后重新获取"
    })
    interval = setInterval(function(){
        current--;
        if(current<0){
          clearInterval(interval);
          that.setData({
            countDown: current,
            countDownDisabled:false,
            suffix:"重新获取"
          })
        }else{
          that.setData({
            countDown: current,
            suffix: current + "秒后重新获取"
          })
        }

    },1000);
    wx.request({
      url: app.globalData.baseUrl + '/api/Auth/SendPhoneCode',
      data: { "phoneNumber": this.data.registerModel.phoneNumber},
      method: "GET",
      header: {
        'Content-Type': 'application/json',
      },
      success: function (info) {
        if(info.data.result.code==2){
          wx.showToast({
            title: '验证码已发送',
            mask: true,
            icon: "success",
            duration: 1500
          })
        }else{
          wx.showToast({
            title: info.data.result.msg,
            mask: true,
            icon: "none",
            duration: 1500
          })
        }
        
      }, fail: function (ex) {
        wx.showToast({
          title: ex,
          mask: true,
          icon: "none",
          duration: 1500
        })
      }
    })
  },
  toStepTwo: function () {
    wx.request({
      url: app.globalData.baseUrl + '/api/Auth/AuthPhoneCode',
      data: this.data.registerModel,
      method: "POST",
      header: {
        'Content-Type': 'application/json',
      },
      success: function (info) {
        if (info.data.success) {
          wx.navigateTo({ url: "registerTwo?phone=" + this.data.registerModel.phoneNumber + "&code=" + this.data.registerModel.authCode })
        } else {
          wx.showToast({
            title: "验证码不正确或已过期，请确认验证码或重新发送",
            mask: true,
            icon: "none",
            duration: 1500
          })
        }

      }, fail: function (ex) {
        wx.showToast({
          title: ex,
          mask: true,
          icon: "none",
          duration: 1500
        })
      }
    })
  },

})