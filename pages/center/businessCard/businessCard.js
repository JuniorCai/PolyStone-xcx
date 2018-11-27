import Toast from "../../../customComponent/VantWeapp/toast/toast";
import Dialog from "../../../customComponent/VantWeapp/dialog/dialog";
import RequestHelper from "../../../utils/request.js";

var config = require("../../../utils/config.js") 

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{},
    hasUserInfo:false,
    phoneNumberMix:"",
    showNameDialog:false,
    showCompanyNameDialog:false,
    showPositionDialog:false,
    tempName:"",
    tempCompanyName:"",
    tempPosition:"",
    tempIntroduction:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (!this.data.hasUserInfo && app.globalData.hasUserInfo) {
      this.setData({
        hasUserInfo: app.globalData.hasUserInfo,
        userInfo: app.globalData.userInfo,
        phoneNumberMix: app.globalData.userInfo.phoneNumber.substr(0, 3) + "****" + app.globalData.userInfo.phoneNumber.substr(8, 4)
      });

    } else if (!this.data.hasUserInfo && !app.globalData.hasUserInfo) {
      wx.redirectTo({
        url: '../../account/login/login',
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
  onChangeName:function(){
    this.setData({
      showNameDialog: true
    })
  },
  onBindName:function(e){
    this.setData({ tempName: e.detail });
  },
  onNameClose: function () {
    this.setData({ showNameDialog: false });
  },
  onNameConfirm:function(){
    
    var that = this;
    if (that.data.tempName.trim()==""){
      Toast.loading({
        duration: 5000,
        mask: true,
        message: "未填写用户姓名"
      })
      return;
    }
    var tempUser = that.data.userInfo;
    tempUser.name = that.data.tempName.trim();
    var requestHelper = new RequestHelper(true);
    requestHelper.setErrorHandler(this.requestRrrorHandler);
    requestHelper.postRequest('/api/services/app/user/UpdateUser', tempUser).then(res => {
      if(res.data.success){
        that.setData({userInfo:tempUser});
        app.reloadUserInfo();
        this.setData({ showNameDialog: false });
        //Toast.success("保存成功");
      }else{
        Toast.loading({
          duration: 1500,
          mask: true,
          message: "保存失败"
        })
      }
    });
  },
  requestRrrorHandler:function(res){
    if(res.statusCode==401){
      wx.navigateTo({
        url: '../../account/login/login',
      })
    }
  }
})