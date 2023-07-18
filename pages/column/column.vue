<template>
	<view>
		<view class="position-relative">
			<image class="detail-image bg-light" :src="detail.cover" mode="widthFix"></image>
			<view class="detail-text text-white font-sm p-1">专栏</view>
		</view>

		<active-bar :price="activeData.data.price" :t_price="detail.price" :end_time="activeData.data.end_time"
			v-if="activeData && !detail.isbuy">
			<text v-if="activeData.type == 'group'">{{ activeData.data.p_num }}人拼团</text>
			<text class="p"  v-else>{{ activeData.data.used_num }}人已抢 / 剩 {{ activeData.data.s_num - activeData.data.used_num }} 名</text>
		</active-bar>

		<tab :current="current" :tabs="tabs" @change="handleChange"></tab>

		<!-- 简介部分 -->
		<view class="animate__animated animate__fadeIn animate__faster" v-if="current == 0">
			<view class="flex flex-column p-3" v-if="firstLoading">
				<text>{{ detail.title }}</text>
				<view class="flex justify-between">
					<text class="text-light-muted font-sm mt-1 mb-2">{{ detail.sub_count }}人学过</text>
					<collect-btn :goods_id="Number(detail.id)" type="column" :isfava="detail.isfava" size="20px"
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

			<uni-card title="专栏简介" is-full :border="false">
				<mp-html :content="detail.content">
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
				<view class="flex">
					<text
						class="border border-danger rounded text-danger font-sm px-1 mt-1 mr-1">{{ item.type | formatType }}</text>
					<text class="border border-danger rounded text-danger font-sm px-1 mt-1"
						v-if="item.price == 0">免费试看</text>
				</view>
			</menu-item>
		</view>

		<template v-if="!detail.isbuy && firstLoading">
			<view style="height: 75px;"></view>
			<view class="fixed-bottom bg-white p-2 border-top">
				<main-btn @submit="handleSubmit">{{ detail.price == 0 ? '立即学习' : '立即订购' + '￥' + detail.price}}</main-btn>
			</view>
		</template>
	</view>
</template>

<script>
	export default {
		filters: {
			formatType(value) {
				let type = {
					media: '图文',
					audio: '视频',
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
				list: [],
				group_id: 0,
				flashsale_id: 0,
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

			if (e.group_id) {
				this.group_id = e.group_id
			}

			if (e.flashsale_id) {
				this.flashsale_id = e.flashsale_id
			}
		},
		onShow() {
			this.getData()
		},
		methods: {
			getData() {
				this.$api.getColumnDetail({
					id: this.detail.id,
					group_id: this.group_id,
					flashsale_id: this.flashsale_id
				}).then(res => {
					this.detail = res
					this.list = res.column_courses

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
			handleChange(index) {
				this.current = index
			},
			openDirectory(item) {
				if (item.price != 0 && !this.detail.isbuy) {
					return this.$toast('请先购买该专栏')
				}
				this.authJump(`/pages/course-detail/course-detail?id=${item.id}&column_id=${this.detail.id}`)
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
				let type = 'column'
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