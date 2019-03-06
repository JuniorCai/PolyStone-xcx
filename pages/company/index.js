import RequestHelper from "../../utils/request.js";
import Toast from "../../customComponent/VantWeapp/toast/toast";
import PagedHelper from "../../utils/pagedHelper.js";
var config = require("../../utils/config.js")
var pageHelper = null;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    reload: false,
    refreshing: false,
    emptyFlag: false,
    userInfo: {},
    fileServer: config.baseHost.fileServer,
    tabTxt: [
      {
        title: '分类',
        key: 'CompanyCategoryId',
        tabs: [{ 'id': '1', 'title': '供应', 'value': '1' }, { 'id': '2', 'title': '求购', 'value': '2' }]
      },
      {
        title: '地区',
        key: 'RegionCode',
        tabs: [{ 'id': '1', 'title': '3天前', 'value': '3' }, { 'id': '2', 'title': '1周前', 'value': '7' }
          , { 'id': '3', 'title': '2周前', 'value': '14' }, { 'id': '4', 'title': '1个月前', 'value': '30' }]
      }],//分类
    resultList: {},
  },

  onLoad: function (options) {
    var that = this;
    var param = {
      verifyStatus: 1,
      releaseStatus: 1
    };
    pageHelper = new PagedHelper('/api/services/app/company/GetPagedCompanysWithProducts', config.pageSizeType.centerPageSize);

    this.getListData(param, 1);
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
    if (that.data.reload) {
      var param = {
        verifyStatus: 1,
        releaseStatus: 1
      };
      this.getListData(param, 1);

    }
  },

  filterData: function (e) {
    var that = this;
    var selectedList = e.detail.tabSelectedList;
    var searchContent = e.detail.searchContent;

    var params = { 'verifyStatus': 1, 'releaseStatus': 1, 'title': "" };
    selectedList.forEach(function (item, index) {
      var itemInt = parseInt(item);
      if (itemInt > 0) {
        var tabSelected = that.data.tabTxt[index];
        var filterValue = tabSelected.tabs[itemInt - 1];
        params[tabSelected.key] = filterValue.value;
      }
    });

    this.getListData(params, 1);

  },

  refreshList: function (e) {
    var param = {
      verifyStatus: 1,
      releaseStatus: 1
    };
    this.getListData(param, 1);
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
  loadMore: function (e) {
    var that = this;
    if (that.data.emptyFlag) {
      return;
    }

    var nextPageIndex = that.data.resultList.pageIndex + 1;
    var param = {
      verifyStatus: 1,
      releaseStatus: 1
    };
    pageHelper.getPagedData(nextPageIndex, param).then(res => {
      // var tempList = that.data.communityList.list.concat(res.list);
      // tempList.pageIndex = nextPageIndex;
      // this.setData({ colors: [...this.data.colors, ...colors] });
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
        loadingHide: true,
        resultList: error
      });
    })
  },
  onSearch: function (e) {
    var searchValue = e.detail.searchContent;
    var params = { 'verifyStatus': 1, 'releaseStatus': 1, 'title': searchValue };
    this.getListData(params, 1);
  },
  onCancel: function (e) {

  },
  showDetail:function(e){
    var companyId = e.currentTarget.dataset.companyid;;
    if(companyId>0){
      wx.navigateTo({
        url: '/pages/homePage/index?companyid='+companyId,
      })
    }
  }
})