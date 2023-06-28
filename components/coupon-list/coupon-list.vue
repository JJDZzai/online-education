<template>
	<view class="p-2">
		<scroll-view scroll-x="true" class="scroll-row">
			<view class="coupon text-white mr-3" v-for="i in 3" :key="i">
				<view class="coupon-price flex flex-column justify-center align-center bg-hover-warning px-3 py-2">
					<text>￥100</text>
					<text class="font">满￥200 可用</text>
				</view>
				<view class="coupon-text flex justify-center align-center bg-warning font px-1"
					hover-class="bg-hover-warning">领取</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		name: "coupon-list",
		data() {
			return {

			};
		}
	}
</script>

<style>
	.coupon {
		display: inline-flex;
		width: 310rpx;

		.coupon-price {
			border-right: 2rpx dashed;
		}

		& .coupon-text {
			width: 120rpx;
		}
	}
</style>