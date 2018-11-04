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
  },
  getUserInfo:function(){
    var app = this;
    var token = wx.getStorageSync('ticketToken');
    return new Promise(function (resolve, reject) {
      if(token.length>0){
        var bearerToken = 'Bearer ' + token;
          wx.request({
            url: 'http://localhost:6234/api/Account/GetCurrentUserInfo',
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
  globalData: {
    userInfo: null,
    hasUserInfo:false
  }
})