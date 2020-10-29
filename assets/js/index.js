// 入口函数
$(function() {
    getUserInfo()

    // 退出登录
    var layer = layui.layer
    $('#btnLogOut').on('click', function() {
        layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function(index) {
            //do something
            console.log(123);
            // 点击确认退出,清空本地存储token,跳转到登录页面
            localStorage.removeItem('token')
            location.href = '/login.html'

            layer.close(index);
        });
    })
})

// 封装一个全局的获取登录用户信息的函数
//后面需要调用
function getUserInfo() {
    // ajax获取用户信息
    $.ajax({
        type: "get",
        url: '/my/userinfo',
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function(res) {
            // console.log(res);
            if (res.status !== 0) {
                return layui.layer.msg(res.message)
            }
            // 获取用户信息成功渲染页面
            renderAvatar(res.data)
        }
    })
}

function renderAvatar(user) {
    // 优先渲染昵称,没有昵称渲染用户名
    var name = user.nickname || user.username

    // 渲染欢迎文本
    $('.welcome').html('欢迎&nbsp;&nbsp;' + name)

    // 判断用户是否有头像,有的话渲染用户自己的头像,没有渲染名字的首字母
    if (user.user_pic) {
        // 用户有头像
        $('.layui-nav-img').show().attr('src', user.user_pic)
        $('.text-avatar').hide()
    } else {
        var first = name[0].toUpperCase()
        $('.layui-nav-img').hide()
        $('.text-avatar').show().html(first)
    }
}