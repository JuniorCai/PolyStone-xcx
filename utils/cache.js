function setStorageSync(key,value,periodMin){
  var periodTimeStamp = periodMin * 60 * 1000;
  var periodKey = key+"_Expiration";
  var nowTimeStamp = new Date().getTime();
  var periodValue = nowTimeStamp + periodTimeStamp;

  wx.setStorageSync(key, value);
  wx.setStorageSync(periodKey, periodValue)
}

function getStorageSync(key) {
  var nowTimeStamp = new Date().getTime();
  var periodKey = key + "_Expiration";
  var periodValue = wx.getStorageSync(periodKey);
  if (periodValue != null && periodValue != "" && periodValue < nowTimeStamp) {
    return wx.getStorageSync(key);
  } else {
    return "";
  }
}

function getStorage(key){
  var nowTimeStamp = new Date().getTime();
  var periodKey = key + "_Expiration";
  var periodValue = wx.getStorage(periodKey);
  if (periodValue!=null&&periodValue != "" && periodValue<nowTimeStamp){
    return wx.getStorage(key);
  }else{
    return "";
  }
}

function setStorage(key, value, periodMin) {
  var periodTimeStamp = periodMin * 60 * 1000;
  var periodKey = key + "_Expiration";
  var nowTimeStamp = new Date().getTime();
  var periodValue = nowTimeStamp + periodTimeStamp;

  wx.setStorage(key, value);
  wx.setStorage(periodKey, periodValue)
}

module.exports.setStorage = setStorage
module.exports.setStorageSync = setStorageSync
module.exports.getStorage = setStorage
module.exports.getStorageSync = setStorageSync