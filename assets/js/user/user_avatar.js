$(function () {
    const layer = layui.layer;
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }
    // 1.3 创建裁剪区域
    $image.cropper(options)

    $('#btnChooseImage').on('click', function () {
        $('#file').click();

    });
    $('#file').on('change', function (e) {
        // 获取文件  e.target 下有一个files   里面可以获取图片 
        const fileList = e.target.files;
        if (fileList.length === 0) {
            return layer.msg('请选择图片！');
        }
        // console.log(e);
        // files[0] 表示获取图片  他是一个数组 第一个就是它的图片
        const file = e.target.files[0]; 
        // 将文件转化为路径  利用URL.createObjectURL 将图片转化为 路径
        const imgURL = URL.createObjectURL(file);

        //初始化裁剪区域
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', imgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })
    // 点击确定按钮 上传图片到服务器
    $('#btnUpload').on('click', function () {
        // 获取图片  Cropper 里面的内置方法
        const dataURL = $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png')

        // ajax 上传图片
        $.ajax({
            type:'POST',
            url:'/my/update/avatar',
            data:{avatar:dataURL},
            success(res){
                if(res.status !== 0) return layer.msg('更新图片失败！');
                layer.msg('更新图片成功！')
                // 重新渲染页面
                window.parent.getUserInfo();
            }
        }) 
    })
})