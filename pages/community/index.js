// pages/community/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabTxt: [
      { 
        title: '品牌',
        tabs: [{ 'id': '1', 'title': '品牌1' }, { 'id': '2', 'title': '品牌2' }]
      },
      {
        title:'价格',
        tabs: [{ 'id': '1', 'title': '58-88' }, { 'id': '2', 'title': '88-108' }, { 'id': '3', 'title': '108-188' }]
      },
      {
        title: '销量',
        tabs: [{ 'id': '1', 'title': '从高到低' }, { 'id': '2', 'title': '从低到高' }]
      }],//分类
    tab: [true, true, true],
    dataList: [
      {
        goods_id: 1,
        goods_title: '商品标题1',
        goods_img: 'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
        goods_xiaoliang: '0',
        goods_price: '60'
      }, {
        goods_id: 1,
        goods_title: '商品标题2',
        goods_img: 'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
        goods_xiaoliang: '0',
        goods_price: '70'
      }, {
        goods_id: 1,
        goods_title: '商品标题3',
        goods_img: 'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
        goods_xiaoliang: '0',
        goods_price: '80'
      }, {
        goods_id: 1,
        goods_title: '商品标题4',
        goods_img: 'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
        goods_xiaoliang: '0',
        goods_price: '90'
      }, {
        goods_id: 1,
        goods_title: '商品标题5',
        goods_img: 'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
        goods_xiaoliang: '0',
        goods_price: '110'
      }
    ],
  },

  // 选项卡
  filterTab: function (e) {
    var data = [true, true, true], index = e.currentTarget.dataset.index;
    data[index] = !this.data.tab[index];
    this.setData({
      tab: data
    })
  },

  //筛选项点击操作
  filter: function (e) {
    var self = this, id = e.currentTarget.dataset.id, txt = e.currentTarget.dataset.txt, tabTxt = this.data.tabTxt;
    switch (e.currentTarget.dataset.index) {
      case '0':
        tabTxt[0] = txt;
        self.setData({
          tab: [true, true, true],
          tabTxt: tabTxt,
          pinpai_id: id,
          pinpai_txt: txt
        });
        break;
      case '1':
        tabTxt[1] = txt;
        self.setData({
          tab: [true, true, true],
          tabTxt: tabTxt,
          jiage_id: id,
          jiage_txt: txt
        });
        break;
      case '2':
        tabTxt[2] = txt;
        self.setData({
          tab: [true, true, true],
          tabTxt: tabTxt,
          xiaoliang_id: id,
          xiaoliang_txt: txt
        });
        break;
    }
    //数据筛选
    self.getDataList();
  },

  //加载数据
  getDataList: function () {
    //调用数据接口，获取数据


  }

})