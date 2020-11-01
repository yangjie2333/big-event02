$(function() {
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage;

    // console.log(location.hash.slice(1));
    // 渲染表单内容
    function renderForm() {
        var id = location.hash.slice(1)

        $.ajax({
            url: '/my/article/' + id,
            success: function(res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }

                form.val('form-edit', res.data)

                tinyMCE.activeEditor.setContent(res.data.content)
                if (!res.data.cover_img) {
                    return layer.msg('未上传头像')
                }
                var url = baseUrl + res.data.cover_img
                $image
                    .cropper('destroy') // 销毁旧的裁剪区域
                    .attr('src', url) // 重新设置图片路径
                    .cropper(options) // 重新初始化裁剪区域
            }
        })
    }

    // 初始化富文本编辑器
    initEditor()

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 点击选择封面触发文件域的自动点击事件
    $('#btnChooseImage').on('click', function() {
        $('#coverFile').trigger('click')
    })

    // 下拉框分类渲染
    function initCate() {
        $.ajax({
            url: '/my/article/cates',
            success: function(res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }

                // 渲染下拉框内容
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                    // 表格实时渲染
                form.render()
                renderForm()

            }
        })
    }
    initCate()

    // 图片上传
    $('#coverFile').on('change', function() {
        // 获取图片文件
        var file = this.files

        if (file.length === 0) {
            return
        }

        var imgUrl = URL.createObjectURL(file[0])
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', imgUrl) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    // 发布文章
    var state = '已发布'

    $('#btnSave2').on('click', function() {
        state = '草稿'
    })

    $('#form-edit').on('submit', function(e) {
        e.preventDefault()
        var fd = new FormData(this)

        fd.append('state', state)

        // 拿到图片对象.放入fd中
        $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 5. 将文件对象，存储到 fd 中
                fd.append('cover_img', blob)

                console.log(...fd);
                // 6. 发起 ajax 数据请求
                pubArticle(fd)
            })
    })

    function pubArticle(fd) {
        $.ajax({
            type: 'post',
            url: '/my/article/add',
            data: fd,
            processData: false,
            contentType: false,
            success: function(res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg(res.message)
                setTimeout(function() {
                    window.parent.document.getElementById('art-list').click()
                }, 5000)

            }
        })
    }
})