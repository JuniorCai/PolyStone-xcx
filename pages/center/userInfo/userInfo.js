import Toast from "../../../customComponent/VantWeapp/toast/toast";
import Dialog from "../../../customComponent/VantWeapp/dialog/dialog"
var config = require("../../../utils/config.js") 

const app = getApp()

// pages/center/UserInfo/userInfo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasUserInfo: false,
    userInfo: {},
    phoneNumberMix:"",
    showChangeNickName:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    if (!this.data.hasUserInfo && app.globalData.hasUserInfo) {
      this.setData({
        hasUserInfo: app.globalData.hasUserInfo,
        userInfo: app.globalData.userInfo,
        phoneNumberMix: app.globalData.userInfo.phoneNumber.substr(0, 3) + "****" + app.globalData.userInfo.phoneNumber.substr(8, 4)
      });

    }else{
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
  chooseAvatar:function(){
    var that = this; 
    wx.chooseImage({
      count: 1, 
      success: function (res) { // 无论用户是从相册选择还是直接用相机拍摄，路径都是在这里面 

        var filePath = res.tempFilePaths[0]; //将刚才选的照片/拍的 放到下面view视图中 
        that.setData({ 
          "userInfo.avatar": filePath, //把照片路径存到变量中， 
        }); 
        var token = wx.getStorageSync('ticketToken');
        var bearerToken = 'Bearer ' + token;

        // 这个是使用微信接口保存文件到数据库 
        wx.uploadFile({ 
          url: config.requestHost+"/api/Resource/Upload", 
          filePath: filePath, 
          name: 'file',
          header: {
            'Content-Type': 'application/json',
            'Authorization': bearerToken
          },
          success: function (res) { 
            if(res.statusCode==200){
              var info = JSON.parse(res.data);
              if (info.result.success) {
                that.setData({
                  "userInfo.avatar": info.result.msg, //把照片路径存到变量中， 
                });
                //提交保存
                wx.request({
                  url: config.requestHost + '/api/services/app/user/UpdateUser',
                  data: that.data.userInfo,
                  method: 'POST',
                  header: {
                    'Content-Type': 'application/json',
                    'Authorization': bearerToken
                  },
                  success: function (result) {
                    app.globalData.userInfo = that.data.userInfo;
                    app.globalData.isUserChange = true;

                  }
                })
              } else {

              }
            }else{
              //未返回200处理
              if (res.statusCode == 401){
                Toast.loading({
                  duration: 5000,
                  mask: true,
                  message: "没有相关操作权限"
                })
              }
            }
            } 
          }) 
        }, 
        fail: function (error) { 
          console.error("调用本地相册文件时出错");
          console.warn(error) 
        },
        complete: function () {
          
        }
    });

  },
  onChangeNickName:function(){
    this.setData({ showChangeNickName:true});
  },
  onClose:function(){
    this.setData({ showChangeNickName: false });
  },
  onBindNickName:function(e){
    this.setData({ "userInfo.nickName": e.detail });
  },
  onConfirm:function(event){
    var that = this;
    //提交服务器更改信息
    var token = wx.getStorageSync('ticketToken');
    var bearerToken = 'Bearer ' + token;
    wx.request({
      url: config.requestHost + '/api/services/app/user/UpdateUser',
      data: that.data.userInfo,
      method: "POST",
      header: {
        'Content-Type': 'application/json',
        'Authorization': bearerToken
      },
      success: function (info) {
        //更改本地昵称信息

        app.globalData.userInfo = that.data.userInfo;
        app.globalData.isUserChange = true;
        wx.showToast({
          title: "修改完成",
          icon: 'none',
          duration: 1500
        })
        that.setData({ showChangeNickName: false });

      },
      fail: function (info) {
      }
    })  

    //关闭弹窗
  }
})