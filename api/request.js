import {
	log
} from 'util'
import store from '../store/index.js'

export default {
	config: {
		// 接口基础路径
		baseURL: 'http://ceshi8.dishaxy.com',

		// appid
		appid: 'bd9d01ecc75dbbaaefce',

		// 请求拦截器
		beforeRequest(options = {}) {
			return new Promise((resolve, reject) => {
				// 公共参数
				options.url = this.baseURL + options.url
				options.method = options.method || 'GET'
				options.header = {
					appid: this.appid,
					token: store.state.token
				}

				// 权限验证 

				resolve(options)
			})
		},

		// 响应拦截器
		handleResponse([error, res]) {
			return new Promise((resolve, reject) => {
				// 错误提示处理
				if (res.statusCode != 200 || res.data.msg == 'fail') {
					let msg = res.data.data || "请求失败"
					uni.showToast({
						title: msg,
						icon: 'none'
					});

					if (res.data.data == 'Token 令牌不合法，请重新登录' || res.data.data == '您没有权限访问该接口!') {
						// 这里调用退出登录方法是为了在 token 过期时清除本地存储，退出重新登录
						store.commit('LOGOUT')

						setTimeout(() => {
							uni.navigateTo({
								url: '/pages/login/login'
							})
						}, 350)
					}
					// console.log(res);
					return reject(msg)
				}
				resolve(res.data.data)
			})
		}
	},
	request(options = {}) {
		return this.config.beforeRequest(options).then(opt => uni.request(opt)).then(this.config.handleResponse)
	},

	// get 请求
	get(url, params = {}, options = {}) {
		options.url = url
		options.method = 'GET'
		options.url += params ? ('?' + Object.keys(params).map(key => key + '=' + params[key]).join('&')) : ''
		return this.request(options)
	},

	// post 请求
	post(url, data = {}, options = {}) {
		options.url = url
		options.method = 'POST'
		options.data = data
		return this.request(options)
	},

	// 上传文件
	upload(url, data = {}, options = {}) {
		options.url = url
		return this.config.beforeRequest(options).then(opt => {
			return new Promise((resolve, reject) => {
				let uploadTask = uni.uploadFile({
					url: opt.url, //仅为示例，非真实的接口地址
					filePath: data.filePath,
					name: data.name || 'file',
					header: opt.header,
					success: (res) => {
						if (res.statusCode !== 200) {
							reject('上传失败')
							return uni.showModal({
								title: "上传失败",
								icon: 'none'
							})
						}
						let message = JSON.parse(res.data)
						resolve(message.data)
					},
					fail: (err) => {
						resolve(err.message)
					}
				});

				// 监听上传进度
				uploadTask.onProgressUpdate((res) => {
					if (options.onProgress && typeof options.onProgress == 'function') {
						options.onProgress(res.progress)
					}
				});
			})
		})
	}
}