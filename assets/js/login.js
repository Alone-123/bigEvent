$(function () {
    // 注册的显示与隐藏
    $('#link_reg').on('click', function () {
        $('.login-box').hide();
        $('.reg-box').show();
    })
    $('#link_login').on('click', function () {
        $('.login-box').show();
        $('.reg-box').hide();
    })


    // 自定义校验规则
    const form = layui.form;
    const layer=layui.layer;
    form.verify({
        // 自定义pwd 校验
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        repwd: function (value) {
            const pwd = $('.reg-box [name=password]').val();
            if (pwd !== value) {
                return '两次密码不一致!';
            }
        }
    });
    // 注册
    $('#form-reg').on('submit', function (e) {
        e.preventDefault();
        const data = $('#form-reg').serialize();
        // Ajax 提交表单
        $.ajax({
            type: 'post',
            data:data,
            url:'/api/reguser',
            success: function (res){
                if(res.status !==0){
                   //提示功能
                   return layer.msg(res.message);
                };
                //提示功能
                layer.msg('注册成功');
                // 点击 注册自动跳转到 登录页面，使用自动触发事件
                $('#link_login').click();
            }
        });
       
    });

    // 登录
    $('#form-login').submit(function(e){
        e.preventDefault();
        const data = $(this).serialize();
        // Ajax 提交表单
        $.ajax({
            type: 'post',
            data:data,
            url:'/api/login',
            success: function (res){
                if(res.status !==0){
                   //提示功能
                   return layer.msg('登录失败');
                };
                layer.msg('登录成功');
                //将登陆得到的token 字符串  保存到本地
                localStorage.setItem('token',res.token); 
                // 跳转登录
                location.href='../home/index.html';
            }
        })
    })

})