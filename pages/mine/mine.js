

const app = getApp()

Page({
  data: {
    faceUrl: "../resource/images/noneface.png",
    isMe: true,
    isFollow: false,


    videoSelClass: "video-info",
    isSelectedWork: "video-info-selected",
    isSelectedLike: "",
    isSelectedFollow: "",

    myVideoList: [],
    myVideoPage: 1,
    myVideoTotal: 1,

    likeVideoList: [],
    likeVideoPage: 1,
    likeVideoTotal: 1,

    followVideoList: [],
    followVideoPage: 1,
    followVideoTotal: 1,

    myWorkFalg: false,
    myLikesFalg: true,
    myFollowFalg: true

  },

  onLoad:function(params){
    var me = this;
    var user = app.userInfo;
    wx.showLoading({
      title :'请等待...',
    });
    var serverUrl = app.serverUrl;
    //调用后端
    wx.request({
      url: serverUrl + '/user/query?userId=' + user.id,
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'content-type' : 'application/json'
      }, // 设置请求的 header
      success: function(res){
        wx.hideLoading();
        if(res.data.status ==200){
          var userInfo = res.data.data;
          var faceUrl = "../resource/images/noneface.png";
          if(userInfo.faceImage != null && userInfo.faceImage !=''&&userInfo.faceImage!=undefined){
            faceUrl = serverUrl + userInfo.faceImage;
          }
          me.setData({
            nickname:userInfo.nickname,
            faceUrl : faceUrl,
            fansCounts: userInfo.fansCounts,
            followCounts: userInfo.followCounts,
            receiveLikeCounts: userInfo.receiveLikeCounts
          });
        }
      }
    })
  },

  logout:function() {
    var user = app.userInfo;

    var serverUrl = app.serverUrl;
    //微信提供等待方法
    wx.showLoading({
      title : '请等待...',
    });
    //调用后端
    wx.request({
      url: serverUrl + '/logout?userId='+ user.id,
      method: 'POST',
      header: {
        'content-type' : 'application/json' //默认值
      }, // 设置请求的 header
      success: function(res){
        console.log(res.data);
        //将上方的等待方法出现的图表隐藏
        wx.hideLoading();
        if(res.data.status == 200){
          //返回状态信息提示
          wx.showToast({
            title:'注销成功',
            icon:'success',
            duration:2000
          });
          //注销成功的话，将用户信息清除
          app.userInfo = null;
          //页面跳转
          wx.navigateTo({
            url : '../userLogin/login',
          })
        }
      }
    })
  },
  changeFace : function(){
    var me = this ;
    wx.chooseImage({
      count: 1, // 最多可以选择的图片张数，默认9
      sizeType: ['compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function(res){
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        wx.showLoading({
          title:'上传中...',
        })
        var serverUrl = app.serverUrl;
        wx.uploadFile({
          url: serverUrl + '/user/uploadFace?userId=' + app.userInfo.id,
          filePath:tempFilePaths[0],
          name:'file',
          header: {
            'content-type' : 'application/json' //默认值
          }, // 设置请求的 header
          success: function(res){
              var data = JSON.parse(res.data);
              wx.hideLoading();
              if (data.status == 200){
                wx.showToast({
                  title:'上传成功!',
                  icon:'success'
                });
                var imageUrl = data.data;
                me.setData({
                  faceUrl : serverUrl + imageUrl
                });
              } else if (data.status == 500) {
                wx.showToast({
                  title:data.msg
                });
              }
              else if (res.data.status == 502) {
                wx.showToast({
                  title: res.data.msg,
                  duration: 2000,
                  icon: "none",
                  success: function () {
                    wx.redirectTo({
                      url: '../userLogin/login',
                    })
                  }
                });
  
              }
          }
        })
      }
    })
  },

  uploadVideo:function(){
    // this是当前page
    var me = this;

    wx.chooseVideo({
      sourceType: ['album'], // album 从相册选视频，camera 使用相机拍摄
      // maxDuration: 60, // 拍摄视频最长拍摄时间，单位秒。最长支持60秒
      success: function(res){
        var duration = res.duration;
        var tmpHeight = res.height ;
        var tmpWidth = res.width;
        var tmpVideoUrl = res.tempFilePath;
        var tmpCoverUrl = res.thumbTempFilePath;
        //判断一下视频的时间长度
        if(duration > 11){
          wx.showToast({
            title : '视频长度不能超过10秒...',
            icon:'none',
            duration:2500
          })
        } else if(duration < 1){
          //TODO 打开选择bgm的页面
          wx.showToast({
            title : '视频长度太短，请上传超过1秒的视频...',
            icon:'none',
            duration : 2500
          })
        } else {
          //TODO 打开选择bgm的页面
          wx.navigateTo({
            url: '../chooseBgm/chooseBgm?duration=' + duration
            + "&tmpHeight="+tmpHeight
            + "&tmpWidth=" + tmpWidth
            + "&tmpVideoUrl="+ tmpVideoUrl
            + "&tmpCoverUrl=" + tmpCoverUrl,
            success: function(res){
            }
          })
        }
      }
    })
  }
})
