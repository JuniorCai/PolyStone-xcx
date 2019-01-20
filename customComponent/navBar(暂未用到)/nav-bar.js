//var sliderWidth = 125; // 需要设置slider的宽度，用于计算中间位置
// customComponent/navBar/nav-bar.js
Component({
  options:{
    multipleSlots: true
  },
  /**
   * 组件的属性列表
   */
  properties: {
    tabs:{
      type:Array,
      value: ["选项一", "选项二", "选项三"]
    },
    activeIndex:{
      type:Number,
      value:1
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    sliderOffset: 0,
    sliderLeft: 0,
    sliderWidth:0
  },
  ready(){
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        var tempSliderWitdh = res.windowWidth / that.data.tabs.length;
        that.setData({
          sliderWidth: tempSliderWitdh,
          sliderLeft: (res.windowWidth / that.data.tabs.length - tempSliderWitdh) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
  },


  /**
   * 组件的方法列表
   */
  methods: {
    onLoad(){
      
    },
    tabClick: function (e) {
      this.setData({
        sliderOffset: e.currentTarget.offsetLeft,
        activeIndex: e.currentTarget.id
      });
      var eventDetail = { activeIndex: this.data.activeIndex }
      var eventOption = {}
      this._triggerEvent("changeTab", eventDetail, eventOption);
    
    },
    _triggerEvent: function (eventName, eventDetail, eventOption) {
      this.triggerEvent(eventName, eventDetail, eventOption)
    },
  }
})
