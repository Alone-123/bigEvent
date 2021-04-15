$(function () {
    const layer = layui.layer;
    const form = layui.form;
    const laypage = layui.laypage;
    // 格式化时间
    template.defaults.imports.dataFormat = function (data) {
        const dt = new Date(data);
        const y = dt.getFullYear();
        const m = dt.getMonth() + 1;
        const s = dt.getDate();
        // 时间添加补零函数
        const hh = getTime(dt.getHours());
        const mm = getTime(dt.getMinutes());
        const ss = getTime(dt.getSeconds());
        return `${y}-${m}-${s} ${hh}:${mm}:${ss}`
    }
    // 补零函数
    function getTime(time) {
        return time > 9 ? time : '0' + time;
    }
    // 定义一个查询的参数对象，将来请求数据的时候，
    // 需要将请求参数对象提交到服务器
    const q = {
        pagenum: 1, // 页码值，默认请求第一页的数据
        pagesize: 3, // 每页显示几条数据，默认每页显示2条
        cate_id: '', // 文章分类的 Id
        state: '' // 文章的发布状态
    }

    // 渲染文章列表
    function renders() {
        $.ajax({
            type: 'GET',
            url: '/my/article/list',
            data: q,
            success(res) {
                if (res.status !== 0) return layer.msg('获取文章列表失败！');
                const htmlStr = template('tpl-table', res);
                $('#tpl-content').html(htmlStr);
                // 调用分页方法
                renderPage(res.total);
            }
        })
    }

    // 筛选区域 
    // 筛选文章分类
    function initCate() {
        $.ajax({
            type: 'GET',
            url: '/my/article/cates',
            success(res) {
                if (res.status !== 0) return layer.msg('获取分类数据失败！');
                const htmlCate = template('tpl-cate', res);
                // console.log(htmlCate);
                $('[name=cate_id]').html(htmlCate);
                // 通过 layui 重新渲染表单区域的UI结构
                form.render();
            }
        })
    }
    // 初始化文章列表
    renders();
    // 筛选文章分类
    initCate();


    // 筛选
    $('#form-search').on('submit', function (e) {
        e.preventDefault();
        // 获取表单的值,并赋值
        const cate_id = $('[name=cate_id]').val();
        const state = $('[name=cate_state]').val();
        // 添加到 q 中
        // 为查询参数对象 q 中对应的属性赋值
        q.cate_id = cate_id;
        q.state = state;
        // 根据最新的筛选条件，重新渲染表格的数据
        // 初始化文章列表
        renders();
    })

    // 分页
    function renderPage(total) {
        // console.log(total);
        // 调用 laypage.render() 方法来渲染分页的结构
        laypage.render({
            elem: 'pageBox', // 分页容器的 Id
            count: total, // 总数据条数
            limit: q.pagesize, // 每页显示几条数据
            curr: q.pagenum,// 设置默认被选中的分页
            // 自定义分页
            layout: ['count', 'limit', "prev", "page", "next", 'skip'],
            // limit 控制分页的展示条数
            limits: [1,2, 3, 5, 8],
            jump: function (obj, first) {
                // console.log(obj);//{elem: "pageBox", count: 7, limit: 2, curr: 2, jump: ƒ, …}
                // 把最新的页码值，赋值到 q 这个查询参数对象中
                q.pagenum = obj.curr;
                // 切换展示数据的条数
                q.pagesize = obj.limit;
                // 根据最新的 q 获取对应的数据列表，并渲染表格
                if (!first) {
                    renders();
                }

            }
        })
    }

    // 删除文章
    $('tbody').on('click', '#btn-del', function () {
        // 获取页面上所有的删除按钮
        const len=$(this).length;
        // console.log(len);
        const id=$(this).attr('data-Id');
        layer.confirm('确定删除?', { icon: 3, title: '提示' }, function (index) {
            // console.log(id);
            //do something
            $.ajax({
                type: 'GET',
                url: '/my/article/delete/'+id,
                // data: id,
                success(res) {
                    console.log(res);
                    if (res.status !== 0) return layer.msg('删除文章失败！');
                    layer.msg('删除文章成功！');
                    if(len===1 && q.pagenum!==1){
                        q.pagenum--;
                    }
                    renders();
                }
            });
        layer.close(index);
        })
    });


})