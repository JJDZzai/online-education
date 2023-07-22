<template>
	<view>
		<view class="fixed-top">
			<view style="height: 20px;"></view>
			<view class="flex align-center" style="height: 44px;">
				<view class="flex justify-center align-center" style="width: 44px; height: 44px;">
					<uni-icons type="arrowleft" size="20" @click="handleBack"></uni-icons>
				</view>
				<input class="rounded-circle px-3 bg-light" style="width: 440rpx; height: 35px;" type="text"
					:value="value" placeholder="请输入关键词" placeholder-style="font-size: 14px" @input="handleInput"
					@confirm="handleConfirm" />
			</view>
		</view>
		<view style="height: 64px;"></view>
	</view>
</template>

<script>
	export default {
		name: "applet-search",
		props: {
			value: {
				type: [Number, String],
				default: ''
			}
		},
		model: {
			prop: "value",
			event: "input"
		},
		data() {
			return {};
		},
		methods: {
			handleInput(e) {
				this.$emit('input', e.detail.value)
			},
			handleConfirm() {
				this.$emit('confirm')
			},
			handleBack() {
				uni.navigateBack({
					delta: 1
				})
			}
		}
	}
</script>

<style>

</style>