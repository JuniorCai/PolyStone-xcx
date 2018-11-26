import RequestHelper from "../../../../../utils/request.js";
import RegCheck from "../../../../../utils/regCheck.js";

const regCheck = new RegCheck;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    disabled:true,
    resetModel:{
      phoneNumber:"",
      authCode:"",
      newPassword:"",
      confirmPassword:""
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.phoneNumber.length > 0 && options.authCode.length > 0) {
      this.setData({
        'resetModel.phoneNumber': options.phoneNumber,
        'resetModel.authCode': options.authCode
      });
    } else {
      wx.redirectTo({
        url: 'resetPassowrd/resetPassowrd',
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
  onShareAppMessage: function (e) {

  },
  newPwdInput:function(e){
    this.setData({
      "resetModel.newPassword": e.detail,
    });

  },
  confirmPwdInput:function(e){
    this.setData({
      "resetModel.confirmPassword": e.detail,
    });
  },
  onCheckInput: function (e) {
    if (this.data.resetModel.newPassword.length == 0 || this.data.resetModel.confirmPassword.length == 0) {
      this.setData({
        disabled: true
      })
    } else {
      this.setData({
        disabled: false
      })
    }
  },
  submitResetPassword:function(){
    if (regCheck.checkPasswordReg(this.data.resetModel.newPassword)
      && regCheck.checkPasswordReg(this.data.resetModel.confirmPassword))
    {
      if (this.data.resetModel.newPassword == this.data.resetModel.confirmPassword) {
        var requestHelper = new RequestHelper(true);
        requestHelper.postRequest('/api/Account/ResetPassword',this.data.resetModel).then(res=>{
            if(res.data.success){
              
              wx.showToast({
                title: '修改成功',
                icon: "success",
                duration: 1500
              });
              setTimeout(() => {
                wx.navigateBack({
                  delta: 2
                })
              },1500)
            }else{
              wx.showToast({
                title: res.data.result.message,
                icon: "success",
                duration: 1500
              });
            }
        });
      }else{
        wx.showToast({
          title: '两次密码输入不相同',
          icon: "none",
          duration: 1500
        })
      }
    }
  }
})