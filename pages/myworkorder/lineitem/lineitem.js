// pages/myworkorder/lineitem/lineitem.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selected: true,
    selected1: false,
    workorderid:'',
    orderdata:{},
    scdata:[],
	  statusstr:["未开始","","进行中","已完成"],
    height:'',
    scrollTop:0,
	previewimgstatus: true,//查看大图状态
	previewimgurl: '',//查看大图链接
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.workorderid = options.id
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
    that.setData({
      height: wx.getStorageSync("windowHeight")-130+"rpx"
    })
    console.log(that.workorderid);
    if (that.workorderid){
      let token = getApp().wxtoken();
      let data = {
        token: token,
        workorderid: that.workorderid
      }
      getApp().wxget("/v2-employee-orderinfo",data,function(res){
        console.log(res.data.data.orderprocesses);
        if (res.data.code == "SUCCESS"){
          that.setData({
            orderdata: res.data.data.workorderinfo,
			      scdata: res.data.data.orderprocesses
          })
        }
      })
    }
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
	//   getApp().showok("数据刷新中...","none")
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
  selected: function (e) {
    this.setData({
      selected1: false,
      selected: true,
      scrollTop: 0,
    })
  },
  selected1: function (e) {
    this.setData({
      scrollTop: 0,
      selected: false,
      selected1: true
    })
  },
  //关闭查看大图弹窗
  closeimg: function (e) {
	  this.setData({
		  previewimgstatus: true,
		  previewimgurl: ""
	  })
  },
  //打开查看大图弹窗
  openpreviewimg:function(e){
	  let that = this;
	  this.setData({
		  previewimgstatus: false,
		  previewimgurl: 'https://ylx.cqyycc.top/' + that.data.orderdata.attachment
	  })
  }
})