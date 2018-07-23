//app.js
App({
  data: {
    url:''
  },
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
	// 获取本地设备宽高
    wx.getSystemInfo({
      success: function (res) {
        console.log(res.windowHeight) // 获取可使用窗口高度
        let windowHeight = (res.windowHeight * (750 / res.windowWidth)); //将高度乘以换算后的该设备的rpx与px的比例
        console.log(windowHeight) //最后获得转化后得rpx单位的窗口高度
        wx.setStorageSync("windowHeight", windowHeight)
      }
    })
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null
  },
  wxpost: function (url, data, success, err, complete) {
    var that = this;
	console.log(data);
    wx.request({
      url: 'https://ylx.cqyycc.top/api' + url, //仅为示例，并非真实的接口地址
      method: 'post',
      data: data,
      header: {
		  'content-type': 'application/json; charset=utf-8'
      },
      success: function (res) {
		if (res.data.status == 4004) {
			that.showok(res.data.msg, "none")
			wx.reLaunch({
				url: '../index/index'
			})

		} else {
			console.log("post操作");
			success(res)
		}

      },
      fail: err,
      complete: complete
    })
  },
  wxget: function (url, data, success, err, complete) {
    var that = this
    wx.request({
      url: 'https://ylx.cqyycc.top/api' + url, //仅为示例，并非真实的接口地址
      method: 'get',
      data:data,
      success: function(res){
        if (res.data.status == 4004){
          try{
            that.showok(res.data.msg, "none")
            wx.reLaunch({
              url: '../index/index'
            })
          } catch (e) {
            that.showok(res.data.msg, "none")
            wx.reLaunch({
              url: '../index/index'
            })
          }
          
        }else{
			console.log("get操作");
            success(res)
        }
      },
      fail: err,
      complete: complete
    })
  },
  //返回key:token
  wxtoken: function () {
    try {
      var value = wx.getStorageSync('token');
      if (value) {
        // Do something with return value
        return value;
      } else{
        wx.reLaunch({
          url: '../index/index'
        })
      }
    } catch (e) {
      // Do something when catch error
      wx.reLaunch({
        url: '../index/index'
      })
    }
  },
  //   消息弹窗
  showok: function (msg, status) {
    wx.showToast({
      title: msg,
      icon: status,
      duration: 1000
    })
  },
})