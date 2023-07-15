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
	getCouponList(params) {
		return request.get("/mobile/user_coupon", params)
	},

	// 搜索课程/专栏
	getSearchResult(params) {
		return request.get("/mobile/search", params)
	},

	// 查看课程详情，查看拼团课程详情
	getCourseDetail(params) {
		return request.get("/mobile/course/read", params)
	},

	// 查看专栏详情，查看拼团专栏详情，查看秒杀专栏详情
	getColumnDetail(params) {
		return request.get("/mobile/column/read", params)
	},

	// 我的学习记录列表
	getUserhistory(params) {
		return request.get("/mobile/user_history/list", params)
	},


	// 更新学习记录
	updateUserhistory(data) {
		return request.post("/mobile/user_history/update", data)
	},

	// 考场列表
	getTestpaperList(params) {
		return request.get("/mobile/testpaper/list", params)
	},

	// 开始考试
	readTestpaper(params) {
		return request.get("/mobile/testpaper/read", params)
	},

	// 考试交卷
	submitTest(data) {
		return request.post("/mobile/user_test/save", data)
	},

	// 我的考试记录
	getUserTestList(params) {
		return request.get("/mobile/user_test/list", params)
	},

	// 社区列表
	getbbsList(params) {
		return request.get("/mobile/bbs", params)
	},

	// 帖子列表
	getPostList(params) {
		return request.get("/mobile/post/list", params)
	},

	// 点赞帖子
	postSupport(data) {
		return request.post("/mobile/post/support", data)
	},

	// 取消点赞帖子
	postUnsupport(data) {
		return request.post("/mobile/post/unsupport", data)
	},

	// 发布帖子
	postSave(data) {
		return request.post("/mobile/post/save", data)
	},

	// 查看帖子
	readPost(params) {
		return request.get("/mobile/post/read", params)
	},

	// 查看帖子评论列表
	readPostComment(params) {
		return request.get("/mobile/post_comment", params)
	},

	// 评论帖子
	replyPost(data) {
		return request.post("/mobile/post/reply", data)
	},

	// 我的帖子列表
	readMyPost(params) {
		return request.get("/mobile/mypost", params)
	},

	// 删除帖子
	deletePost(data) {
		return request.post("/mobile/post/delete", data)
	},

	// 电子书列表
	getBookList(params) {
		return request.get("/mobile/book/list", params)
	},

	// 查看电子书详情
	readBookDetail(params) {
		return request.get("/mobile/book/read", params)
	},

	// 查看电子书章节和内容
	getBookChapter(params) {
		return request.get("/mobile/book/detail", params)
	},

	// 公告列表
	getNoticeList(params) {
		return request.get("/mobile/notice/list", params)
	},

	// 收藏课程or专栏
	collect(data) {
		return request.post("/mobile/collect", data)
	},

	// 取消收藏课程or专栏
	uncollect(data) {
		return request.post("/mobile/uncollect", data)
	},

	// 我的收藏列表
	readMyCollect(params) {
		return request.get("/mobile/user_fava", params)
	},

	// 课程列表
	getCourseList(params) {
		return request.get("/mobile/course/list", params)
	},

	// 专栏列表
	getColumnList(params) {
		return request.get("/mobile/column/list", params)
	},

	// 获取可用秒杀列表
	getFlashsaleList(params) {
		params.usable = 1
		return request.get("/mobile/flashsale", params)
	},

	// 获取可用拼团列表
	getGroupList(params) {
		params.usable = 1
		return request.get("/mobile/group", params)
	},

	// 立即学习
	learnNow(data) {
		return request.post("/mobile/order/learn", data)
	},

	// 下单前获取产品信息
	readGoods(params) {
		return request.get("/mobile/goods/read", params)
	},

	// 获取指定课程or专栏的可用优惠券数
	getUserCouponCount(params) {
		return request.get("/mobile/user_coupon/count", params)
	},

	// 创建订单
	createOrder(data) {
		return request.post("/mobile/order/save", data)
	},
	
	// 微信app或小程序或H5支付订单
	wxpay(data) {
		return request.post("/mobile/order/wxpay", data)
	},
}