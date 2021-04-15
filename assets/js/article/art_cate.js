$(function () {
    const layer = layui.layer;
    const form = layui.form;
    // 获取文章分类列表
    function initArtCateList() {
        $.ajax({
            type: "GET",
            url: '/my/article/cates',
            success(res) {
                if (res.status !== 0) return layer.msg('获取文章失败！');
                // console.log(res.data);
                const htmlStr = template('tpl-table', res);
                // console.log(htmlStr);
                $('tbody').html(htmlStr);
            }
        })
    }
    initArtCateList();

    // 添加文章
    // 1.弹出弹窗
    let indexAdd = null;
    $('#btnAddCate').on('click', function () {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $("#dialog-add").html(),
        });
    })
    // 2.点击确认添加文章
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault();
        $.ajax({
            type: "POST",
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success(res) {
                console.log(res);
                if (res.status !== 0) return layer.msg('添加分类失败！');
                layer.msg('添加分类成功！');
                initArtCateList();
                // 根据索引关闭弹出层
                layer.close(indexAdd);
            }
        })
    })

    // 编辑 代理方式
    let indexEdit = null;
    $('tbody').on('click', '#btn-edit', function (e) {
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $("#dialog-edit").html(),
        });
        // 弹出窗填充数据
        const id = $(this).attr('data-id');
        // console.log(id);
        $.ajax({
            type: "GET",
            url: '/my/article/cates/' + id,
            success(res) {
                // console.log(res.data);
                form.val('form-edit', res.data);
            }
        })
    })
    $('body').on('submit', '#form-edit', function (e){
        e.preventDefault();
        $.ajax({
            type: "POST",
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success(res) {
                // console.log(res);
                if (res.status !== 0) return layer.msg('更新分类失败！');
                layer.msg('更新分类成功！');
                initArtCateList();
                // 根据索引关闭弹出层
                layer.close(indexEdit);
            }
        })
    })
    // 删除数据
    $('tbody').on('click','#btn-del',function(){
        const id=$(this).attr('data-id');
        console.log(id);
        layer.confirm('确定删除?', {icon: 3, title:'提示'}, function(index){
            //do something
            $.ajax({
                type:'GET',
                url:'/my/article/deletecate/'+ id,
                success(res){
                    if (res.status !== 0) return layer.msg('删除失败！');
                    layer.msg('删除成功！');
                    initArtCateList();
                }
            })
            layer.close(index);
          }); 
    })


})