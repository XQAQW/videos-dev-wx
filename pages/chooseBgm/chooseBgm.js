const app = getApp()

Page({
    data: {
      bgmList:[],
      serverUrl : '',
      videoParams : {}
    },

    onLoad: function (params) {
      var me = this;
      console.log(params)
      //此处params中存放的是从前一个页面传送过来的一些信息
      me.setData({
        videoParams : params
      })

      wx.showLoading({
        title:'请等待...',
      });
      var serverUrl = app.serverUrl;
      //调用后端
      wx.request({
        url: serverUrl + '/bgm/list',
        method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: {
          'content-type' : 'application/json' //默认值
        }, // 设置请求的 header
        success: function(res){
          console.log(res.data);
          wx.hideLoading();
          if(res.data.status == 200){
            var bgmList = res.data.data;
            me.setData({
              bgmList : bgmList,
              serverUrl : serverUrl
            })
          }
        }
      })
    },

    upload : function(e){
      var me = this ; 

      var bgmId = e.detail.value.bgmId;
      var desc = e.detail.value.desc;

      console.log("bgmId:"+bgmId)
      console.log("desc:"+desc)

      var duration = me.data.videoParams.duration;
        var tmpHeight = me.data.videoParams.tmpHeight ;
        var tmpWidth = me.data.videoParams.tmpWidth;
        var tmpVideoUrl = me.data.videoParams.tmpVideoUrl;
        var tmpCoverUrl = me.data.videoParams.tmpCoverUrl;

        //  上传短视频
        wx.showLoading({
          title : '上传中...',
        })
        var serverUrl = app.serverUrl;
        wx.uploadFile({
          url: serverUrl + '/video/upload',
          //微信小程序提供的formData方法
          formData : {
            userId : app.userInfo.id,
            bgmId: bgmId,
            desc : desc,
            videoSeconds : duration,
            videoHeight : tmpHeight,
            videoWidth : tmpWidth
          },
          filePath: tmpVideoUrl,
          name: 'file',
          header: {
            'content-type' : 'application/json' //默认值
          },
          success : function(res){
            console.log(res);
            wx.hideLoading();
            if(data.status == 200){
              wx.showToast({
                title:'上传成功!',
                icon:'success'
              })
            }
          }
        })
    }
    
})

