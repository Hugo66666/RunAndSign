Component({

  properties: {    //外部传入   
    task_name: {
      type: String,
      value: '我的跑步计划'
    },
    start_time: {
      type: String,
      value: '2018-5-15'
    },
    end_time: {
      type: String,
      value: '2018-6-1'
    }
  },

	data: {           //内部数据
    collapsed: true
  },

  //生命周期方法created attached ready moved detached
  //加载attached
  attached: function () {
    console.log('component attached!');
  },

  methods: {        //组件内部的方法
      onTap:function(){
          //点击重新编辑
          this.triggerEvent('myevent')
      }
  }
})
