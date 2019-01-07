import RequestHelper from "../../../../utils/request.js";
import Toast from "../../../../customComponent/VantWeapp/toast/toast";
import PagedHelper from "../../../../utils/pagedHelper.js";
var config = require("../../../../utils/config.js")

const app = getApp();
var pageHelper = null;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    reload:false,
    scrollTop:-36,
    scrollHeight:0,
    active:0,
    userInfo:{},
    blockType:["发布中","已下架"],
    communityList:{},
    loadingHide:false,
    emptyFlag:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    pageHelper = new PagedHelper('/api/services/app/community/GetPagedCommunitys', config.pageSizeType.centerPageSize);
    if (app.globalData.hasUserInfo) {
      wx.getSystemInfo({
        success: function (res) {
          that.setData({
            scrollHeight: res.windowHeight+36
          });
        }
      });
      
      that.setData({
        userInfo: app.globalData.userInfo,
      });
      var param = { 
        userId: that.data.userInfo.id, 
        verifyStatus: 1,
        releaseStatus: that.data.active==0?1:2
        };
      
      pageHelper.getPagedData(1,param).then(res=>{
        that.setData({
          loadingHide: true,
          communityList: res
        });
      },error=>{
        that.setData({
          loadingHide: true,
          communityList: error
        });
      })
      
      // var requestHelper = new RequestHelper(true);
      // requestHelper.postRequest('/api/services/app/community/GetPagedCommunitys', param).then(res => {
      //   if (res.data.success) {
      //     that.setData({
      //       loadingHide: true,
      //       communityList: res.data.result.items
      //     });
      //   }
      // });
    } else if (!this.data.hasUserInfo && !app.globalData.hasUserInfo) {
      wx.redirectTo({
        url: '../../../account/login/login',
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
    var that = this;
    if (that.data.reload){
      var param = {
        userId: that.data.userInfo.id,
        verifyStatus: 1,
        releaseStatus: that.data.active == 0 ? 1 : 2
      };
      pageHelper.getPagedData(1, param).then(res => {
        that.setData({
          loadingHide: true,
          communityList: res
        });
      }, error => {
        that.setData({
          loadingHide: true,
          communityList: error
        });
      })
      // var requestHelper = new RequestHelper(true);
      // requestHelper.postRequest('/api/services/app/community/GetPagedCommunitys', param).then(res => {
      //   if (res.data.success) {
      //     that.setData({
      //       loadingHide: true,
      //       communityList: res.data.result.items,
      //       reload:false
      //     });
      //   }
      // });
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
  onPageScroll:function(e){
    this.setData({
      scrollTop: e.detail.scrollTop
    });
  },
  refreshList:function(e){
    var that = this;
    that.setData({
      loadingHide: false,
      emptyFlag: false
    });
    setTimeout(()=>{
      var param = {
        userId: that.data.userInfo.id,
        verifyStatus: 1,
        releaseStatus: that.data.active == 0 ? 1 : 2
      };
      pageHelper.getPagedData(1, param).then(res => {
        that.setData({
          loadingHide: true,
          communityList: res
        });
      }, error => {
        that.setData({
          loadingHide: true,
          communityList: error
        });
      })
      // var requestHelper = new RequestHelper(true);
      // requestHelper.postRequest('/api/services/app/community/GetPagedCommunitys', param).then(res => {
      //   if (res.data.success) {
      //     that.setData({
      //       loadingHide: true,
      //       communityList: res.data.result.items,
      //       reload: false
      //     });
      //   }
      // });
    },300)    
  },
  loadMore:function(e){
    var that = this;
    if (that.data.emptyFlag) {
      return;
    }

    var nextPageIndex = that.data.communityList.pageIndex + 1;
    var param = {
      userId: that.data.userInfo.id,
      verifyStatus: 1,
      releaseStatus: that.data.active == 0 ? 1 : 2
    };
    pageHelper.getPagedData(nextPageIndex, param).then(res => {
      var tempList = that.data.communityList.list.concat(res.list);
      tempList.pageIndex = nextPageIndex;

      that.setData({
        loadingHide: true,
        "communityList.list": tempList,
        "communityList.pageIndex":nextPageIndex
      });
      if(tempList.length==res.total){
        that.setData({
          emptyFlag: true
        });
      }
    }, error => {
      that.setData({
        loadingHide: true,
        communityList: error
      });
    })
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