import RequestHelper from "../../../../utils/request.js";
import Toast from "../../../../customComponent/VantWeapp/toast/toast";

const app = getApp()


// pages/center/communities/list/list.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    reload:false,
    active:0,
    userInfo:{},
    blockType:["发布中","已下架"],
    communityList:[],
    loadingHide:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if (app.globalData.hasUserInfo) {
      that.setData({
        userInfo: app.globalData.userInfo,
      });
      var param = { 
        userId: that.data.userInfo.id, 
        verifyStatus: 1,
        releaseStatus: that.data.active==0?1:2
        };
      var requestHelper = new RequestHelper(true);
      requestHelper.postRequest('/api/services/app/community/GetPagedCommunitys', param).then(res => {
        if (res.data.success) {
          that.setData({
            loadingHide: false,
            communityList: res.data.result.items
          });
        }
      });
    } else if (!this.data.hasUserInfo && !app.globalData.hasUserInfo) {
      wx.redirectTo({
        url: '../../../account/login/login',
      })
    }
    that.setData({ loadingHide: false });
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
    var that = this;
    if (that.data.reload){
      var param = {
        userId: that.data.userInfo.id,
        verifyStatus: 1,
        releaseStatus: that.data.active == 0 ? 1 : 2
      };
      var requestHelper = new RequestHelper(true);
      requestHelper.postRequest('/api/services/app/community/GetPagedCommunitys', param).then(res => {
        if (res.data.success) {
          that.setData({
            loadingHide: false,
            communityList: res.data.result.items,
            reload:false
          });
        }
      });
    }
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
  showDetial:function(e){
    var itemId = e.currentTarget.dataset.itemid;
    wx.navigateTo({
      url: '../publish/index?itemId='+itemId,
    });
  },
  offLineCommunity:function(e){

  }
})