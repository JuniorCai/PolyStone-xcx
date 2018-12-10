import RequestHelper from "../../../../utils/request.js";
import Toast from "../../../../customComponent/VantWeapp/toast/toast";

const app = getApp()


Page({

  /**
   * 页面的初始数据
   */
  data: {
    loadingHide: true,
    numberLimit:200,
    inputNumber:0,
    userInfo: {},
    region:{
      regionId:"",
      regionName:""
    },
    communityInfo:{},
    imgUrls:[],
    chooseCategory:{},
    chooseIndex:0,
    communityCategoryList:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.hasUserInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
      });
      var requestHelper = new RequestHelper(true);
      requestHelper.postRequest('/api/services/app/communityCategory/GetPagedCommunityCategorys', { filterText:""}).then(res => {
        if (res.data.success) {
          this.setData({
            communityCategoryList: res.data.result.items
          });
        }
      });


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
  chooseImg:function(){
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
          url: config.baseHost.requestHost + "/api/Resource/Upload",
          filePath: filePath,
          name: 'file',
          header: {
            'Content-Type': 'application/json',
            'Authorization': bearerToken
          },
          success: function (res) {
            if (res.statusCode == 200) {
              var info = JSON.parse(res.data);
              if (info.result.success) {
                that.setData({
                  "userInfo.avatar": info.result.msg, //把照片路径存到变量中， 
                });
                //提交保存
                var requestHelper = new RequestHelper(true);
                requestHelper.postRequest('/api/services/app/user/UpdateUser', that.data.userInfo).then(res => {
                  app.globalData.userInfo = that.data.userInfo;
                  app.globalData.isUserChange = true;
                });
              } else {
                Toast.loading({
                  duration: 5000,
                  mask: true,
                  message: info.result.msg
                })
              }
            } else {
              //未返回200处理
              if (res.statusCode == 401) {
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
  onInput:function(e){
    var detail = e.detail.value;
    var inputLength = detail.length;
    this.setData({ inputNumber: inputLength});
    if (inputLength>this.data.numberLimit){
      Toast("需求内容控制在200字符以内");
    }
  }
})