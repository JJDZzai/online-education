import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import $api from '@/api/api.js'

export default new Vuex.Store({
	state: {
		user: '',
		token: '',
	},
	actions: {
		// 防止刷新丢失数据
		init({
			state
		}) {
			let user = uni.getStorageSync('user')
			if (user) {
				state.user = JSON.parse(user)
				state.token = state.user.token
			}
		},
		login({
			commit
		}, data) {
			return new Promise((resolve, reject) => {
				$api.loginAccount(data).then(user => {
					commit('LOGIN',user)
					resolve(user)
				}).catch((err) => {
					reject(err)
				})
			})
		},
		logout({commit}){
			return new Promise((resolve, reject)=>{
				$api.logout()
				commit('LOGOUT')
			})
		}
	},
	mutations: {
		LOGIN(state, user) {
			state.user = user
			state.token = user.token

			// 防止刷新丢失数据
			uni.setStorageSync('user', JSON.stringify(user))
		},

		LOGOUT(state) {
			state.user = ''
			state.token = ''
			uni.removeStorageSync('user')
		},

		// 防止绑定手机号丢失
		UPDATEINFO(state, data) {
			Object.keys(data).forEach(k => state.user[k] = data[k])
			uni.setStorageSync('user', JSON.stringify(state.user))
		}
	}
})