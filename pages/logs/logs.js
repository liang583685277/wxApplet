//logs.js
const util = require('../../utils/util.js');
const app = getApp()
Page({
  data: {
    logs: [],
    sttafinfo:{}
  },
  onLoad: function () {
    
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
	  var token = app.wxtoken();
    var that = this;
    var data = {
      token:token
    };
	  app.wxget("/v2-employee-center", data, function (data) {
      if (data.data.code == "SUCCESS") {
        that.setData({
          sttafinfo: data.data.data
        })
      }
    })
  },
//   我的工单跳转
  myworkorder: function(e){
    wx.redirectTo({
      url: '../myworkorder/order'
    })
  },
//   密码修改
  setOpen: function (e) {
	  wx.navigateTo({
		  url: '../set/set',
	  })
  },
  jobOpenurl: function (e){
    wx.navigateTo({
      url: "../jobplacement/jobplacement",
    })
  },
//   报料申请
  sourcefor: function (e) {
	  wx.redirectTo({
		  url: '../sourcefor/sourcefor',
	  })
  },
//   退出登录
  centerout: function (e) {
	  wx.setStorageSync("logstatus", false)
	  wx.setStorageSync('token', "");
	  wx.redirectTo({
		  url: '../index/index'
	  })
  },
  // 扫一扫
  saoyisao:function (e) {
    wx.redirectTo({
      url: '../saoyisao/saoyisao',
    })
  },
  // 个人中心
  personaldata: function (e) {
    wx.navigateTo({
      url: '../personaldata/personaldata',
    })
  },
  // 提成明细
  pushmoney: function (e) {
    wx.navigateTo({
      url: '../pushmoney/pushmoney',
    })
  },
//   跳转我的工单已完成
  myworkorderyiwancheng: function (e) {
	  wx.redirectTo({
		  url: '../myworkorder/order?status=true'
	  })
  }
})
