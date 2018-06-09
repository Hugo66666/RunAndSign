//index.js
//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageWidth: wx.getSystemInfoSync().windowWidth,
    imageHeight: wx.getSystemInfoSync().windowHeight,

    range_value: 1000,                  //跑步半径
    number_value: 3,                    //签到点个数
    r_value: 1000 / 6,                     //签到点范围
    latitude: 29.594978,                //跑步中心 纬度
    longitude: 106.302773,              //跑步中心 经度
    points_latitude: [],                 //签到点中心 纬度
    points_longitude: [],                //签到点中心 经度
    date: "2018-5-10",                   //日期


    controls: [
      {
        id: 3,
        iconPath: './target.jpg',
        position: {
          left: 300,
          top: 20,
          width: 40,
          height: 40
        },
        clickable: true
      },
      {
        id: 1,
        iconPath: './happy.png',
        position: {
          left: wx.getSystemInfoSync().windowWidth / 2 - 60,
          top: wx.getSystemInfoSync().windowHeight - 100,
          width: 120,
          height: 100
        },
        clickable: true
      }
    ],

    markers: [{
      iconPath: "./temp.png",
      id: 0,
      latitude: 29.5050,
      longitude: 106.4156,
      width: 35,
      height: 35
    }],

    circles: [{
      id: 0,
      latitude: 31.3950,
      longitude: 106.2156,
      radius: 200,
      strokeWidth: 2,
      fillColor: "#FFFF00AA",
      color: "#00000032",
      arrive: false
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function (e) {
    //使用wx.createMapContext获取map上下文
    this.mapCtx = wx.createMapContext('map')
    this.mapCtx.moveToLocation()
    var that = this

    this.mapCtx.getCenterLocation({
      success: function (res) {
        var markers_longitude = "markers[" + 0 + "].longitude";
        var markers_latitude = "markers[" + 0 + "].latitude";
        that.setData({
          markers_longitude: res.longitude,
          markers_latitude: res.latitude
        })
      }
    })
  },

  /**
   * 获取位置
   * */
  getCenterLocation: function () {
    var that = this
    this.mapCtx.getCenterLocation({
      success: function (res) {
        var markers_longitude = "markers[" + 0 + "].longitude";
        var markers_latitude = "markers[" + 0 + "].latitude";
        that.setData({
          markers_longitude: res.longitude,
          markers_latitude: res.latitude
        })
        console.log(res.longitude)
      }
    })
  },

  /**
   * 移动位置
   */
  moveToLocation: function () {
    this.mapCtx.moveToLocation()
  },



  controltap(e) {
    var that = this;
    //console.log("scale===" + this.data.scale)
    if (e.controlId === 3) {
      //回到手机当前定位
      this.moveToLocation()

    } else
      //点击以后判断是否签到成功
      if (e.controlId === 1) {
        this.mapCtx.moveToLocation()

        var user_latitude;      //纬度
        var user_longitude;     //经度
        //先获取地理位置
        wx.getLocation({
          success: function (res) {
            user_latitude = parseFloat(res.latitude);
            user_longitude = parseFloat(res.longitude);

            //判断是否在点内
            var judge = false;
            for (var i = 0; i < that.data.number_value; i++) {

              //console.log("user_latitude：" + user_latitude);
              // console.log("points_latitude[" + i + "]：" + parseFloat(that.data.points_latitude[i]));
              console.log(i);
              console.log("相减la" + Math.abs(user_latitude - parseFloat(that.data.points_latitude[i])));
              console.log("距离差la：" + Math.abs(that.data.r_value / (111319.5555)));
              console.log("相减lo" + Math.abs(user_longitude - parseFloat(that.data.points_longitude[i])));
              console.log("距离差lo：" + Math.abs(that.data.r_value / (111319.5555 * Math.cos(that.data.points_latitude[i]))));


              if (
                Math.abs(user_latitude - parseFloat(that.data.points_latitude[i])) <= Math.abs(that.data.r_value * 2 / (111319.5555))//纵坐标小于一定数值
                &&
                Math.abs(user_longitude - parseFloat(that.data.points_longitude[i])) <= Math.abs(that.data.r_value * 2 / (111319.5555 * Math.cos(that.data.points_latitude[i])))  //纵坐标小于一定数值
              ) {
                console.log('第' + i + "个成功")
                //1.提示签到成功
                wx.showToast({
                  title: '签到已成功！',
                  duration: 500
                })
                //2.将已经签到的点变成红色
                var red = "circles[" + i + "].fillColor";
                that.setData({
                  [red]: "#FF7F00AA"
                })
                judge = true;
                //3.记录成功签到的点
                wx.setStorage({
                  key: 'arrive' + i,
                  data: true,
                })

              }
            }
            //4.判断今天是不是完成全部跑步
            var if_complete = true;       //用一个变量记录是否跑完
            var count=0;
            wx.getStorage({               //用count获取到当前完成的天数，如果没有记录就创建一个
              key: 'count',
              success: function (res) {
                count = res.data;
              },
              fail: function () {
                wx.setStorage({
                  key: 'count',
                  data: 0,
                })
                count = 0;
              }
            })

            for (var i = 0; i < that.data.number_value; i++) {     //遍历签到点，有一个点没有达到就设置为false
              wx.getStorage({
                key: 'arrive' + i,
                success: function (res) {
                  if(res.data==false)
                  if_complete=false
                },
              })
            }
            if(if_complete==true){            //如果真的完成了，那么完成天数+1
              count = count+1;
              wx.setStorage({
                key: 'count',
                data: count,
              })
            }



            //如果不在圈里则提示失败
            if (judge == false) {
              wx.showToast({
                title: '没到签到点！',
                duration: 500
              })
            }



          },
        })




        //this.moveToLocation()
      }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    wx.getStorage({
      key: 'task',
      success: function (res) {
        console.log(res)
        //赋值
        that.setData({
          range_value: res.data.range,
          number_value: res.data.number,
          r_value: res.data.range / 6,
          latitude: res.data.latitude,
          longitude: res.data.longitude,
          points_latitude: res.data.points_latitude,
          points_longitude: res.data.points_longitude,
          date: res.data.Date
        })

        //成功获取之后判定时间是否相等
        var temp_date = that.getNowTime();
        var date = that.data.date;
        //如果相等，则什么都不用做
        if (date == temp_date) {

        }
        //如果不等，则刷新随机地点
        else {

          //刷新签到点的颜色
          for (var i = 0; i < 3; i++) {                //从第一个点到第三个点
            wx.setStorage({
              key: 'arrive' + i,
              data: false,
            })
          }




          //刷新日期
          that.setData({
            date: temp_date
          });
          date = temp_date;
          //生成随机点位的算法
          var la = that.data.latitude;             //纬度la
          var lo = that.data.longitude;           //经度lo
          var r = that.data.range_value;                 //半径
          var n = that.data.number_value;                //签到点个数
          var temp = 360 / n;
          var latitudes = new Array(n);
          var longitudes = new Array(n);

          //在n个区域里分别循环
          for (var i = 0; i < n; i++) {
            var temp_r = that.getRandom(r * 2 / 3, r * 5 / 6);             //随机到圆心的距离
            var temp_theta = that.getRandom(temp * i, temp * (i + 1)) * 0.017453293;  //随机角度
            var temp_x = temp_r * Math.sin(temp_theta);           //获取x
            var temp_y = temp_r * Math.cos(temp_theta);           //获取y
            latitudes[i] = la + temp_y / (111319.5555 * 2.0);       //计算出纬度
            longitudes[i] = lo + temp_x / (111319.5555 * Math.cos(la) * 3.0);   //计算出经度
          }
          //再次存储
          wx.setStorage({
            key: 'task',
            data: {
              "latitude": that.data.latitude,
              "longitude": that.data.longitude,
              "range": that.data.range_value,
              "number": that.data.number_value,
              "Date": date,
              "points_latitude": latitudes,
              "points_longitude": longitudes
            }
          });

          //将新的随机点设置给变量
          that.setData({
            points_latitude: latitudes,
            points_longitude: longitudes
          })
        }
        //在地图上显示
        that.setData({
          markers: [{
            //iconPath: "./temp.png",
            id: 0,
            latitude: that.data.latitude,
            longitude: that.data.longitude,
            width: 35,
            height: 35
          }],


        })

        //在地图上显示圆圈
        var i = that.data.number_value;
        if (i == 1) {
          that.setData({
            circles: [{
              id: 0,
              latitude: that.data.points_latitude[0],
              longitude: that.data.points_longitude[0],
              radius: that.data.r_value,
              strokeWidth: 2,
              fillColor: "#FFFF00AA",
              color: "#00000032",
              arrive: false
            }]
          })
        }

        if (i == 2) {
          that.setData({
            circles: [{
              id: 0,
              latitude: that.data.points_latitude[0],
              longitude: that.data.points_longitude[0],
              radius: that.data.r_value,
              strokeWidth: 2,
              fillColor: "#FFFF00AA",
              color: "#00000032",
              arrive: false
            },
            {
              id: 1,
              latitude: that.data.points_latitude[1],
              longitude: that.data.points_longitude[1],
              radius: that.data.r_value,
              strokeWidth: 2,
              fillColor: "#FFFF00AA",
              color: "#00000032",
              arrive: false
            }
            ]
          })
        }

        if (i == 3) {
          that.setData({
            circles: [{
              id: 0,
              latitude: that.data.points_latitude[0],
              longitude: that.data.points_longitude[0],
              radius: that.data.r_value,
              strokeWidth: 2,
              fillColor: "#FFFF00AA",
              color: "#00000032",
              arrive: false
            },
            {
              id: 1,
              latitude: that.data.points_latitude[1],
              longitude: that.data.points_longitude[1],
              radius: that.data.r_value,
              strokeWidth: 2,
              fillColor: "#FFFF00AA",
              color: "#00000032",
              arrive: false
            },
            {
              id: 2,
              latitude: that.data.points_latitude[2],
              longitude: that.data.points_longitude[2],
              radius: that.data.r_value,
              strokeWidth: 2,
              fillColor: "#FFFF00AA",
              color: "#00000032",
              arrive: false
            }
            ]
          })
        }

        //已经签到的圆的设置
        for (var i = 0; i < that.data.number_value; i++) {                //从第一个点到第三个点
          wx.getStorage({
            key: 'arrive' + i,                      //获取第i个点的key
            success: function (res) {
              var judge = res.data;                    //judge获取是不是完成了
              if (judge == true) {                      //如果完成
                var temp = "circles[" + i + "].fillColor"           //修改第i个圈的颜色
                that.setData({
                  [temp]: "#FF7F00AA"
                })
              }
            },
          })
        }

      },
    })
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

  //获取当前时间：
  getNowTime: function () {
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var day = now.getDate();
    if (month < 10) {
      month = '0' + month;
    };
    if (day < 10) {
      day = '0' + day;
    };
    var formatDate = year + '-' + month + '-' + day;
    return formatDate;
  },

  //获取随机数
  getRandom: function (start, end) {
    var length = end - start + 1;
    var num = parseInt(Math.random() * (length) + end);
    return num;
  },
})