import RequestHelper from "../utils/request.js";
var QQMapWX = require("../lib/qqmap-wx-jssdk1.0/qqmap-wx-jssdk.js");
var config = require("../utils/config.js");

class regionHelper {
  constructor(){
    this.qqMapSdk = new QQMapWX({
      key: config.qqMapSdkKey
    })
  }

  setRegionDatabase(){
    this._initialDataBase();
  }

  _initialDataBase(){
    this.qqMapSdk.getCityList({
      success: function (list) {
        var provinceList = list.result[0];
        var cityList = list.result[1];
        var areaList = list.result[2];
        var requestHelper = new RequestHelper(true);

        provinceList.forEach(province=>{
          var region = {
            regionName:province.name,
            regionCode:province.id,
            parentCode:"156000000",
            fullName:province.fullname,
            isShow:true
          }
          requestHelper.postRequest('/api/services/app/region/CreateRegion', region).then(res => {
            if(res.data.result.id>0){
              var filterCityList = this._filterCityListByProvinceId(cityList, res.data.result.regionCode.substring(0,2));
              var cityRegion = {
                regionName: province.name,
                regionCode: province.id,
                parentCode: res.data.result.regionCode,
                fullName: province.fullname,
                isShow: true
              }
              requestHelper.postRequest('/api/services/app/region/CreateRegion', cityRegion).then(res => {
                if (res.data.result.id > 0) {

                }
              })
            }
          })
        })


      }
    });
  }

  _filterCityListByProvinceId(aimArray,idPrefix){
    return aimArray.filter(item => item.id.substring(0, 2) == idPrefix)
  }

  _filterAreaListByCityId(aimArray, idPrefix) {
    return aimArray.filter(item => item.id.substring(0, 4) == idPrefix)
  }

}

export default regionHelper
