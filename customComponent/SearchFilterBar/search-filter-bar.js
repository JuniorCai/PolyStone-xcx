
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tabArray: {//分类[object1:{info,tabs1:[]},object2:{info,tabs2:[]}]
      type: Array,
      value: [],
      observer(newVal, oldVal, changedPath) {
        if(newVal.length>0){
          var tempTabVisible = new Array(newVal.length);
          var tempTabsList = new Array(newVal.length);
          var tempSelectedIndexList = new Array(newVal.length);

          for(var i=0;i<newVal.length;i++){
            tempTabVisible[i] = true;
            tempTabsList[i] = newVal[i].tabs;
            tempSelectedIndexList[i] = 0;
          }
          this.setData({ 
            tab: tempTabVisible, 
            tabList: tempTabsList, 
            tabSelectedIndexList:tempSelectedIndexList,
            originalTabArray: JSON.parse(JSON.stringify(newVal))
          });
        }
      }
    },
    tab: {//分类显示控制
      type: Array,
      value: []
    },
    tabList: {//对应大筛选项的小筛选项数组
      type: Array,
      value: []
    },
    tabSelectedIndexList: {//对应大筛选项中选中小筛选项的索引数组
      type:Array,
      value:[]
    },
    searchValue:{
      type:String,
      value:""
    },
    dataList: {
      type:Array,
      value: []
    },
    placeHolderStr:{
      type:String,
      value:"请输入搜索关键词"
    }

  },

  /**
   * 组件的初始数据
   */
  data: {
    originalTabArray:[]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    initTabVisible:function(){
      var tempTabArray = this.data.tabArray;
      var tempTab = new Array(tempTabArray.length);
      for (var i = 0; i < tempTabArray.length; i++) {
        tempTab[i] = true;
      }
      this.setData({
        tab: tempTab
      })
    },

    // 选项卡
    filterTab: function (e) {
      var index = e.currentTarget.dataset.index;
      var tempTab = new Array(this.data.tabArray.length);
      for (var i = 0; i < this.data.tabArray.length; i++){
        tempTab[i] = !(index==i);
      }
      this.setData({
        tab: tempTab
      })
    },

    //筛选项点击操作
    filter: function (e) {
      var self = this;
      var tabItemId = parseInt(e.currentTarget.dataset.id);
      var tabIndex = e.currentTarget.dataset.index;
      var tabItemTitle = "";
      var tabArray = this.data.tabArray;
      var tabSelectedList = this.data.tabSelectedIndexList;
      //判断是否重复点击
      if (tabSelectedList[tabIndex] == tabItemId){
        self.initTabVisible();
        return ;
      }

      if(tabItemId>0){
        tabItemTitle = e.currentTarget.dataset.title;
      }else{
        tabItemTitle = e.currentTarget.dataset.original;
      }

      tabArray[tabIndex].title = tabItemTitle;
      tabSelectedList[tabIndex] = tabItemId;

      self.initTabVisible();
      self.setData({
        tabArray:tabArray,
        tabSelectedIndexList:tabSelectedList,
        searchValue:""
      });

      
      //数据筛选
      var eventDetail = { searchContent: "", tabSelectedList: this.data.tabSelectedIndexList }
      var eventOption = {}
      this._triggerEvent("filterData", eventDetail, eventOption);
    },

    _triggerEvent: function (eventName, eventDetail, eventOption) {
      this.triggerEvent(eventName, eventDetail, eventOption)
    },

    onChange:function(e){
      var self = this;
      self.setData({
        searchValue: e.detail
      });
    },
    onSearch:function(e){
      var self = this;
      var tempTabSelectedIndexList = new Array(self.data.originalTabArray.length);
      for (var i = 0; i < tempTabSelectedIndexList.length; i++){
        tempTabSelectedIndexList[i] = 0;
      }
      self.setData({
        tabArray: JSON.parse(JSON.stringify(self.data.originalTabArray)),
        tabSelectedIndexList: tempTabSelectedIndexList
      });
      //数据筛选
      var eventDetail = { searchContent: this.data.searchValue, tabSelectedList: this.data.tabSelectedIndexList }
      var eventOption = {}
      this._triggerEvent("search", eventDetail, eventOption);
    },

    onCancel:function(){

    }
  }
})
