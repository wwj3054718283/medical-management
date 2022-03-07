import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/user/Users.vue'
import Rights from '../components/power/Rights.vue'
import Roles from '../components/power/Roles.vue'
import Cate from '../components/goods/Cate.vue'
import Params from '../components/goods/Params.vue'
import Oneself from '../components/onself/Oneself.vue'
import Department from '../components/department/department.vue'
import Drug from '../components/drug/drug.vue'
import Xray from '../components/X_ray/Xray.vue'
Vue.use(VueRouter)

const routes = [

]

const router = new VueRouter({
    routes: [{
        path: '/',
        redirect: '/login'
    },
    {
        path: '/login',
        component: Login
    },
    {
        path: '/home',
        component: Home,
        redirect: '/welcome',
        children: [{
            path: '/welcome',
            component: Welcome
        },
        {
            path: '/users',
            component: Users
        }, {
            path: '/Xray',
            component: Xray
        },{
            path: '/department',
            component: Department
        }, {
            path: '/drug',
            component: Drug
        },
        {
            path: '/oneself',
            component: Oneself
        },
        {
            path: '/rights',
            component: Rights
        },
        {
            path: '/roles',
            component: Roles
        },
        {
            path: '/categories',
            component: Cate
        }
            ,
        {
            path: '/params',
            component: Params
        }
        ]
    }
    ]
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
    // to       将要访问路径
    // form     从哪个路径调转而来
    // next     放行函数
    // next()   放行    next('/login')  强制跳转
    if (to.path == '/login') return next()
    // 获取token
    const tokenStr = window.sessionStorage.getItem('token')
    if (!tokenStr) return next('/login')
    next()
})

export default router