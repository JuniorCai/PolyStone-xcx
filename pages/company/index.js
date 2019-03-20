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
    searchValue:"",
    reload: false,
    refreshing: false,
    emptyFlag: false,
    userInfo: {},
    fileServer: config.baseHost.fileServer,
    tabTxt: [
      ],//分类
    resultList: {},
  },

  onLoad: function (options) {
    var that = this;
    var param = {
      isAuthed: 1,
      isActive: 1,
      companyName: ""
    };
    pageHelper = new PagedHelper('/api/services/app/company/GetPagedCompanysWithProducts', config.pageSizeType.centerPageSize);

    this.getListData(param, 1);
    this.getCompanyIndustryList();
    this.getRegionProvinceList();
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
    // var that = this;
    // if (that.data.reload) {
    //   var param = {
    //     isAuthed: 1,
    //     isActive: 1,
    //     companyName: ""
    //   };
    //   this.getListData(param, 1);

    // }
  },
  getCompanyIndustryList:function(){
    var self = this;
    var tabTxtIndustry = { title: "行业", key: "IndustryId", tabs: [] };
    var tabArray = [];

    app.getIndustryList().then(res=>{
      var list = res;
      list.forEach(function (item, index) {
        var tabObj = { id: (index + 1), title: item.industryName, value: item.id };
        tabArray.push(tabObj);
      });
      tabTxtIndustry.tabs = tabArray;
      self.data.tabTxt.push(tabTxtIndustry);
    });
    
    //在地区方法里进行赋值，避免重复赋值造成数据无法使用的问题
    // var obj = this.selectComponent("#searchBar");
    // obj.setData({ tabArray: self.data.tabTxt});   
  },
  getRegionProvinceList:function(){
    var self = this;
    var tabTxtRegion = { title: "地区", key: "RegionParentCode", tabs: [] };
    var tabArray = [];

    app.getRegionList().then(res=>{
      var regionList = res;
      regionList.forEach(function (item, index) {
        var tabObj = { id: (index + 1), title: item.regionName, value: item.regionCode };
        tabArray.push(tabObj);
      });
      tabTxtRegion.tabs = tabArray;
      self.data.tabTxt.push(tabTxtRegion);
      var obj = this.selectComponent("#searchBar");
      obj.setData({ tabArray: JSON.parse(JSON.stringify(self.data.tabTxt)) });   
    });
    
  },
  filterData: function (e) {
    var that = this;
    var selectedList = e.detail.tabSelectedList;
    var searchContent = e.detail.searchContent;
    that.setData({ searchValue: searchContent });
    
    var params = { 'isAuthed': 1, 'isActive': 1, 'companyName': "" };
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
      isAuthed: 1, 
      isActive: 1,
      companyName: this.data.searchValue
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
      isAuthed: 1,
      isActive: 1,
      companyName: that.data.searchValue
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
    this.setData({ searchValue: searchValue});
    var params = { 'isAuthed': 1, 'isActive': 1, 'companyName': searchValue };
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