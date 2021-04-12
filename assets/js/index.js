$(function () {
    // 调用用户信息函数
    getUserInfo();

    // 退出功能
    $('#btnLogout').on('click', function(){
        layer.confirm('确定退出登录?', {icon: 3, title:'提示'}, function(index){
            //do something
            // 点击退出时，清空 token
            localStorage.removeItem('token');
            // 并返回 登录页面
            location.href='../home/login.html';
            layer.close(index);
          });
    })

})
// 获取用户信息
function getUserInfo() {
    $.ajax({
        type: 'GET',
        url: '/my/userinfo',
        // headers: {
        //     // 取用 本地存储的 标识码  即权限
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success(res) {
            if(res.status!==0){
                return layui.layer.msg('获取用户信息失败！');
            }
            // 调用用户渲染数据函数
            render(res.data);
        },
        // 用户权限问题
        // complete(response) {
        //     console.log(response);
        //     // 使用解构 这样就不用写确定的值作为判断
        //     // const {status,message}=response.responseJSON;
        //     if(response.responseJSON.status===status&&response.responseJSON.message===message){
        //         localStorage.removeItem('token');
        //         location.href='../home/login.html';
        //     }
        // }
    })
}

// 渲染用户数据
function render(user) {
    console.log(user);
    const name=user.nickname || user.username;
    // 欢迎标语
    $('#welcome').html('欢迎 &nbsp;&nbsp;'+name);
    // 头像
    // 判断user.pic 是否是空
    if(user.user_pic!==null){
        $('.userinfo #img').attr('src',user.user_pic).show();
        $('.userinfo .text-avatar').hide();
    }else{
        $('.userinfo #img').hide();
        // 将第一个字母转化为大写
        const first=name[0].toUpperCase();
        $('.userinfo .text-avatar').html(first).show();
    }
}