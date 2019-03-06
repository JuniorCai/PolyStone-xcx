// customComponent/Banner/banner-view.js
var config = require("../../utils/config.js")

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    interval:{
      type:Number,
      value:5000
    },
    duration:{
      type:Number,
      value:500
    },
    bannerList:{
      type:Array,
      value: ['/Content/uploadImg/20190303/1048a84ef9030234749a0b1da2932cd7.jpg',
      '/Content/uploadImg/20190303/033c4efe2b8505afc224b23c975b8cba.jpeg']
    }
    
  },

  /**
   * 组件的初始数据
   */
  data: {
    fileServer: config.baseHost.fileServer
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
