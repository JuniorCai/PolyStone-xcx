const app = getApp();
// pages/account/register/registerTwo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    account:{
      userName:"",
      password:""
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
  formSubmit:function(e){
    
  },
  checkUserName:function(){
    var regUserName = "^[a-zA-Z][a-zA-Z0-9_]{6-20}$";
    if (!regUserName.test(this.data.account.userName)){
        wx.showToast({
          title: '用户名仅支持中英文、数字和下划线,且不能为纯数字',
          icon:"none",
          duration: 1500
        })
        return false;
    }
    return this.checkUserNameDuplicate(this.data.account.userName);

  },
  checkUserNameDuplicate:function(userName){
    let promise = new Promise(function (resolve, reject) {
      if (token.length > 0) {
        var bearerToken = 'Bearer ' + token;
        wx.request({
          url: 'http://127.0.0.1/api/services/app/user/IsUserNameExist',
          data: "",
          method: "GET",
          header: {
            'Content-Type': 'application/json',
          },
          success: function (info) {
            if (info.data.success) {
              app.globalData.userInfo = info.data.result;
              app.globalData.hasUserInfo = true;
              resolve(true);
            } else {
              resolve(false);
            }
          },
          fail: function (info) {
            reject(false);
          }
        })
      }
    });
    promise.then(result => {
      if (result) {
        wx.switchTab({
          url: '/pages/center/index',
        })
      }
    });
  },
  checkPassword:function(){

  }
})