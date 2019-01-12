import Toast from "../../../customComponent/VantWeapp/toast/toast";
import RequestHelper from "../../../utils/request.js";
import PagedHelper from "../../../utils/pagedHelper.js";
import Dialog from '../../../customComponent/VantWeapp/dialog/dialog';
var config = require("../../../utils/config.js");
const app = getApp()
var pageHelper = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active:0,
    scrollTop: 0,
    userInfo:{},
    moduleList:{},
    resultList:{},
    refreshing: false,
    emptyFlag: false,
    fileServer: config.baseHost.fileServer 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    pageHelper = new PagedHelper('/api/services/app/collection/GetPagedCollections', config.pageSizeType.centerPageSize);
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
          this.getListData(params,1);
          
          // requestHelper.postRequest('/api/services/app/collection/GetPagedCollections', params).then(res=>{
          //     if(res.data.result.totalCount>0){
          //       that.setData({
          //         "resultList.index": initialModule.id,
          //         "resultList.items":res.data.result.items
          //       })
          //     }else{
          //       that.setData({
          //         resultList: {}
          //       })
          //     }

          // });
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
  onPageScroll: function (e) {
    this.setData({
      scrollTop: e.detail.scrollTop
    });
  },
  onTabChange:function(e){
    var that = this;
    that.setData({
      resultList: {},
      active: e.detail.index,
    });
    var changeModule = that.data.moduleList[e.detail.index];
    var params = {
      userId: that.data.userInfo.id,
      moduleId: changeModule.id
    }
    this.getListData(params,1);
    // var requestHelper = new RequestHelper(true);
    // requestHelper.postRequest('/api/services/app/collection/GetPagedCollections', params).then(res => {
    //   if (res.data.result.totalCount > 0) {
    //     that.setData({
    //       "resultList.index": changeModule.id,
    //       "resultList.items": res.data.result.items
    //     })
    //   } else {
    //     that.setData({
    //       resultList: {}
    //     })
    //   }
    // });
  },
  refreshList: function (e) {
    var chooseModule = this.data.moduleList[this.data.active];

    var param = {
      userId: this.data.userInfo.id,
      moduleId: chooseModule.id
    };
    this.getListData(param, 1);
  },
  loadMore: function (e) {
    var that = this;
    if (that.data.emptyFlag) {
      return;
    }

    var chooseModule = that.data.moduleList[this.data.active];
    var nextPageIndex = that.data.resultList.pageIndex + 1;
    var param = {
      userId: that.data.userInfo.id,
      moduleId: chooseModule.id
    };
    pageHelper.getPagedData(nextPageIndex, param).then(res => {
      that.setData({
        "resultList.list": [...this.data.resultList.list, ...res.list],
        "resultList.pageIndex": nextPageIndex
      });
      if (this.data.resultList.list.length == res.total) {
        that.setData({
          emptyFlag: true
        });
      }
    }, error => {
      that.setData({
        resultList: error
      });
    })
  },
  getListData: function (param, pageIndex) {
    var that = this;
    that.setData({
      emptyFlag: false
    });
    // setTimeout(() => {

    // }, 1000)  

    pageHelper.getPagedData(pageIndex, param).then(res => {
      if (res.total == 0) {
        that.setData({
          resultList: {},
          refreshing: false,
          emptyFlag: true
        });
      } else if (res.list.length == res.total) {
        that.setData({
          resultList: res,
          refreshing: false,
          emptyFlag: true
        });
      }
      else {
        that.setData({
          resultList: res,
          refreshing: false
        });
      }
    }, error => {
      that.setData({
        refreshing: false,
        resultList: error,
        emptyFlag: true
      });
    })
  },
  requestErrorHandler:function(res){
    if (res.statusCode === 401){
      wx.redirectTo({
        url: '../../account/login/login',
      })
    }else{
      Toast.fail("程序未知错误");
    }
  },
  onDeleteCell:function(e){
    var detail = e.detail;
    var that = this;
    switch(detail.position){
      case 'right':
        var index = detail.instance.dataset.index;
        var item = this.data.resultList.list[index];
        that.postDeleteCollection(index,item.id);
        detail.instance.close();
        break;
    }
  },
  postDeleteCollection:function(index,collectionId){
    var that = this;
    var tempList = this.data.resultList.list;
    var requestHelper = new RequestHelper(true);
    requestHelper.postRequest('/api/services/app/collection/DeleteCollection', { id: collectionId}).then(res => {
      if (res.data.result) {
        Toast.success({ duration: 1500, message: "操作成功" });
        this.refreshList();
        // tempList.splice(index, 1);
        // //if(tempList.length)
        // that.setData({
        //   "resultList.list": tempList
        // });
      }
      
    });
  }
})