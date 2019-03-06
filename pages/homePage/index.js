import RequestHelper from "../../utils/request.js";
import Toast from "../../customComponent/VantWeapp/toast/toast";
import PagedHelper from "../../utils/pagedHelper.js";
var config = require("../../utils/config.js")
var pageHelper = null;
const app = getApp()


Page({

  /**
   * 页面的初始数据
   */
  data: {
    loginUser:null,
    companyId:0,
    company: null,
    banners:[],
    productList:[],
    communityList:[],
    contact: null,
    collectTimes:0,
    viewTimes:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.hasUserInfo && app.globalData.userInfo) {
      this.setData({
        loginUser: app.globalData.userInfo
      })
    }
    if(options.companyid>0){
      this.setData({
        companyId: options.companyid
      })
      this.bindCompanyInfo();
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

  bindCompanyInfo:function(){
    var self = this;
    var requestHelper = new RequestHelper(false);
    var param = { id: this.data.companyId};
    requestHelper.postRequest('/api/services/app/company/GetCompanyById', param).then(res => {
      if(res.data.result){
        var companyBanners = res.data.result.split(',');
        self.setData({ company: res.data.result, banners: companyBanners });
      }
    });
  }
})