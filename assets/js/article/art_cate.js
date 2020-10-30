$(function() {
    var layer = layui.layer
    var form = layui.form
    var indexAdd, indexEdit, indexDel

    // 渲染表格内容
    function initArtCateList() {
        $.ajax({
            url: '/my/article/cates',
            success: function(res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // layer.msg(res.message)

                // 用模板引擎渲染表格内容
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
            }
        })
    }
    initArtCateList()

    // 添加类别弹出层
    $('#btnAddCate').on('click', function() {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '249px'],
            title: '添加文章分类',
            content: $('#diaLogAdd').html()
        });
    })

    // 确认添加,需要事件委托
    $('body').on('submit', '#form-add', function(e) {
        e.preventDefault()

        $.ajax({
            type: 'post',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function(res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg(res.message)
                    // 重新渲染表格
                initArtCateList()
                    // 关闭弹出层
                layer.close(indexAdd)
            }
        })
    })

    // 点击编辑按钮渲染弹出层
    $('body').on('click', '#btn-edit', function() {

        // 添加弹出层
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '249px'],
            title: '修改文章分类',
            content: $('#diaLogEdit').html()
        });

        // 根据id渲染输入框的值
        var id = $(this).data('id')
        $.ajax({
            url: '/my/article/cates/' + id,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                form.val('form-edit', res.data)
            }
        })
    })


    // 确认添加
    $('body').on('submit', '#form-edit', function(e) {
        e.preventDefault()

        $.ajax({
            type: 'post',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg(res.message)
                    // 重新渲染表格
                initArtCateList()
                    // 关闭弹出层
                layer.close(indexEdit)
            }
        })
    })

    // 删除
    $('body').on('click', '#btn-del', function() {
        var id = $(this).data('id')
            // 添加弹出层
        indexDel = layer.confirm('确定删除?', { icon: 3, title: '提示' }, function(index) {
            //do something
            $.ajax({
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    layer.msg(res.message)
                        // 重新渲染表格
                    initArtCateList()
                        // 关闭弹出层
                    layer.close(indexDel)
                }
            })
        });
    })
})