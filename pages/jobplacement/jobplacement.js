// pages/jobplacement/jobplacement.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
	jobdata:[],
	cur_page:1,
	page_size:5,
	previewimgstatus: true,//查看大图状态
	previewimgurl: '',//查看大图链接
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
    let that = this;
	let jobJson = that.data.jobdata;
	let page = that.data.cur_page;
	let data = {
		token: getApp().wxtoken(),
		cur_page: that.data.cur_page,
		page_size: that.data.page_size
	}
    app.wxget("/v2-employee-messages", data, function (data) {
      if (data.data.code == "SUCCESS") {
        console.log(data.data.data.messages);
		if(page > 1) {
			that.setData({
				jobdata: jobJson.concat(data.data.data.messages)
			})
		}else{
			that.setData({
				jobdata: data.data.data.messages
			})
		}
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
	  console.log("下拉");
	  this.setData({
		  cur_page: 1
	  });
	  this.onShow();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log("上拉");
	let that = this;
	let jsondata = this.data.jobdata;
	console.log(jsondata);
	try{
		if (jsondata.length > 0 && jsondata.length % that.data.page_size == 0){
			that.setData({
				cur_page: that.data.cur_page + 1
			});
			this.onShow();
		} else{
			getApp().showok("已经到底了...","none");
		}
	} catch(err){
		console.log(err);
	}
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  //关闭查看大图弹窗
  closeimg: function (e) {
	  this.setData({
		  previewimgstatus: true,
		  previewimgurl: ""
	  })
  },
  //打开查看大图弹窗
  openpreviewimg: function (e) {
	  let url = e.currentTarget.dataset.url;
	  this.setData({
		  previewimgstatus: false,
		  previewimgurl: url
	  })
  }
})