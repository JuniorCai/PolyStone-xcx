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
  formSubmit:function(e){
    if(this.checkUserName()&&this.checkPassword()){
      postRegister();
    }
  },
  postRegister:function(){
    wx.request({
      url: app.globalData.baseUrl + '/api/Account/Register',
      data: "",
      method: "POST",
      header: {
        'Content-Type': 'application/json',
      },
      success: function (result) {
        if (result.data.success){
          wx.setStorageSync('ticketToken', result.data.result)
          var bearerToken = 'Bearer ' + result.data.result;
          wx.request({
            url: app.globalData.baseUrl + '/api/Account/GetCurrentUserInfo',
            data: account,
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
    var regUserName = "^[a-zA-Z][a-zA-Z0-9_]{6-20}$";
    if (!regUserName.test(this.data.account.userName)){
        wx.showToast({
          title: '用户名仅支持6-20位首位为英文，且是英文、数字或下划线的组合，',
          icon:"none",
          duration: 1500
        })
        return false;
    }
    return this.checkUserNameDuplicate(this.data.account.userName);

  },
  checkUserNameDuplicate:function(userName){
    let promise = new Promise(function (resolve, reject) {
      wx.request({
        url: app.globalData.baseUrl + '/api/services/app/user/IsUserNameExist',
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
    promise.then(result => {
      return result;
    });
  },
  checkPassword:function(){
    var regUserName = "^[a-zA-Z0-9]{6-20}$";
    if (!regUserName.test(this.data.account.userName)) {
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