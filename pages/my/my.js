var util = require('../../utils/util.js');  
const app = getApp()

Page({



  /**
   * 页面的初始数据
   */
  data: {
    record_latitude: 29.594978,
    record_longitude: 106.302773,
    range_value: 1000,
    number_value: 3,
    latitude: 29.594978,
    longitude: 106.302773,
    marker: [{
      iconPath: "target.png",
      id: 0,
      latitude: 29.594978,
      longitude: 106.302773,
      width: 30,
      height: 30
    }],
    circle: [{
      id: 0,
      latitude: 29.594978,
      longitude: 106.302773,
      radius: 1000,
      strokeWidth: 2,
      fillColor: "#FFFF00AA",
      color: "#00000005"
    }],
    controls: [{
      id: 0,
      iconPath: 'temp.png',
      position: {
        left: wx.getSystemInfoSync().windowWidth / 2 - 20,
        top: wx.getSystemInfoSync().windowHeight * 0.3 - 20,
        width: 40,
        height: 40
      },
      clickable: false
    }]
  },

  //点击之后切换经纬度
  changePosition: function () {
    var that = this
    this.mapCtx = wx.createMapContext('map')

    this.mapCtx.getCenterLocation({
      success: function (res) {
        var marker_longitude = "marker[" + 0 + "].longitude";
        var marker_latitude = "marker[" + 0 + "].latitude";
        var circle_longitude = "circle[" + 0 + "].longitude";
        var circle_latitude = "circle[" + 0 + "].latitude";
        that.setData({

          record_latitude: res.latitude,
          record_longitude: res.longitude,

          [marker_longitude]: res.longitude,
          [marker_latitude]: res.latitude,
          [circle_longitude]: res.longitude,
          [circle_latitude]: res.latitude
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  //获取随机数
  getRandom:function(start, end){
    var length = end - start +1;
    var num = parseInt(Math.random() * (length) + end);
    return num;
  },



  //获取当前时间
  getNowTime:function(){
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var day = now.getDate();
    if(month < 10) {
      month = '0' + month;
    };
    if(day < 10) {
      day = '0' + day;
    };
    var formatDate = year + '-' + month + '-' + day;
    return formatDate;
  },

  //确认修改信息按钮
  change: function () {
    //console.log("查看有哪些值" + this.data.record_latitude);

    //刷新签到点的颜色
    for (var i = 0; i < 3; i++) {                //从第一个点到第三个点
      wx.setStorage({
        key: 'arrive' + i,
        data: false,
      })
    }

    var objData = this.data;
    var time = this.getNowTime();

    //生成随机点位的算法
    var la = this.data.record_latitude;             //纬度la
    var lo = this.data.record_longitude;           //经度lo
    var r = this.data.range_value;                 //半径
    var n = this.data.number_value;                //签到点个数
    var temp = 360/n;
    var points_latitude = new Array(n);
    var points_longitude = new Array(n);

    //在n个区域里分别循环
    for(var i=0; i<n;i++){
      var temp_r = this.getRandom(r*2/3,r*5/6);             //随机到圆心的距离
      var temp_theta = this.getRandom(temp * i, temp * (i + 1)) * 0.017453293;  //随机角度
      var temp_x = temp_r * Math.sin(temp_theta);           //获取x
      var temp_y = temp_r * Math.cos(temp_theta);           //获取y
      points_latitude[i] = la + temp_y / (111319.5555*2.0);       //计算出纬度
      points_longitude[i] = lo + temp_x / (111319.5555*Math.cos(la)*3.0);   //计算出经度
    }


    wx.setStorage({
      key: 'task',
      data: {
        "latitude": this.data.record_latitude,
        "longitude": this.data.record_longitude,
        "range": this.data.range_value,
        "number": this.data.number_value,
        "Date":time,
        "points_latitude":points_latitude,
        "points_longitude": points_longitude
      }
    });

    wx.showToast({
      title: '修改任务！',
      duration: 500
    })

  },

  rangeListener: function (e) {
    //获取滑动后的值
    //console.log(e.detail.value);
    var range = "circle[" + 0 + "].radius";
    this.setData({
      [range]: e.detail.value,
      range_value: e.detail.value
    })
  },

  numberListener: function (e) {
    //获取滑动后的值
    //console.log(e.detail.value);
    this.setData({
      number_value: e.detail.value
    })
  },

  
})