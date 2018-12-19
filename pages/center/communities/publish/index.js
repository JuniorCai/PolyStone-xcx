import RequestHelper from "../../../../utils/request.js";
import RegionHelper from "../../../../utils/regionHelper.js";

import Toast from "../../../../customComponent/VantWeapp/toast/toast";
var QQMapWX = require("../../../../lib/qqmap-wx-jssdk1.0/qqmap-wx-jssdk.js");
var qqMapSdk;
var cache = require("../../../../utils/cache.js");
var config = require("../../../../utils/config.js");

const app = getApp()


Page({

  /**
   * 页面的初始数据
   */
  data: {
    loadingHide: true,
    uploadBtnHide:false,
    numberLimit:200,
    inputNumber:0,
    userInfo: {},
    region:{
      id:"",
      regionCode:"",
      parentCode:"",
      fullName:""
    },
    communityInfo:{
      userId:0,
      communityCategoryId:0,
      title:"",
      imgUrls:"",
      detail:""
    },
    imgUrls:[],
    chooseCategory:null,
    chooseIndex:0,
    communityCategoryList:{},
    uploadImgComonentObj:{}
  },
  requestRrrorHandler: function (res) {
    if (res.statusCode == 401) {
      wx.navigateTo({
        url: '../../../account/login/login',
      })
    }
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
      requestHelper.setErrorHandler(this.requestRrrorHandler);
      requestHelper.postRequest('/api/services/app/communityCategory/GetPagedCommunityCategorys', { filterText:""}).then(res => {
        if (res.data.success) {
          this.setData({
            communityCategoryList: res.data.result.items
          });
        }
      });
      //获取地理位置
      this.getUserLocationRegionInfo();

    } else if (!this.data.hasUserInfo && !app.globalData.hasUserInfo) {
      wx.redirectTo({
        url: '../../../account/login/login',
      })
    }
  },
  getUserLocationRegionInfo:function(){
    var regionHelper = new RegionHelper();
    
    regionHelper.checkUserLocationAuthorization().then((authRes) => {
      if (authRes) {
        regionHelper.getUserLocation().then((success, address) => {
          if (success) {
            var t = address;
          } else {
            Toast.fail("地理位置解析失败");
          }
        }, () => {
          Toast.fail("获取地理位置失败");
        })
      } else {
        Toast("小程序需要获取地理位置以便更好的提供服务");
        this.setData({
          region: null
        })
      }
    },
      (failedRes) => {
        Toast.fail("用户权限信息获取失败");
        this.setData({
          region: null
        })
      })    
  },
  

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var obj = this.selectComponent("#uploadImg");
    this.setData({ uploadImgComonentObj: obj});
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
  onInput:function(e){
    var detail = e.detail.value;
    var inputLength = detail.length;
    if (inputLength>this.data.numberLimit){
      Toast("需求内容控制在200字符以内");
      detail = detail.subString(0,this.data.numberLimit);
    }
    this.setData({ inputNumber: detail.length }); 
    this.setData({ "communityInfo.detail": detail });
  },
  onAfterChange:function(event){
    var imgList = event.detail.thumbList;
    this.setData({ imgUrls:imgList});
  },
  chooseCategory:function(e){
    var index = e.detail.value;
    var category = this.data.communityCategoryList[index];
    this.setData({
      chooseCategory:category
    })
  },
  submitCommunity:function(e){

    if (this.checkDetail() && this.checkUploadImg() && this.checkCommunityCategory()){
      //提交表单
      this.setData({
        "communityInfo.userId": this.data.userInfo.id
      })
      var requestHelper = new RequestHelper(true);
      var paramData = { communityEditDto: this.data.communityInfo };
      requestHelper.postRequest('/api/services/app/community/CreateOrUpdateCommunity', paramData).then(res => {
        if (res.data.success) {
          Toast.success("发布成功");
          setTimeout(()=>{
            wx.navigateBack({
              delta:-1
            })
          },1500);
        }
      })
    }
    
  },
  checkDetail:function(){
    if(this.data.communityInfo.detail.length==0){
      Toast("未填写发布内容");
      return false;
    }
    return true;
  },
  checkUploadImg:function(){
    var uploadResult = this.data.uploadImgComonentObj.getUploadResult();
    if (!uploadResult.uploadFlag) {
      Toast("等待图片上传完成");
      return false;
    } else if (uploadResult.errors.length > 0) {
      var err = uploadResult.errors.join(';');
      Toast(err);
      return false;
    }
    this.setData({
      "communityInfo.imgUrls": uploadResult.uploadFileServerPaths.join(',')
    });
    return true;
  },
  checkCommunityCategory:function(){
    if(this.data.chooseCategory!=null){
      this.setData({
        "communityInfo.communityCategoryId": this.data.chooseCategory.id,
      });

      return true;
    }else{
      Toast("未选择发布类别");
      return false;
    }
  }
})