import RequestHelper from "/utils/request.js";

var config = require("/utils/config.js");
var cache = require("/utils/cache.js");

//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)

    // // 登录
    // wx.login({
    //   success: res => {
    //     // 发送 res.code 到后台换取 openId, sessionKey, unionId
    //   }
    // })
    // // 获取用户信息
    // wx.getSetting({
    //   success: res => {
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    //       wx.getUserInfo({
    //         success: res => {
    //           // 可以将 res 发送给后台解码出 unionId
    //           this.globalData.userInfo = res.userInfo

    //           // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //           // 所以此处加入 callback 以防止这种情况
    //           if (this.userInfoReadyCallback) {
    //             this.userInfoReadyCallback(res)
    //           }
    //         }
    //       })
    //     }
    //   }
    // })


    wx.getSetting({
      success:res=>{
        if (!res.authSetting['scope.userLocation']) {
          wx.authorize({
            scope: 'scope.userLocation',
            success:(res)=>{
              //不做处理，只为了获取授权，为详细页面做准备
            }
          })
        }
      }
    })
    this.cacheRegionList();
    this.cacheIndustryList();
  },
  cacheIndustryList:function(){
    var requestHelper = new RequestHelper(false);
    requestHelper.postRequest("/api/services/app/industry/GetPagedIndustrys", { isActive: 1, isShow: 1 }).then(res => {
      if (res.data.success) {
        var r = res.data.result;
        cache.setStorageSync("IndustryList", res.data.result.items,360);
      }
      return null;
    })
  },
  cacheRegionList:function(){
    var requestHelper = new RequestHelper(false);
    requestHelper.postRequest("/api/services/app/region/GetPagedRegions", {}).then(res => {
      if (res.data.success) {
        var r = res.data.result;
        cache.setStorageSync("RegionList", res.data.result.items, 360);
      }
      return null;
    })
  },
  getUserInfo:function(){
    var app = this;
    //var token = wx.getStorageSync('ticketToken');
    var token = cache.getStorageSync('ticketToken')
    return new Promise(function (resolve, reject) {
      if(token.length>0){
        var bearerToken = 'Bearer ' + token;
          wx.request({
            url: config.baseHost.requestHost + '/api/Account/GetCurrentUserInfo',
            data: "",
            method: "GET",
            header: {
              'Content-Type': 'application/json',
              'Authorization': bearerToken
            },
            success: function (info) {
              if(info.data.success){
                app.globalData.userInfo = info.data.result;
                app.globalData.hasUserInfo = true;
                app.globalData.isUserChange = true;

                resolve(true);
              }else{
                resolve(false);
              }
            },
            fail:function(info){
              reject(false);
            }
        })  
      }
    })
  },
  reloadUserInfo:function(){
    this.getUserInfo();
  },
  
  globalData: {
    userInfo: null,
    hasUserInfo:false,
    isUserChange:false
  }//,Request:new request()
})