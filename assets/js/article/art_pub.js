$(function () {
    const layer = layui.layer;
    const form = layui.form;
    // 初始化富文本编辑器
    initEditor()

    // 多选框 获取文章类别
    function getLabel() {
        // 使用Ajax 请求数据
        $.ajax({
            type: "GET",
            url: '/my/article/cates',
            success(res) {
                if (res.status !== 0) return layer.msg('获取文章分类失败！');
                const htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr);
                // 重新渲染分类类别
                form.render();
            }
        })
    }
    getLabel();

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 上传头像
    $('#form_babel').on('click', '#btn_img', function () {
        // 自动触发input 的选择文件点击事件
        $('#file').click();
    })
    $('#file').on('change', function (e) {
        // 获取到文件的列表数组
        const files = e.target.files;
        // console.log(files[0]);
        // 判断用户是否选择了文件
        if (files.length === 0) {
            return;
        }

        // 根据文件，创建对应的 URL 地址
        const newImgURL = URL.createObjectURL(files[0])
        // console.log(URL);
        // 为裁剪区域重新设置图片
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })


    // 定义文章状态
    let art_state = '已发布';
    $('#btnSave2').on('click', function () {
        art_state = '草稿';
    })
    $('#form_babel').on('submit', function (e) {
        e.preventDefault();
        // 创建FormDataa 对象
        const fd = new FormData($(this)[0]);
        fd.append('state', art_state);
        // console.log(fd);
        $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 5. 将文件对象，存储到 fd 中
                fd.append('cover_img', blob)
                // 6. 发起 ajax 数据请求
                publishArticle(fd);
            })
    })
    function publishArticle(fd){
        $.ajax({
            type:'POST',
            url:'/my/article/add',
            data:fd,
            contentType:false,
            processData:false,
            success(res){
                if(res.status !== 0) return layer.msg('提交失败！');
                layer.msg('提交成功！');
                // 跳转到list 列表
                location.href='../article/art_list.html';
            }
        })
    }

})