import UploadHelper from "../../utils/uploadHelper.js";

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
    imgFileList:[]
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
            // var uploadHelper = new UploadHelper(res.tempFiles);
            // uploadHelper.upload();


            var eventDetail = {thumbList:that.data.thumbList} 
            var eventOption = {} 
            that._triggerEvent("afteradd", eventDetail, eventOption);


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
      tempImgUrls.splice(deleteIndex, 1);
      this.setData({
        thumbList: tempImgUrls
      })

      var eventDetail = { thumbList: this.data.thumbList }
      var eventOption = {}
      this._triggerEvent("afterminus", eventDetail, eventOption);
    },
    _triggerEvent:function(eventName,eventDetail,eventOption){
      this.triggerEvent(eventName, eventDetail, eventOption)
    },
    _upload: function (tempFiles) {
      var tempServerPathList = this.data.thumbList.splice(0);
      var flagCount = tempFiles.length;
      for (var i = 0; i < tempFiles.length; i++) {
        if (this._checkFileSizeValid(tempFiles[i])) {
          this._uploadFile(tempFiles[i]).then(res=>{
            var info = JSON.parse(res.data);
            if (info.result.success) {
              flagCount--;
              tempServerPathList[i] = info.result.msg;
              tempFiles[i].success = true;
              tempFiles[i].serverPath = info.result.msg;
            } else {
              tempFiles[i].success = false;
              tempServerPathList[i] = "";
              tempFiles[i].msg = info.result.msg;
            }
            that.setData({ imgFileList: tempFiles,
              thumbList:tempServerPathList});
          },error=>{
            tempServerPathList[i] = "";
            tempFiles[i].success = false;
            tempFiles[i].msg = "未登录或未知错误";
            that.setData({ imgFileList: tempFiles ,thumbList: tempServerPathList});
          })
        } else {
          tempFiles[i].success = false;
          tempFiles[i].msg = "图片大小限制在1M以内";
          this.setData({ imgFileList: tempFiles});
        }
      }
      return;
    },
    _uploadFile: function (imgFile) {
      var that = this;
      var token = cache.getStorageSync('ticketToken');
      var bearerToken = 'Bearer ' + token;
      return new Promise(function(resolve,reject){
        //这个是使用微信接口保存文件到数据库 
        var uploadTask = wx.uploadFile({
          url: that.data.uploadRequestUrl,
          filePath: imgFile.path,
          name: 'file',
          header: {
            'Content-Type': 'application/json',
            'Authorization': bearerToken
          },
          success: function (res) {
            if (res.statusCode == 200) {
              resolve(res);
            } else {
              //未返回200处理
              if (res.statusCode == 401) {
                // Toast.loading({
                //   duration: 5000,
                //   mask: true,
                //   message: "没有相关操作权限"
                // })
              }
            }
          }, fail(res) {

          }
        });
      })     

      // uploadTask.onProgressUpdate((res) => {
      //   fileList[index].progress = res.progress;
      //   that.setData({ imgFileList: fileList });
      // })
    },
    _checkFileSizeValid: function (file) {
      if (file.size > config.uploadImgSizeLimit) {
        return false;
      }
      return true;
    }
  }  
})
