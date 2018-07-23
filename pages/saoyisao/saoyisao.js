// pages/saoyisao/saoyisao.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
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
    var that = this;
    var show;
    wx.scanCode({
      success: (res) => {
        console.log("结果:" + res.result + "二维码类型:" + res.scanType + "字符集:" + res.charSet + "路径:" + res.path);
        let token = getApp().wxtoken();
        let data = {
          number: res.result,
          token: token
        }
        getApp().wxpost("/v2-employee-addprocess", data, function (data) {
			wx.showModal({
				title: '提示',
				content: data.data.msg,
				showCancel: false,
				success: function (res) {
					if (res.confirm) {
						console.log('用户点击确定')
						that.onReady();
					} else if (res.cancel) {
						console.log('用户点击取消')
					}
				}
			})
          
        })
      },
      fail: (res) => {
        wx.showToast({
          title: '已取消扫码上传',
          icon: 'none',
          duration: 2000
        })
      },
      complete: (res) => {
      }
    })
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
//   手动添加
  righttap:function (e) {
    wx.navigateTo({
      url: '../handadd/handadd',
    })
  },
  lefttap: function (e) {
    wx.redirectTo({
      url: '../logs/logs',
    })
  }
})