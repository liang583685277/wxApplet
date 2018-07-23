// pages/pushmoney/pushmoney.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date:"",
    enddate:'',
    maindat:{},
	height:''
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
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    console.log("当前时间戳为：" + timestamp);
    var n = timestamp * 1000;
    var date = new Date(n);
    //年
    var Y = date.getFullYear();
	let wheight = wx.getStorageSync("windowHeight") - 250+"rpx";
    console.log(Y );
    this.setData({
      date: Y + "年",
      enddate: Y+3,
	  height: wheight
    })
	
    let token = getApp().wxtoken();
    let data = {
      token: token,
      year: Y
    }
    getApp().wxget("/v2-employee-commissions", data,function(res){
      console.log(res);
      if (res.data.code == "SUCCESS"){
        that.setData({
          maindat: res.data.data
        })
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
	  this.onShow();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
	  getApp().showok("加载数据中...", "none");
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    let that = this;
    this.setData({
      date: e.detail.value+"年"
    })
    let token = getApp().wxtoken();
    let data = {
      token: token,
      year: e.detail.value
    }
    getApp().wxget("/v2-employee-commissions", data, function (res) {
      if (res.data.code == "SUCCESS") {
        that.setData({
          maindat: res.data.data
        })
      }

    })
  },
  // 生产单详情页跳转
  navvieworder: function (e) {
    console.log(e.currentTarget.id)
    wx.navigateTo({
      url: '../vieworder/vieworder?ym=' + e.currentTarget.id,
    })
  }
})