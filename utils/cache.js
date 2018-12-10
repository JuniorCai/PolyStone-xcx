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
  if (periodValue == undefined) {
    return "";
  }
  if (periodValue != null && periodValue != "" && periodValue >= nowTimeStamp) {
    return wx.getStorageSync(key);
  } else {
    wx.removeStorageSync(key)
    return "";
  }
}


module.exports.setStorageSync = setStorageSync
module.exports.getStorageSync = getStorageSync