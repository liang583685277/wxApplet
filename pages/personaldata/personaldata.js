// pages/personaldata/personaldata.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    maindata:{},
    bankstr:[],
    banktext:'选择开户银行',
    timetext:'选择日期',
    ymd:'',
    bankid:'',
    index:'',
	avatar:'../../img/u426.png'
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
    let token = getApp().wxtoken();
    let that = this;
    let data = {
      token:token
    }
    getApp().wxget("/v2-employee-info",data,function(res){
      if (res.data.code == "SUCCESS"){
        let bankstr = [];
        let bankidtext = "";
        res.data.data.banklist.forEach(function(item){
          bankstr.push(item.bank);
          if (item.id == res.data.data.bankid){
            bankidtext = item.bank;
          }
        })
        wx.setStorageSync("banklist", res.data.data.banklist);
        wx.setStorageSync("banktext", bankstr);
        // for (var i = 0; i < res.data.banklist.lenth;i++){
        //   bankstr.push(res.data.banklist[i].bank);
        // }
        
        that.setData({
          maindata: res.data.data,
          bankstr: bankstr,
          index: bankstr.indexOf(bankidtext)
        })
        if (res.data.data.bankid!=""){
          that.setData({
            banktext:""
          })
        }
      }
    });
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var n = timestamp * 1000;
    var date = new Date(n);
    //年
    var Y = date.getFullYear();
    //月
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    //日
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    this.setData({
      ymd: Y + "-" + M + "-" + D
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
  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    let tokens = getApp().wxtoken();
    let data = e.detail.value;
    data.token = tokens;
    data.bankid = wx.getStorageSync("bankid");
    getApp().wxpost("/v2-employee-editinfo",data,function(res){
      console.log(res);
      getApp().showok(res.data.msg);
    }) 
  },
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    let that = this;
    this.setData({
      index: e.detail.value,
      banktext:''
    })
    let banklist = wx.getStorageSync("banklist"); 
    let banktext = wx.getStorageSync("banktext");
    console.log(banklist);
    banklist.forEach(function(item){
      if (item.bank == banktext[e.detail.value] ){
        wx.setStorageSync("bankid", item.id)
      }
    })
  },
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value,
      timetext:''
    })
  },
//   编辑头像
  upeditavatar:function (e) {
	  let that = this;
	  wx.chooseImage({
		  count: 1, // 默认9
		  sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
		  sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
		  success: function (res) {
			  // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
			  let tempFilePaths = res.tempFilePaths[0];
			  let imgsize = res.tempFiles[0].size;
			  console.log(imgsize);
			  try {
				  if (imgsize < 1048576){
					  wx.showToast({
						  title: '正在上传...',
						  icon: 'loading',
						  mask: true,
						  duration: 10000
					  })
					  let token = getApp().wxtoken();
					  wx.uploadFile({
						  url: 'https://ylx.cqyycc.top/api/v2-employee-editavatar',
						  filePath: tempFilePaths,
						  name: 'avatar',
						  formData: {
							  'token': token
						  },
						  header: {
							  "Content-Type": "multipart/form-data"
						  },
						  success: function (res) {
							  var data = JSON.parse(res.data);
							  console.log(data)
							  getApp().showok(data.data.msg);
							  //服务器返回格式: { "Catalog": "testFolder", "FileName": "1.jpg", "Url": "https://test.com/1.jpg" }
							  if (data.code == "SUCCESS") {
								  that.setData({
									  avatar: 'https://ylx.cqyycc.top/' + data.data.path
								  });
							  }
						  },
						  fail: function (res) {
							  wx.hideToast();
							  wx.showModal({
								  title: '错误提示',
								  content: '上传图片失败',
								  showCancel: false,
								  success: function (res) { }
							  })
						  }
					  });
				  } else {
					  wx.showModal({
						  title: '错误提示',
						  content: '图片太大',
						  showCancel: false,
						  success: function (res) { }
					  })
				  }
			  }
			  catch (err) {
				  console.log(err);
			  }
			  
		  }
	  })
  }
})