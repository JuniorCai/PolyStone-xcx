import RequestHelper from "../utils/request.js";

var QQMapWX = require("../lib/qqmap-wx-jssdk1.0/qqmap-wx-jssdk.js");
var config = require("../utils/config.js");

class regionHelper {
  constructor(){
    this.qqMapSdk = new QQMapWX({
      key: config.qqMapSdkKey
    });
    this.region = null;
  }

  setRegionDatabase(){
    this._initialDataBase();
  }

  

  checkUserLocationAuthorization(){
    return new Promise((resolve,reject)=>{
      wx.getSetting({
        success: res => {
          if (!res.authSetting['scope.userLocation']) {
            wx.authorize({
              scope: 'scope.userLocation',
              success: (res) => {
                resolve(true);
              },fail:(res)=>{
                resolve(false);
              }
            })
          } else {
            resolve(true);
          }
        },
        fail: res => {
          reject();
        }
      })
    })    
  }

  getUserLocation(){
    var that = this;
    return new Promise((resolve,reject)=>{
      wx.getLocation({
        success: function (res) {
          var mapLocation = {
            latitude: res.latitude,
            longitude: res.longitude
          };

          that.qqMapSdk.reverseGeocoder({
            location: mapLocation,
            success: function (address) {
              resolve(true,address);
            },
            fail:function(res){
              resolve(false,null);
            }
          })
        },
        fail: function () {
          reject();
        }
      })
    })    
  }

  _initialDataBase(){
    let that = this;
    that.qqMapSdk.getCityList({
      success: function (list) {
        var provinceList = list.result[0];
        var cityList = list.result[1];
        var areaList = list.result[2];
        var requestHelper = new RequestHelper(true);

        // that._initialAreaList(cityList, areaList)


        // return ;
        provinceList.forEach(province=>{
          var region = {
            regionName:province.name,
            regionCode:province.id,
            parentCode:"156000000",
            fullName:province.fullname,
            isShow:true
          }
          requestHelper.postRequest('/api/services/app/region/CreateRegion', region).then(res => {
            if(res.data.success){
              var filterCityList = that._filterCityListByProvinceId(cityList, res.data.result.regionCode.substring(0,2));
              if(filterCityList.length>0){
                filterCityList.forEach(city => {
                  var cityRegion = {
                    regionName: city.name,
                    regionCode: city.id,
                    parentCode: res.data.result.regionCode,
                    fullName: city.fullname,
                    isShow: true
                  }
                  requestHelper.postRequest('/api/services/app/region/CreateRegion', cityRegion).then(cityRes => {
                    if (cityRes.data.success) {
                      var filterAreaList = that._filterAreaListByCityId(areaList, cityRes.data.result.regionCode.substring(0, 4));
                      if(filterAreaList.length>0){
                        filterAreaList.forEach(area => {
                          var areaRegion = {
                            regionName: area.fullname,
                            regionCode: area.id,
                            parentCode: cityRes.data.result.regionCode,
                            fullName: area.fullname,
                            isShow: true
                          }
                          requestHelper.postRequest('/api/services/app/region/CreateRegion', areaRegion).then(areaRes => {

                          })
                        })
                      } else {
                        var t = res.data.result;
                      }
                      
                    }
                  })
                })
              }else{
                var t = res.data.result;
              }
              
              
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
