var config = require("config.js") 

class authCodeHelper{
  constructor(pageHander){
      this.that = pageHander;
  }

  sendAuthCode(phoneNumber){
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
    this.getVerificationCode(phoneNumber);
  }

  getVerificationCode(phoneNumber){
    var helperThat = this;
    let interval = null;
    let current = 60;
    this.that.setData({
      countDownDisabled: true,
      suffix: current + "s后重新发送"
    })
    interval = setInterval(function () {
      current--;
      if (current < 0) {
        clearInterval(interval);
        helperThat.that.setData({
          countDown: current,
          countDownDisabled: false,
          suffix: "重新发送"
        })
      } else {
        helperThat.that.setData({
          countDown: current,
          suffix: current + "s后重新发送"
        })
      }

    }, 1000);
    wx.request({
      url: config.requestHost + '/api/Auth/SendPhoneCode',
      data: { "phoneNumber": phoneNumber },
      method: "GET",
      header: {
        'Content-Type': 'application/json',
      },
      success: function (info) {
        if (info.data.result.code == 2) {
          wx.showToast({
            title: '验证码已发送',
            mask: true,
            icon: "success",
            duration: 1500
          })
        } else {
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
  }


  authVerificationCode(authModel){
    return new Promise(function(resolve,reject){
      wx.request({
        url: config.requestHost + '/api/Auth/AuthPhoneCode',
        data: authModel,
        method: "POST",
        header: {
          'Content-Type': 'application/json',
        },
        success: function (info) {
          if (info.data.success) {
            resolve(true);
          } else {
            wx.showToast({
              title: "验证码不正确或已过期，请确认验证码或重新发送",
              mask: true,
              icon: "none",
              duration: 1500
            })
            resolve(false);
          }

        }, fail: function (ex) {
          wx.showToast({
            title: ex,
            mask: true,
            icon: "none",
            duration: 1500
          })
          reject(false);
        }
      })
    })
    
  }
}
export default authCodeHelper
