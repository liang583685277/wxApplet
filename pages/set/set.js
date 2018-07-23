// pages/set/set.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
	  isShowPassword: true,
    password:''
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
	  this.showok();
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  formSubmit: function (e) {
	  console.log('form发生了submit事件，携带数据为：', e.detail.value);
    let that = this;
	  let pwdinfo = e.detail.value;
    try {
      if (pwdinfo.oldpwd == "") {
        getApp().showok("请输入原密码", "none");
      } else if (pwdinfo.oldpwd == pwdinfo.newpwd){
        getApp().showok("新密码不能和原密码一样", "none");
      }
      else if (pwdinfo.newpwd == "" || pwdinfo.okpassword == "" || pwdinfo.newpwd.lenth<6){
        getApp().showok("请输入正确的新密码（最少6字符）", "none");
      } else if (pwdinfo.newpwd != pwdinfo.okpassword){
        getApp().showok("输入的新密码不一致", "none");
      }else{
        let token = getApp().wxtoken();
        let data = {
          token:token,
          oldpwd: pwdinfo.oldpwd,
          newpwd: pwdinfo.newpwd
        }
        getApp().wxpost("/v2-employee-editpwd", data,function(res){
          console.log(res.data);
          getApp().showok(res.data.msg, "none");
          if (res.data.code == "SUCCESS"){
            wx.setStorageSync("logstatus", false)
            wx.setStorageSync('token', "");
            wx.setStorageSync("loginfo", {});
            wx.redirectTo({
              url: '../index/index'
            })
            that.setData({
              password:''
            })
          } else if (res.data.status == 4004){
            wx.reLaunch({
              url: '../index/index'
            })
          }
        })
      }
    }
    catch (err) {
      console.log(err);
    }
  }
})