var config = require("/config.js") 
var cache = require("/cache.js") 

/**
 * description: request处理基础类
 */
class request {
  constructor(isIncludeBearer) {
    if (isIncludeBearer){
      this._header = this._getBearerHeader();
    }else{
      this._header = {
        'Content-Type': 'application/json',
      };
    }
    this._errorHandler = this.defaultErrorHandler;
  }

  _getBearerHeader(){
    var token = cache.getStorageSync('ticketToken');
    var bearerToken = 'Bearer ' + token;
    return {
      'Content-Type': 'application/json',
      'Authorization': bearerToken
    }
  }


  defaultErrorHandler(res) {
    if (res.statusCode == 401) {
      wx.showToast({ title: "未登录或登录信息已过期，请重新登录" ,icon:"none"})

      setTimeout(()=>{
        wx.navigateTo({
          url: 'pages/account/login/login',
        })
      },1500)
      
    }
  }
  /**
   * 设置统一的异常处理
   */
  setErrorHandler(handler) {
    this._errorHandler = handler;
  }

  /**
   * GET类型的网络请求
   */
  getRequest(requestUrl, data, header = this._header) {
    return this.requestAll(requestUrl, data, header, 'GET')
  }

  /**
   * POST类型的网络请求
   */
  postRequest(requestUrl, data, header = this._header) {
    return this.requestAll(requestUrl, data, header, 'POST')
  }

  /**
   * 网络请求
   */
  requestAll(requestUrl, data, header, method) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: config.baseHost.requestHost + requestUrl,
        data: data,
        header: header,
        method: method,
        success: (res => {
          if (res.statusCode === 200) {
            //200: 服务端业务处理正常结束
            resolve(res)
          } else {
            //其它错误，提示用户错误信息
            if (this._errorHandler != null) {
              //如果有统一的异常处理，就先调用统一异常处理函数对异常进行处理
              this._errorHandler(res)
            }
            reject(res)
          }
        }),
        fail: (res => {
          if (this._errorHandler != null) {
            this._errorHandler(res)
          }else{
            defaultErrorHandler(res);
          }
          //reject(res)
        })
      })
    })
  }
}

export default request


// function PostRequestWithBearer(isIncludeBearer){
//   var token = "";
//   if (isIncludeBearer){
//     token = wx.getStorageSync('ticketToken');
//     if(token==""){
//       return ;
//     }
//   }

//   wx.request({
//     url: config.requestHost + '/api/services/app/user/UpdateUser',
//     data: that.data.userInfo,
//     method: 'POST',
//     header: { 'content-type': 'application/json' },
//     success: function (result) {
      
//     }
//   })
// }