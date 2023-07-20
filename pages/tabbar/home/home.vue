<template>
	<view class="animate__animated animate__fadeInDown animate__faster">
		<view class="home"></view>

		<view class="home-main position-relative">
			<!-- 未登录时的状态 -->
			<view class="flex p-3" v-if="!user">
				<image class="home-image bg-light rounded-circle" src=""></image>

				<view class="flex flex-column justify-center flex-1 text-white ml-3"
					@click="navigateTo('../../login/login')">
					<text class="font mb-2">立即登录</text>
					<text class="font-sm">登录解锁更多功能</text>
				</view>
			</view>

			<!-- 登录时的状态 -->
			<view class="flex align-center p-3" v-else @click="authJump('../../user-info/user-info')">
				<image class="home-image bg-light rounded-circle" :src="user.avatar" mode="widthFix"></image>

				<view class="flex flex-column justify-center flex-1 text-white ml-3">
					<text class="font mb-2">{{ user.nickname || user.username || user.phone }}</text>
					<text class="font-sm">{{ user.desc || '暂无描述' }}</text>
				</view>

				<text class="iconfont icon-set" style="color: #FFFFFF;"></text>
			</view>

			<icons-card :icons="icons"></icons-card>

			<view class="px-3">
				<uni-list :border="false">
					<uni-list-item title="我的优惠券" show-arrow clickable @click="authJump('../../my-coupon/my-coupon')">
						<text slot="header" class="iconfont icon-9 home-icon mr-2"></text>
					</uni-list-item>
					<uni-list-item title="常见问题" show-arrow clickable>
						<text slot="header" class="iconfont icon-help home-icon mr-2"></text>
					</uni-list-item>
					<uni-list-item title="设置" show-arrow clickable @click="navigateTo('../../setting/setting')">
						<text slot="header" class="iconfont icon-set home-icon mr-2"></text>
					</uni-list-item>
				</uni-list>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState
	}
	from 'vuex'

	export default {
		data() {
			return {
				icons: [{
					icon: "icon-OrderHistory",
					name: "订单",
					path: "/pages/order-list/order-list"
				}, {
					icon: "icon-pinglun2",
					name: "消息",
					path: "/pages/mes-list/mes-list"
				}, {
					icon: "icon-shoucang1",
					name: "收藏",
					path: "/pages/collect-list/collect-list"
				}, {
					icon: "icon-e-learning-monitor",
					name: "在学"
				}]
			}
		},
		computed: {
			...mapState({
				user: state => state.user
			}),
		},
		onNavigationBarButtonTap() {
			this.navigateTo('../../setting/setting')
		}
	}
</script>

<style>
	.home {
		position: fixed;
		width: 750rpx;
		height: 350rpx;
		background-color: #00bfff;
		border-bottom-left-radius: 100rpx;
		border-bottom-right-radius: 100rpx;
	}

	.home-main {
		margin-top: -1rpx;
	}

	.home-main .home-image {
		width: 120rpx;
		height: 120rpx;
	}

	.home-main .home-icon {
		font-size: 40rpx;
		color: #00bfff;
	}
</style>