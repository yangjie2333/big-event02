$(function() {

    // 1.表单验证
    var form = layui.form
    form.verify({
        nickname: function(value) { //value：表单的值、item：表单的DOM对象
            if (value.length > 6) {
                return '请输入1~6个字符';
            }
        }
    })

    // 2.获取用户信息
    function initUserInfo() {
        $.ajax({
            type: 'get',
            url: '/my/userinfo',
            success: function(res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layui.layer.msg(res.message)
                }
                // 将获取的值赋值到表单
                form.val('formUserInfo', res.data)
            }
        })
    }

    initUserInfo()

    // 3.重置
    $('#resetForm').on('reset', function(e) {
        e.preventDefault()

        // 表单重置
        initUserInfo()
    })

    // 4.更新资料
    $('#resetForm').on('submit', function(e) {
        e.preventDefault()
        $.ajax({
            type: 'post',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg(res.message)
                }
                layui.layer.msg(res.message)

                // 更新完成更改欢迎处的字样
                window.parent.getUserInfo()
            }
        })
    })
})