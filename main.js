// #ifndef VUE3
import Vue from 'vue'
import App from './App'

// 引入 api 接口文件

import api from '@/api/api.js'
// Vuex
import store from '@/store/index.js'

Vue.config.productionTip = false

// 挂载 api
Vue.prototype.$api = api

// 消息提示
Vue.prototype.$toast = function(msg) {
	uni.showToast({
		title: msg,
		icon: 'none'
	})
}

// 路由跳转
Vue.prototype.navigateTo = function(url) {
	uni.navigateTo({
		url,
	})
}

// 权限验证
Vue.prototype.authJump = function(url) {
	if (!store.state.token) {
		return uni.navigateTo({
			url: '/pages/login/login'
		})
	}
	if (!store.state.user.phone) {
		return uni.navigateTo({
			url: '/pages/bind-phone/bind-phone'
		})
	}
	uni.navigateTo({
		url,
	})
}

App.mpType = 'app'

const app = new Vue({
	store,
	...App
})
app.$mount()
// #endif

// #ifdef VUE3
import {
	createSSRApp
} from 'vue'
import App from './App.vue'
export function createApp() {
	const app = createSSRApp(App)
	return {
		app
	}
}
// #endif