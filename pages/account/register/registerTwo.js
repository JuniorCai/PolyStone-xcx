var config = require("../../../utils/config.js") 

const app = getApp();
// pages/account/register/registerTwo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    account:{
      userName:"",
      password:"",
      phoneNumber:"",
      authCode:""
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.phone.length>0&&options.code.length>0){
      this.setData({
        'account.phoneNumber': options.phone,
        'account.authCode': options.code
      });
    }else{
      wx.redirectTo({
        url: 'registerOne',
      })
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
  userNameInput: function (e) {
    this.setData({
      "account.userName": e.detail.value,
    });
  },
  passwordInput: function (e) {
    this.setData({
      "account.password": e.detail.value,
    });
  },
  formSubmit:function(e){
    let that = this;
    let userNamePromise = that.checkUserName();
    userNamePromise.then(result => {
      if(result){
        if (that.checkPassword()){
          that.postRegister();
        }
      }
    });
  },
  postRegister:function(){
    wx.request({
      url: config.requestHost + '/api/Account/Register',
      data: this.data.account,
      method: "POST",
      header: {
        'Content-Type': 'application/json',
      },
      success: function (result) {
        if (result.data.success){
          wx.setStorageSync('ticketToken', result.data.result)
          var bearerToken = 'Bearer ' + result.data.result;
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
            }
          })
        }else{
          wx.showToast({
            title: '注册不成功',
            icon: "none",
            duration: 1500
          })
        }        
      },
      fail: function (info) {

      }
    })
  },
  checkUserName:function(){
    var regUserName = /^[a-zA-Z][a-zA-Z0-9_]{3,19}$/;
    if (!regUserName.test(this.data.account.userName)){
        wx.showToast({
          title: '用户名长度为4-20位。仅支持英文、数字和下划线,且首位为英文',
          icon:"none",
          duration: 1500
        })
        return false;
    }
    let promise = this.checkUserNameDuplicate(this.data.account.userName);
    return promise;
  },
  checkUserNameDuplicate:function(userName){
    let promise = new Promise(function (resolve, reject) {
      wx.request({
        url: config.requestHost + '/api/services/app/user/IsUserNameExist?userName='+userName,
        data: "",
        method: "POST",
        header: {
          'Content-Type': 'application/json',
        },
        success: function (info) {
          if (info.data.result==null) {
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
    return promise;
  },
  checkPassword:function(){
    var regUserName = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{5,19}$/;
    if (!regUserName.test(this.data.account.password)) {
      wx.showToast({
        title: '登录密码仅支持6-20位英文、数字的组合',
        icon: "none",
        duration: 1500
      })
      return false;
    }
    return true;
  }
})