<template>
	<view class="p-2">
		<scroll-view scroll-x="true" class="scroll-row">
			<view class="coupon text-white mr-2" :class="item.isgetcoupon ? 'coupon-isget' : ''"
				v-for="(item, index) in list" :key="index">
				<view class="coupon-left flex flex-column justify-center align-center bg-hover-warning px-3 py-2">
					<text class="font-md">￥{{ item.price }}</text>
					<text class="font-sm">适用{{ item.type | formatType }}: {{item.value.title}}</text>
				</view>
				<view class="coupon-right flex justify-center align-center bg-warning font px-1"
					hover-class="bg-hover-warning" @click="receiveCoupon(item)">
					{{ item.isgetcoupon ? '已领取' : '领取' }}
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		name: "coupon-list",
		filters: {
			formatType(value) {
				let type = {
					course: '课程',
					column: '专栏'
				}
				return type[value]
			}
		},
		data() {
			return {
				list: []
			};
		},
		created() {
			this.getData()
		},
		methods: {
			getData() {
				this.$api.getCoupon().then(res => {
					this.list = res
				})
			},
			receiveCoupon(item) {
				uni.showLoading({
					title: "领取中",
					mask: false
				})
				this.$api.receiveCoupon({
					coupon_id: item.id
				}).then(res => {
					this.$toast('领取成功')
					item.isgetcoupon = true
				}).finally(() => {
					uni.hideLoading()
				})
			}
		}
	}
</script>

<style>
	.coupon {
		display: inline-flex;
		min-width: 310rpx;
	}

	.coupon .coupon-left {
		border-right: 2rpx dashed;
	}

	.coupon .coupon-right {
		width: 120rpx;
	}

	.coupon-isget>view:first-child {
		background-color: #dae0e5;
	}

	.coupon-isget>view:last-child {
		background-color: #dae0e5;
	}
</style>