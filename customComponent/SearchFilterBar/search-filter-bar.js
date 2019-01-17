// customComponent/FilterBar/search-filter-Bar.js
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
            tempTab[i] = true;
            tempTabsList[i] = newVal[i].tabs;
            tempSelectedIndexList[i] = 0;
          }
          this.setData({ 
            tab: tempTab, 
            tabList: tempTabsList, 
            tabSelectedIndexList:tempSelectedIndexList
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
    // pinpaiList: [{ 'id': '1', 'title': '品牌1' }, { 'id': '1', 'title': '品牌1' }],
    // pinpai_id: 0,//品牌
    // pinpai_txt: '',
    // jiage_id: 0,//价格
    // jiage_txt: '',
    // xiaoliang_id: 0,//销量
    // xiaoliang_txt: '',
    searchValue:"",
    dataList: []

  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 选项卡
    filterTab: function (e) {
      var index = e.currentTarget.dataset.index;
      var tempTab = new Array(tabArray.length);
      for (var i = 0; i < tabArray.length; i++){
        tempTab[i] = !(index==i);
      }
      this.setData({
        tab: tempTab
      })
    },

    //筛选项点击操作
    filter: function (e) {
      var self = this;
      var tabItemId = e.currentTarget.dataset.id, 
      var tabItemTitle = e.currentTarget.dataset.title, 
      var tabIndex = e.currentTarget.dataset.index;
      var tabArray = this.data.tabArray;


      switch (e.currentTarget.dataset.index) {
        case '0':
          tabArray[0].title = title;
          self.setData({
            tab: [true, true, true],
            tabTxt: tabArray,
            pinpai_id: id,
            pinpai_txt: title
          });
          break;
        case '1':
          tabTxt[1] = title;
          self.setData({
            tab: [true, true, true],
            tabTxt: tabTxt,
            jiage_id: id,
            jiage_txt: title
          });
          break;
        case '2':
          tabTxt[2] = title;
          self.setData({
            tab: [true, true, true],
            tabTxt: tabTxt,
            xiaoliang_id: id,
            xiaoliang_txt: title
          });
          break;
      }
      //数据筛选
      self.getDataList();
    },

    onSearch:function(){

    },

    onCancel:function(){

    },
    //加载数据
    getDataList: function () {
      //调用数据接口，获取数据


    }
  }
})
