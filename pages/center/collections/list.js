import Toast from "../../../customComponent/VantWeapp/toast/toast";
import RequestHelper from "../../../utils/request.js";
import Dialog from '../../../customComponent/VantWeapp/dialog/dialog';
var config = require("../../../utils/config.js")

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
     active:0,
     loadingHide:true,
     userInfo:{},
     moduleList:{},
     resultList:{
       index:0,
       items:{}
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;

    if (app.globalData.hasUserInfo) {
      var requestHelper = new RequestHelper(true);
      that.setData({
        userInfo: app.globalData.userInfo
      });
      requestHelper.postRequest('/api/services/app/module/GetPagedModules', { isActive: true }).then(res => {
        if (res.data.result.totalCount > 0) {
          that.setData({
            moduleList: res.data.result.items
          });
          var initialModule = res.data.result.items[that.data.active];
          var params = { 
            userId: that.data.userInfo.id,
            moduleId: initialModule.id
          }
          that.setData({ loadingHide:false});
          requestHelper.postRequest('/api/services/app/collection/GetPagedCollections', params).then(res=>{
              if(res.data.result.totalCount>0){
                that.setData({
                  "resultList.index": initialModule.id,
                  "resultList.items":res.data.result.items
                })
              }else{
                that.setData({
                  resultList: {}
                })
              }
            that.setData({ loadingHide: true });

          });
        }
      });
    } else {
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
  onTabChange:function(e){
    var that = this;
    that.setData({
      active: e.detail.index,
      loadingHide: false
    });
    var changeModule = that.data.moduleList[e.detail.index];
    var params = {
      userId: that.data.userInfo.id,
      moduleId: changeModule.id
    }
    var requestHelper = new RequestHelper(true);
    requestHelper.postRequest('/api/services/app/collection/GetPagedCollections', params).then(res => {
      that.setData({ loadingHide: true });
      if (res.data.result.totalCount > 0) {
        that.setData({
          "resultList.index": changeModule.id,
          "resultList.items": res.data.result.items
        })
      } else {
        that.setData({
          resultList: {}
        })
      }
    });
  },
  onDeleteCell:function(e){
    var detail = e.detail;
    var that = this;
    switch(detail.position){
      case 'right':
        var index = detail.instance.dataset.index;
        var item = this.data.resultList.items[index];
        that.postDeleteCollection(index,item.id);
        detail.instance.close();
        break;
    }
  },
  postDeleteCollection:function(index,collectionId){
    var that = this;
    var tempList = this.data.resultList.items;
    var requestHelper = new RequestHelper(true);
    requestHelper.postRequest('/api/services/app/collection/DeleteCollection', { id: collectionId}).then(res => {
      if (res.data.result) {
        tempList.splice(index, 1);
        that.setData({
          "resultList.items": tempList
        });
      }
      
    });
  }
})