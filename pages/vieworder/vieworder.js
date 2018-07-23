// pages/pushmoney/vieworder/vieworder.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    maindata:[],
    ym:'',
    tm:"",
	wheight:'',
	cur_page: 1,
	page_size: 10
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.ym = options.ym
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
	  this.getjsonData();
	  let height = wx.getStorageSync("windowHeight")-100+"rpx";
	  this.setData({
		  wheight: height
	  })
  },
	getjsonData: function(){
		let that = this;
		let token = getApp().wxtoken();
		let page = that.data.cur_page;
		let jsondata = that.data.maindata;
		let data = {
			token: token,
			ym: this.ym,
			cur_page: page,
			page_size: that.data.page_size
		};
		getApp().wxget("/v2-employee-ordersbyym", data, function (res) {
			console.log(res);
			try {
				if (res.data.code == "SUCCESS") {
					if(page == 1) {
						that.setData({
							tm: that.ym,
							maindata: res.data.data.orders
						})
					}
					else if(page > 1){
						res.data.data.orders.forEach(function(item){
							jsondata.push(item);
						});
						that.setData({
							tm: that.ym,
							maindata: jsondata
						})
					}
				}
			} catch (err) {

			}
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
	  getApp().showok("刷新数据中...","none");
	  this.setData({
		  cur_page: 1
	  });
	  this.getjsonData();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
	  getApp().showok("加载数据中...", "none");
	  let that = this;
	  let jsondata = this.data.maindata;
	  console.log(jsondata);
	  try {
		  if (jsondata.length > 0 && jsondata.length % that.data.page_size == 0) {
			  getApp().showok("加载完成", "none");
			  that.setData({
				  cur_page: that.data.cur_page + 1
			  });
			  this.getjsonData();
		  } else {
			  getApp().showok("已经到底了...", "none");
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
  returnnav: function (e) {
    wx.redirectTo({
      url: '../pushmoney/pushmoney',
    })
  },
//   工单详情页
  navdetailpage:function(e) {
	  console.log(e);
	  wx.navigateTo({
		  url: '../myworkorder/lineitem/lineitem?id=' + e.currentTarget.dataset.id,
	  })
  }
})