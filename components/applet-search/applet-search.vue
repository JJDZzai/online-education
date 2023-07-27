<template>
	<view>
		<view class="fixed-top bg-white">
			<view :style="{ height: `${height}px` }"></view>
			<view class="flex align-center" style="height: 44px;">
				<view class="flex align-center justify-center" style="width: 44px;height: 44px;" @click="handleBack">
					<uni-icons type="arrowleft" size="20"></uni-icons>
				</view>
				<input class="rounded-circle px-3 bg-light" style="height: 35px;width: 400rpx;" :value="value"
					type="text" placeholder="请输入关键词" placeholder-style="font-size: 14px"
					@input="$emit('input',$event.detail.value)" @confirm="$emit('confirm')" />
			</view>
		</view>
		<view style="height: 84px;"></view>
	</view>
</template>

<script>
	export default {
		name: "search-bar",
		data() {
			return {
				height: 0
			}
		},
		mounted() {
			// #ifdef MP
			const rect = uni.getMenuButtonBoundingClientRect()
			this.height = rect.top - 5
			// #endif
		},
		props: {
			value: {
				type: [Number, String],
				default: ""
			},
		},
		model: {
			prop: "value",
			event: "input"
		},
		methods: {
			handleBack() {
				uni.navigateBack({
					delta: 1
				});
			}
		},
	}
</script>

<style>

</style>