const app = getApp()
 Page({
   data : {

   },
   doRegist: function(e){
     var formObject = e.detail.value;
     var username = formObject.username;
     var password = formObject.password;

     // 简单验证
     if (username.length == 0 || password.length == 0){
       wx.showToast({
         title:'用户名或密码不能为空',
         icon:'none',
         duration: 3000
       })
     } else {
       var serverUrl = app.serverUrl;
       wx.showLoading({
         title:'请等待...',
       });
       wx.request({
         url: serverUrl + "/regist",
         data: {
                username:username,
                password:password
        },
         method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
         header: {
           'content-type' : 'application/json'  //默认值
         }, // 设置请求的 header
         success: function(res){
           // success
           console.log(res.data)
           wx.hideLoading();
           var status = res.data.status;
           if(status == 200){
             wx.showToast({
               title:'用户注册成功!!!!',
               icon:'none',
               duration:3000
             }),
             app.userInfo = res.data;
           } else if (status == 500){
             wx.showToast({
                title:res.data.msg,
                icon:'none',
                duration : 3000
             })
           }
         },
         fail: function() {
           // fail
         },
         complete: function() {
           // complete
         }
       })
     }
   },

   goRegistPage:function(){
     wx.navigateTo({
       url: '../userRegist/regist',
       success: function(res){
         // success
       },
       fail: function() {
         // fail
       },
       complete: function() {
         // complete
       }
     })
   },
   goLoginPage:function(){
     wx.navigateTo({
       url: '../userLogin/login',
       success: function(res){
         // success
       },
       fail: function() {
         // fail
       },
       complete: function() {
         // complete
       }
     })
   }
 })