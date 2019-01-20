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
        title: '品牌',
        tabs: [{ 'id': '1', 'title': '品牌1' }, { 'id': '2', 'title': '品牌2' }]
      },
      {
        title:'价格',
        tabs: [{ 'id': '1', 'title': '58-88' }, { 'id': '2', 'title': '88-108' }, { 'id': '3', 'title': '108-188' }]
      },
      {
        title: '销量',
        tabs: [{ 'id': '1', 'title': '从高到低' }, { 'id': '2', 'title': '从低到高' }]
      }],//分类
    resultList: {},
  },

  onLoad: function (options) {
    var that = this;
    var param = {
      verifyStatus: 1,
      releaseStatus: 1
    };
    pageHelper = new PagedHelper('/api/services/app/community/GetPagedCommunitys', config.pageSizeType.centerPageSize);

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
  
  filterData:function(){

  },

  //加载数据
  getDataList: function () {
    //调用数据接口，获取数据


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
      releaseStatus:1
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

})