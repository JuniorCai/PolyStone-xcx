import UploadHelper from "../../utils/uploadHelper.js";
import Toast from "../../customComponent/VantWeapp/toast/toast";
var config = require("../../utils/config.js");
var cache = require("../../utils/cache.js");
Component({
  

  properties: {
    addBtnHide: {
      type:Boolean,
      value: false
    },
    thumbList: {
      type: Array,
      value: [],
      observer(newVal, oldVal, changedPath) {
        var thumbLength = newVal.length;
        if (thumbLength >= 6) {
          this.setData({ addBtnHide: true})
        } else {
          this.setData({
            addBtnHide: false,
          });
        }
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    uploadRequestUrl: config.baseHost.requestHost + "/api/Resource/Upload",
    imgFileList:[],
    fileServer: config.baseHost.fileServer
  },

  
  ready() {
    if (this.data.thumbList.length > 0) {
      var tempThumbList = this.data.thumbList;
      var t = this.data.imgFileList;
      var tempFileList = [];

      for (var index in tempThumbList) {
        var tempFile = {
          success: true,
          serverPath: tempThumbList[index],
          uploadFlag: true
        }
        tempFileList.push(tempFile);
      }
      this.setData({ imgFileList: tempFileList });
    }
  },
  

  /**
   * 组件的方法列表
   */
  methods: {
    

    _chooseImg(e){
      var that = this;
      wx.chooseImage({
        count: config.communityUploadImgLimit,
        success: function (res) { // 无论用户是从相册选择还是直接用相机拍摄，路径都是在这里面 
          if (res.tempFilePaths.length > 0) {
            var filePaths = res.tempFilePaths; //将刚才选的照片/拍的 放到下面view视图中 
            var files = res.tempFiles;
            var tempImgUrls = that.data.thumbList.concat(filePaths);
            var tempFiles = that.data.imgFileList.concat(files);

            if(tempImgUrls.length>6){
              var tempLength = tempImgUrls.length;
              tempImgUrls.splice(6, tempLength-6);
              tempFiles.splice(6, tempLength - 6);
            }
            that.setData({
              thumbList: tempImgUrls, //把照片路径存到变量中， 
              imgFileList: tempFiles
            });

            that._upload(tempFiles);
          }

        },
        fail: function (error) {
          console.error("调用本地相册文件时出错");
          console.warn(error)
        },
        complete: function () {

        }
      });
    },
    _onDeleteThumb: function (e) {
      var deleteIndex = e.currentTarget.dataset.thumbindex;
      var tempImgUrls = this.data.thumbList.splice(0);
      var tempFileList = this.data.imgFileList.splice(0);
      tempImgUrls.splice(deleteIndex, 1);
      tempFileList.splice(deleteIndex,1);
      this.setData({
        thumbList: tempImgUrls,
        imgFileList:tempFileList
      })

      var eventDetail = { thumbList: this.data.thumbList }
      var eventOption = {}
      this._triggerEvent("afterminus", eventDetail, eventOption);
    },
    _triggerEvent:function(eventName,eventDetail,eventOption){
      this.triggerEvent(eventName, eventDetail, eventOption)
    },
    _upload: function (tempFiles) {
      var that = this;
      var tempServerPathList = that.data.thumbList.concat();
      for (var i = 0; i < tempFiles.length; i++) {
        if (!tempFiles[i].uploadFlag){
          if (that._checkFileSizeValid(tempFiles[i])) {
            that._uploadFile(tempFiles, tempServerPathList, i);
          } else {
            tempServerPathList[i] = "";
            tempFiles[i].success = false;
            tempFiles[i].uploadFlag = true;
            tempFiles[i].msg = "图片大小限制在1M以内";
            that.setData({ imgFileList: tempFiles, thumbList: tempServerPathList });
          }
        }        
      }
    },
    _uploadFile: function (fileList,serverPathList,index) {
      var that = this;
      var token = cache.getStorageSync('ticketToken');
      var bearerToken = 'Bearer ' + token;
      
      //这个是使用微信接口保存文件到数据库 
      var uploadTask = wx.uploadFile({
        url: that.data.uploadRequestUrl,
        filePath: fileList[index].path,
        name: 'file',
        header: {
          'Content-Type': 'application/json',
          'Authorization': bearerToken
        },
        success: function (res) {
          fileList[index].uploadFlag = true;
          if (res.statusCode == 200) {
            var info = JSON.parse(res.data);
            if (info.result.success) {
              serverPathList[index] = info.result.msg;
              fileList[index].success = true;
              fileList[index].serverPath = info.result.msg;
            } else {
              fileList[index].success = false;
              serverPathList[index] = "";
              fileList[index].msg = info.result.msg;
            }
            that.setData({
              imgFileList: fileList,
              thumbList: serverPathList
            });
          } else {
            //未返回200处理
            serverPathList[index] = "";
            fileList[index].success = false;
            fileList[index].msg = "未登录或未知错误";
            that.setData({ imgFileList: tempFiles, thumbList: serverPathList });
          }
        }, fail(res) {

        }
      });  

      // uploadTask.onProgressUpdate((res) => {
      //   fileList[index].progress = res.progress;
      //   that.setData({ imgFileList: fileList });
      // })
    },
    _checkFileSizeValid: function (file) {
      if (config.uploadImgSizeLimit > 0 && file.size > config.uploadImgSizeLimit) {
        return false;
      }
      return true;
    },
    getUploadResult(){
      var uploadResult={};
      var errors=[];
      var uploadFlag = true;
      var uploadFileList = this.data.imgFileList.concat();
      if (uploadFileList.length>0){
        for (var index in uploadFileList) {
          var item = uploadFileList[index];
          if (!item.uploadFlag) {
            uploadFlag = false;
          } else if (!item.success) {
            errors.push(index + item.msg);
          }
        }
      }else{
        errors.push("未上传图片");
      }
      
      uploadResult.uploadFlag = uploadFlag;
      uploadResult.uploadFiles = uploadFileList;
      uploadResult.uploadFileServerPaths = this.data.thumbList.concat();
      uploadResult.errors = errors;
      return uploadResult;
    }
  }  
})
