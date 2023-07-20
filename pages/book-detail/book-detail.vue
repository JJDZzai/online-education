<template>
	<view>
		<view class="position-relative">
			<view class="cource-one scroll-row-item mr-2 mt-3">
				<view class="view-first">
					<image class="cource-image rounded" :src="detail.cover" mode="widthFix"></image>
				</view>
				<view class="view-second flex flex-column">
					<text class="font-lg mt-1">{{ detail.title }}</text>
					<view class="flex flex-1 align-end mb-1">
						<view class="flex align-center text-danger border rounded p-2"
							style="width: 150px; background-color: #FFF7EE; border-color: #F9F0EF;">
							<text class="font">￥{{ detail.price }}</text>
							<text class="text-through font-sm ml-1">￥{{ detail.t_price }}</text>
							<text class="font-sm mx-1"> | </text>
							<text class="font-sm">{{ detail.sub_count }}人</text>
						</view>
					</view>
				</view>
			</view>
		</view>

		<view class="divider"></view>

		<tab :current="current" :tabs="tabs" @change="handleChange"></tab>

		<!-- 简介部分 -->
		<view class="animate__animated animate__fadeIn animate__faster" v-if="current == 0">
			<view class="flex flex-column p-3" v-if="firstLoading">
				<text>{{ detail.title }}</text>
				<text class="text-light-muted font-sm mt-1 mb-2">{{ detail.sub_count }}人学过</text>
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

			<uni-card title="电子书简介" is-full :border="false">
				<mp-html :content="detail.try">
					<view class="flex justify-center align-center text-light-muted">加载中...</view>
				</mp-html>
			</uni-card>
		</view>

		<!-- 目录部分 -->
		<view class="animate__animated animate__fadeIn animate__faster" v-else>
			<view class="p-3">
				<view class="border rounded bg-light text-muted p-2">共 {{ list.length }} 节</view>
			</view>

			<menu-item v-for="(item,index) in list" :key="index" :title="item.title" :index="index"
				@open="openDirectory(item)">
				<text class="border border-danger rounded text-danger font-sm px-1 mt-1"
					v-if="item.isfree == 1">免费试读</text>
			</menu-item>
		</view>

		<template v-if="!detail.isbuy && firstLoading">
			<view style="height: 75px;"></view>
			<view class="fixed-bottom bg-white p-2 border-top">
				<main-btn
					@submit="handleSubmit">{{ detail.price == 0 ? '立即学习' : '立即订购' +  '￥'+ detail.price}}</main-btn>
			</view>
		</template>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				detail: {},
				list: [],
				firstLoading: false, // 按钮加载
				current: 0,
				tabs: [{
					name: "简介",
				}, {
					name: "目录",
				}],
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
		},
		onShow() {
			this.getData()
		},
		methods: {
			getData() {
				this.$api.readBookDetail({
					id: this.detail.id
				}).then(res => {
					this.detail = res
					this.list = res.book_details
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
			handleChange(index) {
				this.current = index
			},
			openDirectory(item) {
				if (item.isfree == 0 && !this.detail.isbuy) {
					return this.$toast('请先购买该电子书')
				}
				this.authJump(`/pages/book-column/book-column?id=${item.id}&book_id=${this.detail.id}`)
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
				let type = 'book'
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

	.cource-one {
		display: flex !important;
		padding: 10px;
	}

	.cource-one .view-first {
		flex-shrink: 1;
		margin-right: 20rpx;
	}

	.cource-one .view-second {
		width: 525rpx;
	}

	.cource-one .cource-image {
		width: 258rpx;
		height: 380px;
	}
</style>