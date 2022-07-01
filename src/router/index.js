//创建路由器
import VueRouter from 'vue-router'

const router = new VueRouter({
    routes: [
        {
            path: '/',
            redirect: '/Draw'
        },
        {
            path: '/Draw',
            component: () => import('../pages/Draw.vue')
        },
        {
            path: '/Xinguobian',
            component: () => import('../pages/Timers/Xinguobian.vue')
        },
        {
            path: '/Fengzhan',
            component: () => import('../pages/Timers/Fengzhan.vue')
        },
        {
            path: '/Bank',
            component: () => import(`../pages/Bank.vue`),
        },
        {
            path: '/AddArguments',
            component: () => import('../pages/AddArguments.vue'),
            meta: {
                //证明 用户访问该组件的时候需要登陆
                auth: true
            }
        },
        {
            path: '/BankManagement',
            component: () => import('../pages/BankManagement.vue'),
            meta: {
                //证明 用户访问该组件的时候需要登陆
                auth: true
            }
        },
        {
            path: '/Login',
            component: () => import('../pages/Login.vue'),
        },
        {
            name: 'Register',
            path: '/Register',
            component: () => import('../pages/Register.vue'),
        },
        {
            path: '/MoreInfo',
            component: () => import('../pages/MoreInfo.vue'),
        },
        {
            path: '/EditInfo',
            component: () => import('../pages/EditInfo.vue'),
            meta: {
                //证明 用户访问该组件的时候需要登陆
                auth: true
            }
        },
        {
            path: '/EditPassword',
            component: () => import('../pages/EditPassword.vue'),
        },
        {
            path: '/PersonalCenter',
            component: () => import('../pages/PersonalCenter.vue'),
            redirect: '/PersonalCenter/Collection',
            children: [
                {
                    path: 'Collection',
                    component: () => import('../components/PersonalCenters/Collection.vue')
                },
                {
                    path: 'MyComments',
                    component: () => import('../components/PersonalCenters/MyComments.vue')
                },
                {
                    path: 'AccountInfo',
                    component: () => import('../components/PersonalCenters/AccountInfo.vue')
                },
                {
                    path: 'Feedback',
                    component: () => import('../components/PersonalCenters/Feedback.vue')
                },
                {
                    path: 'UserManagement',
                    component: () => import('../components/PersonalCenters/UserManagement.vue')
                },
            ],
            meta: {
                //证明 用户访问该组件的时候需要登陆
                auth: true
            }
        },
    ]
})

router.beforeEach((to, from, next) => {
    if (to.meta.auth) {
        if (localStorage.getItem('userInfo')) {
            //本地存储不是空的，已经登陆了。
            next();
        } else {
            alert('请您先登录')
            next(
                {
                    path: "/login"
                })
        }
    } else {
        //false直接放行，如果不调用可能会卡住页面
        next();
    }
});

export default router