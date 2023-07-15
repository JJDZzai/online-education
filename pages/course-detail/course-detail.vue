<template>
	<view>
		<view class="position-relative" v-if="!detail.isbuy">
			<image class="detail-image bg-light" :src="detail.cover" mode="widthFix"></image>
			<view class="detail-text text-white font-sm p-1">{{ detail.type | formatType }}</view>
		</view>

		<!-- 视频播放器 -->
		<video class="detail-video" :src="detail.content" controls :poster="detail.cover"
			v-else-if="detail.type == 'video'" @timeupdate="onVideoTimeUpdate"></video>

		<!-- 音频播放器 -->
		<f-audio :detail="detail" type="course" :src="detail.content" :poster="detail.cover"
			v-else-if="detail.type == 'audio'" @timeupdate="onAudioTimeUpdate"
			@refresh="detail.isfava = $event"></f-audio>


		<!-- 拼团 -->
		<active-bar :price="activeData.data.price" :t_price="detail.price" :end_time="activeData.data.end_time"
			v-if="activeData && !detail.isbuy">
			<text v-if="activeData.type == 'group'">{{ activeData.data.p_num }}人拼团</text>
			<text v-else>{{ activeData.data.used_num }}人已抢 / 剩
				{{ activeData.data.s_num - activeData.data.used_num }}名</text>
		</active-bar>

		<view class="animate__animated animate__fadeIn animate__faster">
			<view class="flex flex-column p-3" v-if="firstLoading">
				<text>{{ detail.title }}</text>
				<view class="flex justify-between">
					<text class="text-light-muted font-sm mt-1 mb-2 mr-1">{{ detail.sub_count }}人学过</text>
					<collect-btn :goods_id="Number(detail.id)" type="course" :isfava="detail.isfava"
						@refresh="detail.isfava = $event"></collect-btn>
				</view>
				<view v-if="!detail.isbuy">
					<text class="text-danger font mr-1">￥{{ detail.price }}</text>
					<text class="text-light-muted font-sm text-through">￥{{ detail.t_price }}</text>
				</view>
			</view>

			<!-- 价格骨架屏优化 -->
			<view class="flex flex-column p-3" v-else>
				<skeleton width="480rpx" height="25rpx" oClass="mr-1"></skeleton>
				<skeleton width="100rpx" height="20rpx" oClass="mt-1 mb-2"></skeleton>
				<view class="flex">
					<skeleton width="100rpx" height="25rpx" oClass="font mr-1"></skeleton>
					<view class="flex align-end">
						<skeleton width="100rpx" height="20rpx" oClass="font-sm"></skeleton>
					</view>
				</view>
			</view>

			<view class="divider"></view>

			<uni-card :title="(detail.isbuy && detail.type == 'media') ? '课程内容' : '课程介绍'" is-full :border="false">
				<view id="media">
					<mp-html :content="(detail.isbuy && detail.type == 'media') ? detail.content : detail.try"
						@ready="onMediaReady">
						<view class="flex justify-center align-center text-light-muted">加载中...</view>
					</mp-html>
				</view>
			</uni-card>

			<template v-if="!detail.isbuy && firstLoading">
				<view style="height: 75px;"></view>
				<view class="fixed-bottom bg-white p-2 border-top">
					<main-btn @submit="handleSubmit">{{ detail.price == 0 ? '立即学习' : '立即订购' + detail.price}}</main-btn>
				</view>
			</template>
		</view>
	</view>
</template>

<script>
	// 窗口高度
	let windowHeight = uni.getSystemInfoSync().windowHeight
	export default {
		filters: {
			formatType(value) {
				let type = {
					media: '图文',
					audio: '音频',
					video: '视频'
				}
				return type[value]
			}
		},
		data() {
			return {
				// 普通课程数据
				detail: {},
				// 秒杀/拼团数据
				activeData: null,
				column_id: 0,
				group_id: 0,
				flashsale_id: 0,
				firstLoading: false, // 按钮加载
				scrollTop: 0,
				mediaHeight: 0,
				progress: 0
			}
		},
		// 页面滚动事件
		onPageScroll(e) {
			if (this.detail.isbuy && this.detail.type == 'media' && e.scrollTop > this.scrollTop) {
				this.scrollTop = e.scrollTop
				this.sumMediaProgress()
			}
		},
		onLoad(e) {
			this.detail.id = e.id
			// 判断传递过来 id 是否有值
			if (!this.detail.id) {
				this.$toast('非法参数')
				setTimeout(() => {
					uni.navigateBack({
						delta: 1
					})
				}, 700)
			}

			if (e.column_id) {
				this.column_id = e.column_id
			}

			if (e.group_id) {
				this.group_id = e.group_id
			}

			if (e.flashsale_id) {
				this.flashsale_id = e.flashsale_id
			}

			this.getData()
		},
		beforeDestroy() {
			this.updateUserHistory()
		},
		methods: {
			getData() {
				this.$api.getCourseDetail({
					id: this.detail.id,
					column_id: this.column_id,
					group_id: this.group_id,
					flashsale_id: this.flashsale_id
				}).then(res => {
					this.detail = res

					if (res.group) {
						this.activeData = {
							type: 'group',
							data: res.group
						}
					}

					if (res.flashsale) {
						this.activeData = {
							type: 'flashsale',
							data: res.flashsale
						}
					}

					uni.setNavigationBarTitle({
						title: this.detail.title
					})
				}).catch((err) => {
					if (err == '该记录不存在') {
						setTimeout(() => {
							return uni.navigateBack({
								delta: 1
							})
						}, 700)
					}
				}).finally(() => {
					this.firstLoading = true
				})
			},
			// mp-html 高度 (计算是从 mp-html 开始)
			onMediaReady() {
				const Query = uni.createSelectorQuery().in(this)
				Query.select('#media').boundingClientRect((data) => {
					this.mediaHeight = parseInt(data.height)
					this.sumMediaProgress()
				}).exec();
			},
			// 记录课程图文学习进度
			sumMediaProgress() {
				if (this.mediaHeight > 0) {
					// 算法: (((滚动值 + 窗口高度) / 开始位置的高度) * 100).toFixed(2)
					this.progress = (((this.scrollTop + windowHeight) / this.mediaHeight) * 100).toFixed(2)
					this.progress = this.progress > 100 ? 100 : this.progress
				}
			},
			// 视频进度
			onVideoTimeUpdate(e) {
				let {
					currentTime,
					duration
				} = e.detail
				if (duration > 0) {
					this.progress = ((currentTime / duration) * 100).toFixed(2)
				}
			},
			// 音频进度
			onAudioTimeUpdate(value) {
				this.progress = value
			},
			// 更新进度，请求接口
			updateUserHistory() {
				if (!this.detail.isbuy) return

				// 如果 column_id == 0，就是从课程进来，否则就是专栏进来
				let data = {}
				if (this.column_id == 0) {
					data = {
						id: this.detail.id,
						type: 'course',
						progress: this.progress
					}
				} else {
					data = {
						id: this.column_id,
						type: 'column',
						detail_id: this.detail.id
					}
				}

				this.$api.updateUserhistory(data)
			},
			handleSubmit() {
				if (this.detail.price == 0) {
					this.$load('提交中...')
					this.$api.learnNow({
						goods_id: this.detail.id,
						type: 'course'
					}).then((res) => {
						this.getData()
					}).finally(() => {
						this.$hide()
					})
				}

				let id = this.detail.id
				let type = 'course'
				this.authJump(`../create-order/create-order?id=${id}&type=${type}`)
			}
		}
	}
</script>

<style>
	.detail-image {
		width: 100%;
		height: 420rpx;
	}

	.detail-video {
		width: 100%;
		height: 420rpx;
	}

	.detail-text {
		position: absolute;
		right: 20rpx;
		bottom: 30rpx;
		background-color: rgba(0, 0, 0, 0.4);
	}
</style>