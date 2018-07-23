// pages/myworkorder/order.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selected: false,
    selected1: true,
    plcaozuo:true,
    toView: 'red',
    scrollTop: 100,
    miandata:[],
    plshow:true,
    ymd:'',
    timetext: '下单时间-开始时间',
    timetext1: '下单时间-结束时间',
    timetext2: '限期时间-开始时间',
    timetext3: '限期时间-结束时间',
    shaistatus:true,
    selectedAllStatus:false,
	  height:'',//进行中滚动区域高度
	  okheight:'',
	  status:1,
	  scrollTop:0, //滚动条位置
	  refreshTime: '', // 刷新的时间
	  hideHeader: true,//下拉状态
      hideBottom: true,//上拉状态
	  allPages: '',    // 总页数
	  currentPage: 1,  // 当前页数  默认是1
	  cur_page:1,//当前页
	  page_size:10, //当前页显示数量
	  refreshstatus:false, //刷新状态
	  overstatus:true,//数据到底状态
	  ids:[],//选中的id
	  plczbuttomstatus:true,//批量操作按钮状态
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
	  console.log(options);
	  if (options.status == "true"){
		  this.setData({
			  selected: true,
			  selected1: false,
			  status: 3,
			  scrollTop: 0
		  })
	  }
	  var date = new Date();
	  this.setData({
		  refreshTime: date.toLocaleTimeString()
	  })
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
	  this.setData({
		  height: wx.getStorageSync("windowHeight")-280+"rpx",
		  okheight: wx.getStorageSync("windowHeight") - 230 + "rpx",
		})
	  this.endJsondata();
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
  pullToRefresh: function () {
	var date = new Date();
	this.setData({
		cur_page: 1,
		refreshTime: date.toLocaleTimeString(),
		hideHeader: false,
		refreshstatus:true
	})
	var self = this;
	setTimeout(function () {
		console.log('下拉刷新');
		self.endJsondata();
	}, 300);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
	var that = this;
    let datajson = that.data.miandata;
	try {
		if (datajson.length % that.data.page_size == 0) {
			that.setData({
				cur_page: that.data.cur_page + 1,
				overstatus: true
			});
			that.endJsondata();
		} else {
			that.setData({
				overstatus: false
			});
		}
	} catch (err) {
		console.log(err);
	}
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
//   进行中菜单
  selected: function (e) {
	  this.setData({
		selected1: true,
		selected: false,
		status: 1,
		scrollTop:0,
	});
	  this.endJsondata();
  },
//   已完成菜单
  selected1: function (e) {
	this.setData({
      selected: true,
      selected1: false,
      status:3,
      scrollTop:0,
    })
	this.endJsondata();
  },
  upper: function (e) {
    console.log(e)
  },
  lower: function (e) {
    console.log(e)
  },
  scroll: function (e) {
    console.log(e)
  },
  tap: function (e) {
    for (var i = 0; i < order.length; ++i) {
      if (order[i] === this.data.toView) {
        this.setData({
          toView: order[i + 1]
        })
        break
      }
    }
  },
  tapMove: function (e) {
    this.setData({
      scrollTop: this.data.scrollTop + 10
    })
  },
  // 批量操作
  plcaozuo: function (e) {
    this.setData({
		ids:[],
        plcaozuo:false,
		plczbuttomstatus:true,
		selectedAllStatus:false
    })
  },
  // 取消
  primary: function (e) {
    this.setData({
      plcaozuo: true,
	  plczbuttomstatus: false
    })
  },
  closeWin:function (e) {
    wx.redirectTo({
      url: '../logs/logs',
    })
  },

  // to扫一扫
  saoyisao: function (e) {
    wx.redirectTo({
      url: '../saoyisao/saoyisao',
    })
  },
  // 订单详情
  tolineitem: function (e) {
	  this.primary()
    wx.navigateTo({
		url: 'lineitem/lineitem?id=' + e.currentTarget.dataset.id,
    })
  },
  // 批量完成
  plfulfill: function (e) {
    let that = this;
    let ids = that.data.ids;
    try {
      if (ids.length>0){
        let token = getApp().wxtoken();
        let data = {
          token: token,
          ids: ids
        }
        getApp().wxpost("/v2-employee-completeprocess", data, function (res) {
          console.log(res);
          getApp().showok(res.data.msg, "none")

          if (res.data.code == "SUCCESS") {
			that.primary();
            that.endJsondata();
            wx.setStorageSync("ids", []);
          }
        })
      } else {
        wx.showModal({
          title: '错误提示',
          content: '请选择需要完成的工单',
          showCancel: false,
          success: function (res) { }
        })
      }
    }
    catch (err) {
      console.log(err);
    }
    
  },
  checkboxChange: function (e) {
	  console.log('checkbox发生change事件，携带value值为：', e.detail.value)
	this.setData({
		ids: e.detail.value
	})
	console.log(this.data.ids);
  },
  // 筛选弹窗
  shaixuan:function(e){
    // var timestamp = Date.parse(new Date());
    // timestamp = timestamp / 1000;
    // console.log("当前时间戳为：" + timestamp);
    // var n = timestamp * 1000;
    // var date = new Date(n);
    // //年
    // var Y = date.getFullYear();
    // //月
    // var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    // //日
    // var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    // console.log(Y + "-" + M + "-" + D);
    // this.setData({
    //   ymd: Y + "-" + M + "-" + D
    // })
    this.setData({
      shaistatus:false
    })
  },
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value,
      timetext: ''
    })
  },
  bindDateChangea: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      datea: e.detail.value,
      timetext1: ''
    })
  },
  bindDateChangeb: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      dateb: e.detail.value,
      timetext2: ''
    })
  },
  bindDateChangec: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      datec: e.detail.value,
      timetext3: ''
    })
  },
//   筛选
  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    let token = app.wxtoken();
    let that = this;
    let info = e.detail.value;
    this.primary();
    let data = {
      number: info.number,
      addtime_start: info.addtime_start == null ? "" : info.addtime_start,
      addtime_end: info.addtime_end == null ? "" : info.addtime_end,
      deadline_start: info.deadline_start == null ? "" : info.deadline_start,
      deadline_end: info.deadline_end == null ? "" : info.deadline_end,
      token: token,
	  status: that.data.status,
	  cur_page: that.data.cur_page,
	  page_size: that.data.page_size
    };
    console.log(data);
    app.wxget("/v2-employee-orders", data, function (data) {
      if (data.data.code == "SUCCESS") {
        console.log(data.data);

        that.setData({
          miandata: data.data.data.orders,
          shaistatus: true,
		  plcaozuo: true,
		  plshow: true
        })
		console.log(that.data.plcaozuo);
      }
    })
  },
//    筛选-取消
  closeshaixuan:function(e) {
    this.setData({
      shaistatus: true
    })
  },
//   全选
  checkboxQuanChange:function (e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)
    let ids = [];
	
    if (e.detail.value[0] == 1){
		this.data.miandata.forEach(function (item) {
			ids.push(item.id)
		});
		this.setData({
			selectedAllStatus: true,
			ids: ids
		})
    }else{
      this.setData({
        selectedAllStatus: false,
		ids: ids
      })
    }
	console.log(this.data.ids);
  },
//   完成
  fulfillok: function (e) {
	  let that = this;
	  console.log(e.currentTarget.dataset.id);
	  wx.showModal({
		  title: '提示',
		  content: '确认完成该工单吗？',
		  success: function (res) {
			  if (res.confirm) {
				  console.log('用户点击确定')
				  
				  let id = e.currentTarget.dataset.id;
				  let token = getApp().wxtoken();
				  let data = {
					  token: token,
					  ids: id
				  }
				  console.log(data);
				  getApp().wxpost("/v2-employee-completeprocess", data, function (res) {
					  console.log(res);
					  getApp().showok(res.data.msg, "none");
					  if (res.data.code == "SUCCESS") {
						  that.endJsondata();
					  }
				  })
			  } else if (res.cancel) {
				  console.log('用户点击取消')
			  }
		  }
	  })
	  
  },
//   退回
  returnnone: function (e) {
	  let that = this;
	  wx.showModal({
		  title: '提示',
		  content: '确认退回该工单吗？',
		  success: function (res) {
			  if (res.confirm) {
				  console.log('用户点击确定')
				  
				  let id = e.currentTarget.dataset.id;
				  let token = getApp().wxtoken();
				  let data = {
					  token: token,
					  ids: id
				  }
				  console.log(data);
				  getApp().wxpost("/v2-employee-cancleprocess", data, function (res) {
					  console.log(res);
					  getApp().showok(res.data.msg, "none");
					  if (res.data.code == "SUCCESS") {
						  that.endJsondata();
					  }
				  })
			  } else if (res.cancel) {
				  console.log('用户点击取消')
			  }
		  }
	  })

	  
  },
  //   加载已完成数据
  endJsondata: function () {
	  let token = app.wxtoken();
	  let that = this;
	  let page = that.data.cur_page;
	  let refreshstatus = that.data.refreshstatus;
	  let data = {
		  token: token,
		  status: that.data.status,
		  cur_page: page,
		  page_size: that.data.page_size
	  }
	  app.wxget("/v2-employee-orders", data, function (data) {
		  console.log(refreshstatus);
		  if (data.data.code == "SUCCESS") {
			  let jsondata = data.data.data.orders;
			  console.log(jsondata);
			  setTimeout(function () {
				  that.setData({
					  hideHeader: true
				  })
			  }, 1000)
			  try{
				  if (page == 1){
					  that.setData({
						  miandata: jsondata,
					  })
					  if (jsondata.length < 10) {
						  that.setData({
							  overstatus: false,
						  })
					  }
				   } else if (page > 1){
					  let miandata = that.data.miandata;
					  jsondata.forEach(function(item){
						  miandata.push(item);
					  })
					  that.setData({
						  miandata: miandata,
					  })
				  } if (jsondata.length > 0) {
					  that.setData({
						  plczbuttomstatus: false
					  })
				  } else if (jsondata.length == 0) {
					  that.setData({
						  plczbuttomstatus: true
					  })
				  } 
			  }catch(res){
				  console.log(res);
			  }
			}
	  })
  },
  stopfun:function(e){
	//阻止冒泡，无用  
  }
})