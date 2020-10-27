$(function() {
    // 1.点击链接切换显示与隐藏
    $('#link-reg').on('click', function() {
        $('.login-box').hide()
        $('.reg-box').show()
    })
    $('#link-login').on('click', function() {
        $('.reg-box').hide()
        $('.login-box').show()
    })

    // 2.表单验证
    var form = layui.form
    var layer = layui.layer
    form.verify({
        // 密码框验证
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        // 确认密码框验证
        repwd: function(value) {
            var pwd = $('.reg-box [name=password]').val()
            if (pwd !== value) {
                return '两次输入密码不一致'
            }
        }
    })

    // 3.注册
    $('#form-reg').on('submit', function(e) {
        // 阻止默认事件
        e.preventDefault()

        // 进行ajax获取数据
        $.ajax({
            type: 'post',
            url: '/api/reguser',
            data: {
                username: $('#form-reg [name=username]').val(),
                password: $('#form-reg [name=password]').val()
            },
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg(res.message)

                // 给去登录绑定自动点击事件
                $('#link-login').click()

                // 清空form表单
                $('#form-reg')[0].reset()
            }
        })
    })

    // 4.登录
    $('#form_login').on('submit', function(e) {
        e.preventDefault()

        $.ajax({
            type: 'post',
            url: '/api/login',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg(res.message)

                // 把返回的token值保存到本地
                localStorage.setItem('token', res.token)

                // 跳转到index.html
                location.href = '/index.html'
            }
        })
    })
})