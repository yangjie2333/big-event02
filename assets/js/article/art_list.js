$(function() {
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage;

    var q = {
        pagenum: 1, // 页码值
        pagesize: 2, // 每页显示多少条数据
        cate_id: '', // 文章分类的 Id
        state: '', // 文章的状态， 可选值有： 已发布、 草稿   
    }

    // 渲染分类
    function renderCate() {
        $.ajax({
            url: '/my/article/cates',
            success: function(res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                var htmlStr = template('tpl-cate', res)
                    // 渲染表格
                $('[name=cate_id]').html(htmlStr)

                form.render()

            }
        })
    }
    renderCate()

    // 筛选
    $('#form-search').on('submit', function(e) {
        e.preventDefault()

        q.cate_id = $('[name=cate_id]').val()
        q.state = $('[name=state]').val()

        // 重新渲染表格
        renderTable()
    })

    // 渲染表格
    function renderTable() {
        $.ajax({
            url: '/my/article/list',
            data: q,
            success: function(res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }

                // 定义表格的模板引擎
                var htmlStr = template('tpl-table', res)
                    // 渲染表格
                $('tbody').html(htmlStr)
                renderPage(res.total)
                    // console.log(res.total);
            }
        })
    }

    renderTable()

    // 分页
    function renderPage(total) {

        //执行一个laypage实例
        laypage.render({
            elem: 'pageBox', //注意，这里的 test1 是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            // 每页显示的条数
            limit: q.pagesize,
            // 起始页
            curr: q.pagenum,
            // 每页条数的选择项
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 7, 10],
            jump: function(obj, first) {
                //obj包含了当前分页的所有参数，比如：
                // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                // console.log(obj.limit); //得到每页显示的条数

                //首次不执行
                if (!first) {
                    //do something
                    q.pagenum = obj.curr
                    q.pagesize = obj.limit
                    renderTable()
                }

            }
        });
    }

    // 删除
    $('body').on('click', '.btn-del', function() {
        var id = $(this).data('id')
        console.log(id);

        layer.confirm('确定删除?', { icon: 3, title: '提示' }, function(index) {
            //do something

            $.ajax({
                url: '/my/article/delete/' + id,
                success: function(res) {
                    console.log(res);
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    layer.msg(res.message)

                    if ($('.btn-del').length === 1 && q.pagenum > 1) q.pagenum-- // 渲染表格
                        renderTable()
                }
            })
            layer.close(index);
        });
    })
})