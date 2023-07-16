<template>
	<view>
		<uni-load-more status="loading" v-if="!firstLoading"></uni-load-more>

		<view class="animate__animated animate__fadeIn animate__faster" v-else-if="!liveDetail.isbuy">
			<view class="position-relative">
				<image class="live-detail-image bg-light" :src="liveDetail.cover" mode="widthFix"></image>
				<view
					class="flex flex-column justify-center align-center position-absolute top-0 right-0 bottom-0 left-0 text-white"
					style="background-color: rgba(0, 0, 0, 0.4);">
					<text class="mb-1">{{ liveDetail.start_time }}</text>
					<text>{{ liveDetail.end_time }}</text>
				</view>
			</view>

			<view class="animate__animated animate__fadeIn animate__faster">
				<view class="flex flex-column p-3" v-if="firstLoading">
					<text>{{ liveDetail.title }}</text>
					<view class="flex justify-between">
						<text class="text-light-muted font-sm mt-1 mb-2 mr-1">{{ liveDetail.sub_count }}人学过</text>
					</view>
					<view>
						<text class="text-danger font mr-1">￥{{ liveDetail.price }}</text>
						<text class="text-light-muted font-sm text-through">￥{{ liveDetail.t_price }}</text>
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

				<uni-card title="直播介绍" is-full :border="false">
					<view id="media">
						<mp-html :content="liveDetail.try">
							<view class="flex justify-center align-center text-light-muted">加载中...</view>
						</mp-html>
					</view>
				</uni-card>

				<template v-if="firstLoading">
					<view style="height: 75px;"></view>
					<view class="fixed-bottom bg-white p-2 border-top">
						<main-btn
							@submit="handleSubmit">{{ liveDetail.price == 0 ? '立即学习' : '立即订购' +'￥' + liveDetail.price}}</main-btn>
					</view>
				</template>
			</view>
		</view>

		<view v-else>
			<live-play :item="liveDetail"></live-play>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				firstLoading: false,
				liveDetail: {
					cover: "",
					created_time: "",
					end_time: "",
					id: 0,
					isbuy: false,
					key: "",
					playUrl: "",
					price: 0,
					school_id: 0,
					start_time: "",
					status: "直播中",
					sub_count: 0,
					t_price: "",
					title: "",
					try: "",
					type: "",
					updated_time: ""
				}
			}
		},
		onLoad(e) {
			uni.setNavigationBarTitle({
				title: this.liveDetail.title
			})

			if (!e.id) {
				this.$toast('非法参数')
				setTimeout(() => {
					uni.navigateBack({
						delta: 1
					});
				}, 700)
			}
			this.liveDetail.id = e.id

			this.getData()
		},
		methods: {
			getData() {
				this.firstLoading = false
				this.$api.readLive({
					id: this.liveDetail.id,
				}).then(res => {
					this.liveDetail = res

					uni.setNavigationBarTitle({
						title: this.liveDetail.title
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
			handleSubmit() {
				if (this.liveDetail.price == 0) {
					this.$load('提交中...')
					this.$api.learnNow({
						goods_id: this.liveDetail.id,
						type: 'live'
					}).then((res) => {
						this.getData()
					}).finally(() => {
						this.$hide()
					})
				}

				let id = this.liveDetail.id
				let type = 'live'
				this.authJump(`../create-order/create-order?id=${id}&type=${type}`)
			}
		}
	}
</script>

<style>
	.live-detail-image {
		width: 100%;
		height: 420rpx;
	}
</style>