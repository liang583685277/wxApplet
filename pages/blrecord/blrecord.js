// pages/blrecord/blrecord.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
	miandata:[],
	wheight:'',
	cur_page: 1,
	page_size: 5,
	scrollTop:0,
	previewimgstatus:true,
	previewimgurl:'',
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
	  this.setData({
		  wheight: wx.getStorageSync("windowHeight")-90+"rpx",
		  cur_page:1
	  })
	  this.onJsondata();
  },
	onJsondata: function () {
		let that = this;
		let token = getApp().wxtoken();
		let jsondata = that.data.miandata;
		let page = that.data.cur_page;
		let data = {
			token: token,
			cur_page: page,
			page_size: that.data.page_size
		}
		getApp().wxget("/v2-employee-revelations", data, function (res) {
			console.log(res.data);
			let dataarr = res.data;
			try {
				if (dataarr.code == "SUCCESS") {
					if (page > 1 ){
						dataarr.data.revelations.forEach(function(item){
							jsondata.push(item);
						})
						that.setData({
							miandata: jsondata
						})
					}else{
						that.setData({
							miandata: dataarr.data.revelations
						})
					}
					
				}
			}catch(res){
				console.log(res);
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
	  getApp().showok("刷新数据中...", "none");
	  this.onJsondata();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
	  getApp().showok("加载数据中...", "none");
	  let that = this;
	  let jsondata = this.data.miandata;
	  console.log(jsondata.length % that.data.page_size);
	  try {
		  if (jsondata.length > 0 && jsondata.length % that.data.page_size == 0  ) {
			  getApp().showok("加载完成", "none");
			  that.setData({
				  cur_page: that.data.cur_page + 1
			  });
			  console.log(that.data.cur_page + 1);
			  this.onJsondata();
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
  navcenter: function (e) {
	  wx.redirectTo({
		  url: '../logs/logs',
	  })
  },
  previewImg:function (e) {
	  console.log(e);
	  this.setData({
		  previewimgstatus:false,
		  previewimgurl: e.currentTarget.dataset.imgurl
	  })
  },
  closeimg:function (e) {
	  this.setData({
		  previewimgstatus: true,
		  previewimgurl: ""
	  })
  }
})