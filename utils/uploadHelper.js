import RequestHelper from "request.js";
var cache = require("cache.js")
var config = require("config.js")
class uploadHelper {
  constructor(imgFileList) {
    this.thumbList = imgFileList;
    this.uploadRequestUrl = config.baseHost.requestHost + "/api/Resource/Upload";
  }

  upload(){
    for (var i = 0; i < this.thumbList.length; i++) {
      if (this._checkFileSizeValid(this.thumbList[i])){
        this._uploadFile(this.thumbList[i]);
      }else{
        this.thumbList[i].success=false;
        this.thumbList[i].msg="图片大小限制在1M以内";
      }
    }
    return ;
  }

  _uploadFile(file){
    var that = this;
    var token = cache.getStorageSync('ticketToken');
    var bearerToken = 'Bearer ' + token;
    //这个是使用微信接口保存文件到数据库 
    var uploadTask = wx.uploadFile({
      url: that.uploadRequestUrl,
      filePath: file.path,
      name: 'file',
      header: {
        'Content-Type': 'application/json',
        'Authorization': bearerToken
      },
      success: function (res) {
        if (res.statusCode == 200) {
          var info = JSON.parse(res.data);
          if (info.result.success) {
            file.success = true;
            file.serverPath = info.result.msg;
          } else {
            file.success = false;
            file.msg = info.result.msg;
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
      },fail(res){

      }      
    });

    uploadTask.onProgressUpdate((res)=>{

    })
  }

  _checkFileSizeValid(file){
    if (file.size > config.uploadImgSizeLimit)
    {
      return false;
    }
    return true;
  }
}
export default uploadHelper
