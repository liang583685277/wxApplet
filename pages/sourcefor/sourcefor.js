// pages/sourcefor/sourcefor.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    textnum:'0',
    textval:'',
	imgheight:'',
	patha:'',
	pathb:'',
	pathc:'',
	img_1:'',
	img_2:'',
	img_3:''
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
	  this.imgHeight();
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
  blrecordNav: function (e) {
	  wx.redirectTo({
		url: '../blrecord/blrecord',
	})
  },
  // 提交反馈信息
  bindFormSubmit: function (e) {
	  let that = this;
      let text = e.detail.value.textarea;
    if (text.length>0){
      let token = getApp().wxtoken();
      let data = {
        token: token,
        revelation: text,
		img_1: that.data.img_1,
		img_2: that.data.img_2,
		img_3: that.data.img_3
      }
	  console.log(data);
      getApp().wxpost("/v2-employee-addrevelation",data,function(res){
        getApp().showok(res.data.msg,"none")
        if (res.data.code == "SUCCESS"){
			wx.redirectTo({
				url: '../blrecord/blrecord',
			})
          that.setData({
            textval:''
          })
        }
      })
	//   wx.uploadFile({
	// 	  url: 'https://ylx.cqyycc.top/api/uploadimg',
	// 	  filePath: that.data.patha[0],
	// 	  header: {
	// 		  "Content-Type": "multipart/form-data"
	// 	  },
	// 	  name: 'addrevelation',
	// 	  formData: {
	// 		  'imgname': 'addrevelation',
	// 		  'token': token
	// 	  },
	// 	  success: function (res) {
	// 		  console.log(res);
	// 		  //   var data = res.data
	// 		  //do something
	// 	  }
	//   })
	}
  },
  //图片上传
  imageUpload: function (num, path, success){
	  let that = this;
	  wx.uploadFile({
		  url: 'https://ylx.cqyycc.top/api/uploadimg',
		  filePath: path,
		  header: {
			  "Content-Type": "multipart/form-data"
		  },
		  name: 'addrevelation',
		  formData: {
			  'imgname': 'addrevelation',
		  },
		  success: function (res) {
			  let data = JSON.parse(res.data);
			  console.log(data.data);
			  success(data.data.path)
			  //do something
		}
	  })
  },
  navleft: function (e) {
	  wx.redirectTo({
		  url: '../logs/logs',
	  })
  },
//   监听输入款字符串长度
  bindKeyInput: function (e) {
    this.setData({
      textnum: e.detail.value.length
    })
  },
  //动态设置图片元素高度
  imgHeight:function (e) {
	  let that = this;
	  wx.createSelectorQuery().select('#view-img-list').fields({
		  dataset: true,
		  size: true,
		  scrollOffset: true,
		  properties: ['scrollX', 'scrollY'],
		  computedStyle: ['margin', 'backgroundColor']
	  }, function (res) {
		  console.log(res);
		//   res.height = res.width
		  that.setData({
			  imgheight: res.width+"px"
		  })
		//   res.dataset    // 节点的dataset
		//   res.width      // 节点的宽度
		//   res.height     // 节点的高度
		//   res.scrollLeft // 节点的水平滚动位置
		//   res.scrollTop  // 节点的竖直滚动位置
		//   res.scrollX    // 节点 scroll-x 属性的当前值
		//   res.scrollY    // 节点 scroll-y 属性的当前值
		//   // 此处返回指定要返回的样式名
		//   res.margin
		//   res.backgroundColor
	  }).exec()
  },
  //图片选择
  updataimg:function(e){
	  let that = this;
	  let imgid = e.currentTarget.dataset.id;
	  wx.chooseImage({
		  count: 1, // 默认9
		  sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
		  sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
		  success: function (res) {
			  // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
			  var tempFilePaths = res.tempFilePaths[0];
			  try {
				  if (imgid == 1) {
					  that.setData({
						  patha: tempFilePaths
					  })
					  that.imageUpload(1, tempFilePaths,function(res){
						  console.log(res);
						  that.setData({
							  img_1: res
						  })
					  });
				  } else if (imgid == 2) {
					  that.setData({
						  pathb: tempFilePaths
					  })
					  that.imageUpload(2, tempFilePaths, function (res) {
						  that.setData({
							  img_2: res
						  })
					  });
				  } else if (imgid == 3) {
					  that.setData({
						  pathc: tempFilePaths
					  })
					  that.imageUpload(3, tempFilePaths, function (res) {
						  that.setData({
							  img_3: res
						  })
					  });
				  }
				  
			  } catch (err) {
				  console.log(err)
			  }
		  }
	  })
	  
  },
  clearimg:function(e){
	  let index = e.currentTarget.dataset.id;
	  if (index == 1){
		this.setData({
			img_1:''
		})
	  }else if (index == 2) {
		  this.setData({
			  img_2: ''
		  })
	  }else if (index == 3) {
		  this.setData({
			  img_3: ''
		  })
	  }
  }
})