<template>
	<view>
		<!-- #ifdef APP-PLUS -->
		<uni-search-bar bgColor="#FFFFFF"></uni-search-bar>
		<!-- #endif -->

		<!-- 骨架屏组件，首屏优化 -->
		<index-skeleton v-if="loading"></index-skeleton>

		<!-- 展示内容 -->
		<view class="animate__animated animate__fadeIn animated_fast" v-else>
			<block v-for="(temp, index) in templates" :key="index">
				<!-- 搜索栏 -->
				<f-search-bar v-if="temp.type == 'search'" :placeholder="temp.placeholder"></f-search-bar>

				<!-- 轮播图 -->
				<swiper style="height: 310rpx;" v-else-if="temp.type == 'swiper'" :indicator-dots="true" circular acceleration :autoplay="true"
					:interval="3000" :duration="1000">
					<swiper-item class="flex justify-center" v-for="(swiper, sI) in temp.data" :key="sI"
						@click="handleSwiper(swiper)">
						<image :src="swiper.src" mode="aspectFill" class="swiper-item-image rounded shadow">
						</image>
					</swiper-item>
				</swiper>

				<!-- 图标导航 -->
				<icon-nav v-else-if="temp.type == 'icons'" :iconList="temp.data"></icon-nav>

				<!-- 优惠券 -->
				<coupon-list ref="couponRef" v-else-if="temp.type == 'coupon'"></coupon-list>

				<view v-else-if="temp.type == 'promotion'">
					<!-- 拼团 -->
					<active-list :type='temp.listType'></active-list>
				</view>

				<view v-else-if="temp.type == 'list'">
					<!-- 分割线 -->
					<view class="divider"></view>

					<!-- 最新列表 -->
					<view class="my-3 mx-2">
						<view class="flex justify-between">
							<text class="font-md font-weight-bold">{{ temp.title }}</text>
							<!-- <text class="font text-light-muted" v-if="temp.showMore">{{ temp.more.title }}</text> -->
							<text class="font text-light-muted" @click="openList">查看全部</text>
						</view>

						<view>
							<course-list :colType="temp.listType" v-for="(item, tI) in temp.data" :key="tI"
								:item="item"></course-list>
						</view>
					</view>
				</view>
				<view v-else-if="temp.type == 'imageAd'">
					<!-- 分割线 -->
					<view class="divider"></view>
					<image class="footer-image" :src="temp.data" mode="aspectFill" @click="handleAdv"></image>
				</view>
			</block>
		</view>
	</view>
</template>

<script>
	import indexSkeleton from './inex-skeleton/index-skeleton.vue'

	export default {
		components: {
			indexSkeleton
		},
		data() {
			return {
				templates: [],
				loading: false
			}
		},
		// 监听下拉刷新的钩子
		onPullDownRefresh() {
			this.getData()
		},
		created() {
			this.loading = true
			this.getData()

			uni.$on('userLogin', this.refreshCoupon)
			uni.$on('userLogout', this.refreshCoupon)
		},
		destroyed() {
			uni.$off('userLogin', this.refreshCoupon)
			uni.$off('userLogout', this.refreshCoupon)
		},
		methods: {
			getData() {
				this.$api.getIndexData().then(res => {
					this.templates = res
				}).finally(() => {
					this.loading = false
					uni.stopPullDownRefresh()
				})
			},
			handleSwiper(swiper) {
				if (swiper.type == 'webview') {
					this.navigateTo('/pages/webview/webview?url=' + swiper.url)
				} else {
					this.navigateTo('/pages/course-detail/course-detail?id=' + swiper.course_id)
				}
			},
			refreshCoupon() {
				if (this.$refs.couponRef && this.$refs.couponRef[0]) {
					this.$refs.couponRef[0].getData()
				}
			},
			// 列表页
			openList() {
				this.navigateTo('../../list/list?module=course')
			},
			handleAdv() {
				// #ifdef H5
				location.href = 'http://www.dishaxy.com'
				// #endif

				// #ifdef MP | APP-PLUS
				uni.navigateTo({
					url: '/pages/webview/webview?url=http://www.dishaxy.com'
				})
				// #endif
			},
		}
	}
</script>

<style>
	/* #ifndef MP */
	.swiper-item-image {
		width: 710rpx;
		height: 300rpx;
	}

	/* #endif */

	/* #ifdef MP */
	.swiper-item-image {
		width: 710rpx;
		height: 300rpx;
	}

	/* #endif */

	.footer-image {
		width: 750rpx;
		height: 360rpx;
	}
</style>