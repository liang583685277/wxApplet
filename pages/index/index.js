//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    passwordtrue:false,
    hasUserInfo: false,
    phone: "",
    pwd: "",
	logstatus:false,
	  item:{
      name:'1',
      value:'自动登录',
      checked:false,
    },
	isShowPassword: true,
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function (options) {
	  // 生命周期函数--监听页面加载
	  
  }, 
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
	let logstatu = wx.getStorageSync("logstatus");
	let loginfo = wx.getStorageSync("loginfo");
	this.setData({
		phone: loginfo.phone,
		pwd: loginfo.pwd,
		logstatus: logstatu
	})
	if (logstatu == true) {
		getApp().wxpost('/v2-employee-login', loginfo, function (data) {
			try {
				if (data.data.code == "SUCCESS") {
					getApp().showok(data.data.msg, "success");
					wx.setStorageSync('token', data.data.data.token);
					wx.redirectTo({
						url: '../logs/logs'
					})
				} else {
					getApp().showok(data.data.msg, "none");
				}
			} catch (err) {
				console.log(err);
			}
		})
	}
  },
  toggleShowPassword: function (e) {
	  var isShowPassword = !this.data.isShowPassword;
	  this.setData({
		  isShowPassword: isShowPassword
	  });
  },
  logIn: function () {
	  	wx.navigateTo({
				url: '../logs/logs'
		  })
	//   var that = this;
	//   wx.request({
	// 	  url: 'http://localhost:8000/admin',
	// 	  data: {
	// 		  username: this.data.userName,
	// 		  password: this.data.password,
	// 	  },
	// 	  method: 'GET',
	// 	  success: function (res) {
	// 		  that.setData({
	// 			  id_token: res.data.id_token,
	// 			  response: res
	// 		  })
	// 		  try {
	// 			  wx.setStorageSync('id_token', res.data.id_token)
	// 		  } catch (e) {
	// 		  }
	// 		  wx.navigateTo({
	// 			  url: '../components/welcome/welcome'
	// 		  })
	// 		  console.log(res.data);
	// 	  },
	// 	  fail: function (res) {
	// 		  console.log(res.data);
	// 		  console.log('is failed')
	// 	  }
	//   })
  },
  checkboxChange: function (e) {
	  console.log('checkbox发生change事件，携带value值为：', e.detail.value)
	  if (e.detail.value[0] == 1){
		  wx.setStorageSync("logstatus", true)
	  }else{
		  wx.setStorageSync("logstatus", false)
	  }

  },
  formSubmit: function (e) {
	  let that = this;
	  let data = e.detail.value;
	  wx.setStorageSync("loginfo", data);
	  getApp().wxpost('/v2-employee-login', data,function(data){
      	try {
		  if (data.data.code == "SUCCESS"){
				getApp().showok(data.data.msg, "success");
				wx.setStorageSync('token', data.data.data.token);
				wx.redirectTo({
					url: '../logs/logs'
				})
			} else{
        		getApp().showok(data.data.msg, "none");
		  	}
	  	}catch (err) {
		  console.log(err);
	  	}
	})
  },
})
