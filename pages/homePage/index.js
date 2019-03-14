import RequestHelper from "../../utils/request.js";
import Toast from "../../customComponent/VantWeapp/toast/toast";
import PagedHelper from "../../utils/pagedHelper.js";
var config = require("../../utils/config.js")
var productPageHelper = null;
var communityPageHelper = null;
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
    productList: null,
    communityList: null,
    contact: null,
    collectTimes:0,
    viewTimes:0,
    selectedIndex:0,
    fileServer: config.baseHost.fileServer,
    scrollTop: 0,
    scrollHeight: 0,
    active: 0,
    productEmptyFlag:false,
    communityEmptyFlag:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var self = this;
    productPageHelper = new PagedHelper('/api/services/app/product/GetPagedProducts', config.pageSizeType.centerPageSize);
    communityPageHelper = new PagedHelper('/api/services/app/community/GetPagedCommunitys', config.pageSizeType.centerPageSize);

    wx.getSystemInfo({
      success: function (res) {
        console.info(res.windowHeight);
        self.setData({
          scrollHeight: res.windowHeight
        });
      }
    });

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
      this.bindCompanyProducts();
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
        var companyBanners = res.data.result.banners == null ? [] : res.data.result.banners.split(',');
        self.setData({ company: res.data.result, banners: companyBanners });
      }
    });
  },
  bindCompanyProducts:function(){
    var self = this;
    var params = {
      companyId: self.data.companyId,
      verifyStatus: 1,
      releaseStatus: 1
    };

    self.getPagedProducts(1,params);
  },
  onChange:function(e){
    var self = this;
    var chooseIndex = e.detail.index;

    self.setData({ selectedIndex: chooseIndex });
    switch(chooseIndex){
      case 0:
        if (self.data.productList == null){
          var params = {
            companyId: self.data.companyId,
            verifyStatus: 1,
            releaseStatus: 1
          };
          self.getPagedProducts(1,params);
        }
      break;
      case 1:
        if (self.data.communityList == null) {
          var params = {
            userId: self.data.company.user.id,
            verifyStatus: 1,
            releaseStatus: 1
          };
          self.getPagedCommunities(1, params);
        }
      break;
      default:
      break;
    }
  },
  getPagedProducts:function(pageIndex,params){
    var self = this;
    productPageHelper.getPagedData(pageIndex, params).then(res => {
      if (res.total == 0) {
        self.setData({
          productList: {},
          productEmptyFlag: true
        });
      } else if (res.list.length == res.total) {
        self.setData({
          productList: res,
          productEmptyFlag: true
        });
      }
      else {
        self.setData({
          productList: res,
        });
      }
    }, error => {
      self.setData({
        productList: error,
        productEmptyFlag: true
      });
    })
  },
  getPagedCommunities: function (pageIndex, params) {
    var self = this;
    communityPageHelper.getPagedData(pageIndex, params).then(res => {
      if (res.total == 0) {
        self.setData({
          communityList: {},
          communityEmptyFlag: true
        });
      } else if (res.list.length == res.total) {
        self.setData({
          communityList: res,
          communityEmptyFlag: true
        });
      }
      else {
        self.setData({
          communityList: res,
        });
      }
    }, error => {
      self.setData({
        communityList: error,
        communityEmptyFlag: true
      });
    })
  },
  loadMore:function(e){
    var self = this;
    var chooseIndex = e.currentTarget.dataset.selectedindex;

    switch (chooseIndex) {
      case 0:
        var nextPageIndex = self.data.productList.pageIndex + 1;

        var params = {
          companyId: self.data.companyId,
          verifyStatus: 1,
          releaseStatus: 1
        };
        productPageHelper.getPagedData(nextPageIndex, params).then(res => {
          self.setData({
            "productList.list": [...self.data.productList.list, ...res.list],
            "productList.pageIndex": nextPageIndex
          });
          if (self.data.productList.list.length == res.total) {
            self.setData({
              productEmptyFlag: true
            });
            
          }
        }, error => {
          self.setData({
            productList: error
          });
        })
        break;
      case 1:
        var nextPageIndex = self.data.communityList.pageIndex + 1;
        var params = {
          userId: self.data.company.user.id,
          verifyStatus: 1,
          releaseStatus: 1
        };
        communityPageHelper.getPagedData(nextPageIndex, params).then(res => {
          self.setData({
            "communityList.list": [...self.data.communityList.list, ...res.list],
            "communityList.pageIndex": nextPageIndex
          });
          if (self.data.communityList.list.length == res.total) {
            self.setData({
              communityEmptyFlag: true
            });
          }
        }, error => {
          self.setData({
            communityList: error
          });
        })
        break;
      default:
        break;
    }
  }
})