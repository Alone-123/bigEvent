$(function () {
  const form = layui.form;
  const layer=layui.layer;
  form.verify({
    nickname: function (value) {
      if (value.length > 6) {
        return '昵称长度必须在 1 ~ 6 个字符之间！'
      }
    }
  })
  // 初始化 用户数据信息
  initUserInfo();

  function initUserInfo() {
    $.ajax({
      type: 'GET',
      url: '/my/userinfo',
      success(res) {
        if (res.status !== 0) {
          return layui.layer.msg('用户更新失败！');
        }
        form.val('formUserInfo', res.data);
      }
    })
  }

  // 重置行为
  $('#Reset').on('click',function(e) {
    e.preventDefault();
    // 重新渲染用户数据信息
    initUserInfo();
  })

  // 提交修改
  $('.layui-form').on('submit',function(e) {
    e.preventDefault();
    $.ajax({
      type: 'POST',
      url: '/my/userinfo',
      data:$(this).serialize(),
      success(res){
        if(res.status !== 0) {
          return layer.msg('更改信息失败！');
        }
        layer.msg('更改信息成功！');
        window.parent.getUserInfo();
      }
    })
  })
})
