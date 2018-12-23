import RequestHelper from "request.js";
var config = require("config.js")

class pagedHelper {
  constructor(pagedApi,pageSize) {
    this.requestHelper = new RequestHelper(true);
    this.requestUrl = pagedApi;
    this.filterInput = {};
    this.pageIndex = 1;
    this.result = {
      list:[]
    };
    this.maxResultCount = pageSize;//pagesize,为了与服务端参数匹配，所以用maxResultCount

  }

  getPagedData(pageIndex,filterInput){
    var that = this;
    return new Promise((resolve, reject)=>{
      var param = that.filterInput = filterInput;
      that.pageIndex = pageIndex;
      param.maxResultCount = that.maxResultCount;
      param.skipCount = (that.pageIndex - 1) * that.maxResultCount;
      that.requestHelper.postRequest(that.requestUrl, param).then(res => {
        if (res.data.success) {
          that.result.list = res.data.result.items;
          that.result.total = res.data.result.totalCount;
          that.result.pageIndex = that.pageIndex;
          that.result.maxResultCount = that.maxResultCount;
          resolve(that.result);
        } else {
          that.result.list = [];
          that.result.total = 0;
          that.result.pageIndex = that.pageIndex;
          that.result.maxResultCount = that.maxResultCount;
          reject(that.result);
        }
      });
    })    
  }
}


export default pagedHelper
