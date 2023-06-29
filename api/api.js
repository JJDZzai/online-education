import request from './request.js'

export default {
	// 获取首页数据
	getIndexData() {
		return request.get("/mobile/index")
	},

	// 获取可用拼团列表
	getGroup(params) {
		return request.get("/mobile/group", params)
	},

	// 获取可用拼团列表
	getFlashsale(params) {
		return request.get("/mobile/flashsale", params)
	},

	// 账号注册
	regAccount(data) {
		return request.post("/mobile/reg", data)
	},

	// 账号登录
	loginAccount(data) {
		return request.post("/mobile/login", data)
	},

	// 获取手机验证码
	getCaptcha(data) {
		return request.post("/mobile/get_captcha", data)
	},

	// 绑定手机号
	bindPhoneNumber(data) {
		return request.post("/mobile/bind_mobile", data)
	},

	// 找回密码
	forgetPwd(data) {
		return request.post("/mobile/forget", data)
	},

	// 退出登录
	logout() {
		return request.post("/mobile/logout")
	},

	// 修改密码
	updatePassword(data) {
		return request.post("/mobile/update_password", data)
	},

	// 上传文件
	upload(filePath, onProgress) {
		return request.upload('/mobile/upload', {
			filePath
		}, {
			onProgress
		})
	},

	// 修改资料
	updateInfo(data) {
		return request.post("/mobile/update_info", data)
	},

	// 我的订单列表
	getOrderList(params) {
		return request.get("/mobile/order/list", params)
	},

	// 获取可用优惠券列表
	getCoupon() {
		return request.get("/mobile/coupon")
	},

	// 领取优惠券 
	receiveCoupon(data) {
		return request.post("/mobile/user_coupon/receive", data)
	},
	
	// 我的优惠券列表
	getCouponList(data) {
		return request.get("/mobile/user_coupon", data)
	},
}