import { createRouter, createWebHashHistory } from "vue-router";
/*浏览器上面进度条*/
import NProgress from "nprogress";
import "nprogress/nprogress.css";

NProgress.configure({
	showSpinner: false, // 是否显示加载ico
});

const routes = [
	{
		path: "/:dkxh",
		name: "home",
		component: () => import("@/views/Home.vue"),
		meta: {
			keepAlive: true, //是否需要缓存
		},
	},
	{
		path: "/plan/:dkxh/:status/:id/:fx",
		name: "plan",
		component: () => import("@/views/plan/Index.vue"),
		meta: {
			keepAlive: true, //是否需要缓存
		},
	},
	{
		path: "/dcExcel/:dkxh",
		name: "dcExcel",
		component: () => import("@/views/me/dcExcel.vue"),
		meta: {
			keepAlive: true, //是否需要缓存
		},
	},
	{
		path: "/downExcel/:dkxh",
		name: "downExcel",
		component: () => import("@/views/me/downExcel.vue"),
		meta: {
			keepAlive: true, //是否需要缓存
		},
	},
	{
		path: "/shupdate",
		name: "shupdate",
		component: () => import("@/views/me/shupdate.vue"),
		meta: {
			keepAlive: true, //是否需要缓存
		},
	},
	{
		path: "/me",
		name: "me",
		component: () => import("@/views/me/Index.vue"),
		meta: {
			keepAlive: true, //是否需要缓存
		},
	},
	{
		path: "/me/apply",
		name: "apply",
		component: () => import("@/views/me/apply.vue"),
		meta: {
			keepAlive: true, //是否需要缓存
		},
	},
	{
		path: "/me/approve",
		name: "approve",
		component: () => import("@/views/me/approve.vue"),
		meta: {
			keepAlive: true, //是否需要缓存
		},
	},
	{
		path: "/allList",
		name: "allList",
		component: () => import("@/views/AllList/index.vue"),
		meta: {
			keepAlive: true, //是否需要缓存
		},
	},
	{
		path: "/share",
		name: "share",
		component: () => import("@/views/share/share.vue"),
	},
	{
		path: "/detail",
		name: "detail",
		component: () => import("@/views/share/detail.vue"),
	},
	{
		path: "/:pathMatch(.*)*",
		name: "404",
		component: () => import("@/views/404/cw.vue"),
	},
	
];

const router = createRouter({
	history: createWebHashHistory(),
	routes,
});

router.beforeEach((to, from, next) => {
	//如果设置标题就显示，没设置使用默认
	// if (null != to.meta && null != to.meta.title && '' !== to.meta.title) {
	//     document.title = to.meta.title || import.meta.env.VITE_APP_TITLE;
	// } else {
	//     document.title = import.meta.env.VITE_APP_TITLE;
	// }
	//浏览器上方显示进度条
	NProgress.start();
	//正常放行
	next(vm =>{
        if(to.redirectedFrom){//vue-router redirect不会刷新页面，需要判断并刷新
            // vm.$router.go(0)//safari浏览器go(0)无效
            window.location.reload();
        }
    });
});

router.afterEach((transition) => {
	//关闭浏览器上方的进度条
	NProgress.done();
});


export default router;
