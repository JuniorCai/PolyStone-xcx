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
    scrollTop:0,
    active:0,
    userInfo:{},
    blockType:["发布中","已下架"],
    communityList:{},
    refreshing: false,
    emptyFlag:false,
    fileServer: config.baseHost.fileServer 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    pageHelper = new PagedHelper('/api/services/app/community/GetPagedCommunitys', config.pageSizeType.centerPageSize);
    if (app.globalData.hasUserInfo) {
      that.setData({
        userInfo: app.globalData.userInfo,
      });
      var param = { 
        userId: that.data.userInfo.id, 
        verifyStatus: 1,
        releaseStatus: that.data.active==0?1:2
        };
      this.getListData(param, 1);
      
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
      this.getListData(param,1);
      
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
  onTabChange:function(e){
    this.setData({
      communityList: {},
      active:e.detail.index
    });
    var param = {
      userId: this.data.userInfo.id,
      verifyStatus: 1,
      releaseStatus: e.detail.index == 0 ? 1 : 2
    };
    this.getListData(param, 1);
  },
  refreshList:function(e){
    var param = {
      userId: this.data.userInfo.id,
      verifyStatus: 1,
      releaseStatus: this.data.active == 0 ? 1 : 2
    };
    this.getListData(param,1);
  },
  getListData:function(param,pageIndex){
    var that = this;
    that.setData({
      emptyFlag: false
    });
    // setTimeout(() => {
      
    // }, 1000)  
    
    pageHelper.getPagedData(pageIndex, param).then(res => {
      if(res.total==0){
        that.setData({
          communityList: {},
          refreshing: false,
          emptyFlag:true
        });
      } else if (res.list.length == res.total) {
        that.setData({
          communityList: res,
          refreshing: false,
          emptyFlag: true
        });
      }
      else{
        that.setData({
          communityList: res,
          refreshing: false
        });
      }
    }, error => {
      that.setData({
        refreshing: false,
        communityList: error,
        emptyFlag: true
      });
    })
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
      // var tempList = that.data.communityList.list.concat(res.list);
      // tempList.pageIndex = nextPageIndex;
      // this.setData({ colors: [...this.data.colors, ...colors] });
      that.setData({
        "communityList.list": [...this.data.communityList.list, ...res.list],
        "communityList.pageIndex":nextPageIndex
      });
      if (this.data.communityList.list.length==res.total){
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
    var that = this;
    var itemId = e.currentTarget.dataset.itemid;
    Toast.loading({
      mask:true,
      message:"操作中..."
    })

    var requestHelper = new RequestHelper(true);
    requestHelper.postRequest("/api/services/app/community/OffLineCommunity",{id:itemId}).then(res=>{
      var t = res;
      if(res.data.success){
        Toast.success({ duration:1500,message:"操作成功"});
        that.refreshList();
      }
    })
  },
  onLineCommunity:function(e){
    var that = this;
    var itemId = e.currentTarget.dataset.itemid;
    Toast.loading({
      mask: true,
      message: "操作中..."
    })

    var requestHelper = new RequestHelper(true);
    requestHelper.postRequest("/api/services/app/community/OnLineCommunity", { id: itemId }).then(res => {
      var t = res;
      if (res.data.success) {
        Toast.success({ duration: 1500, message: "操作成功" });
        that.refreshList();
      }
    })
  }
})