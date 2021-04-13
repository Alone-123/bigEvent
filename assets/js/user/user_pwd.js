$(function () {
    const form = layui.form;
    const layer = layui.layer;
    form.verify({
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        samePwd: function (value) {
            if (value === $('[name=oldPwd]').val()) {
                return "新旧密码不能一致";
            }
        },
        rePwd: function (value) {
            if (value !== $('[name=newPwd]').val()) {
                return "两次密码不一致";
            }
        }
    })
    $('#form').submit(function (e) {
        e.preventDefault();
        $.ajax({
            type: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success(res){
                console.log(res);
                if(res.status !== 0){
                    return layer.msg('重置失败');
                }
                layer.msg('成功重置密码');
                $('#form')[0].reset();
            }
    })
    })

})