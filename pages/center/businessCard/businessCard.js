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
    businessCard:{},
    hasUserInfo:false,
    phoneNumberMix:"",
    showNameDialog:false,
    showCompanyNameDialog:false,
    showPositionDialog:false,
    showWxDialog:false,
    tempName:"",
    tempWxNumber:"",
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
      var requestHelper = new RequestHelper(true);
      requestHelper.postRequest('/api/services/app/businessCard/GetBusinessCardByUserId?userId='+this.data.userInfo.id,"").then(res=>{
        if(res.data.success){
          this.setData({
            businessCard:res.data.result
          });
        }
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
  },
  postSubmit:function(cardModel){
    var that = this;
    return new Promise((resolve,reject)=>{
      var requestHelper = new RequestHelper(true);
      requestHelper.setErrorHandler(this.requestRrrorHandler);
      requestHelper.postRequest('/api/services/app/businessCard/UpdateBusinessCard', cardModel).then(res => {
        if (res.data.success) {
          that.setData({ businessCard: cardModel });
          resolve(true);
          //Toast.success("保存成功");
        } else {
          Toast.loading({
            duration: 1500,
            mask: true,
            message: "保存失败"
          })
        }
      });
    });
    
  },
  onChangeCompanyName: function () {
    this.setData({
      showCompanyNameDialog: true
    })
  },
  onBindCompanyName: function (e) {
    this.setData({ tempCompanyName: e.detail });
  },
  onCompanyNameClose: function () {
    this.setData({ showCompanyNameDialog: false });
  },
  onCompanyNameConfirm:function(){
    var that = this;
    if (that.data.tempCompanyName.trim() == "") {
      Toast.loading({
        duration: 1500,
        mask: true,
        message: "未填写企业名称"
      })
      return;
    }
    var tempCard = that.data.businessCard;
    tempCard.companyName = that.data.tempCompanyName.trim();
    this.postSubmit(tempCard).then(res=>{
      if(res)
        this.setData({ showNameDialog: false });
    })
  },
  onChangePosition: function () {
    this.setData({
      showPositionDialog: true
    })
  },
  onBindPosition: function (e) {
    this.setData({ tempPosition: e.detail });
  },
  onPositionClose: function () {
    this.setData({ showPositionDialog: false });
  },
  onPositionConfirm:function(){
    var that = this;
    if (that.data.tempPosition.trim() == "") {
      Toast.loading({
        duration: 1500,
        mask: true,
        message: "未填写职位名称"
      })
      return;
    }
    var tempCard = that.data.businessCard;
    tempCard.position = that.data.tempPosition.trim();
    this.postSubmit(tempCard).then(res => {
      if (res)
        this.setData({ showPositionDialog: false });
    })
  },
  onChangeWx: function () {
    this.setData({
      showWxDialog: true
    })
  },
  onBindWx: function (e) {
    this.setData({ tempWxNumber: e.detail });
  },
  onWxClose: function () {
    this.setData({ showWxDialog: false });
  },
  onWxConfirm:function(){
    var that = this;
    if (that.data.tempWxNumber.trim() == "") {
      Toast.loading({
        duration: 1500,
        mask: true,
        message: "未填写职位名称"
      })
      return;
    }
    var tempCard = that.data.businessCard;
    tempCard.wxNumber = that.data.tempWxNumber.trim();
    this.postSubmit(tempCard).then(res => {
      if (res)
        this.setData({ showWxDialog: false });
    })
  }
})