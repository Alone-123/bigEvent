// 注意：每次调用 $.get() 或 $.post() 或 $.ajax() 的时候，
// 会先调用 ajaxPrefilter 这个函数
// 在这个函数中，可以拿到我们给Ajax提供的配置对象
$.ajaxPrefilter(function (options) {
    // 在发起真正的 Ajax 请求之前，统一拼接请求的根路径
    // console.log(options.url ); /api/login
    options.url = 'http://api-breakingnews-web.itheima.net' + options.url;


    // 也可以设置 includes('/my/)
    if(options.url.indexOf('/my/')!==-1){
        options.headers={
            // 取用 本地存储的 标识码  即权限
            Authorization: localStorage.getItem('token') || ''
        };
    }

    
    // 用户权限问题
    options.complete=function(response){
        // console.log(response);
            // 使用解构 这样就不用写确定的值作为判断
            const {status,message}=response.responseJSON;
            if(response.responseJSON.status===status&&response.responseJSON.message===message){
                localStorage.removeItem('token');
                location.href='../home/login.html';
            }
    }
})