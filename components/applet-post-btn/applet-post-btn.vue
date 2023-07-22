<template>
	<view>
		<view class="fixed-btn bg-main" @click="$emit('jump')">
			<slot></slot>
		</view>
	</view>
</template>

<script>
	export default {
		name: "applet-post-btn",
		data() {
			return {

			};
		}
	}
</script>

<style>
	.fixed-btn {
		display: flex;
		justify-content: center;
		align-items: center;
		position: fixed;
		right: 40rpx;
		bottom: 150rpx;
		width: 80rpx;
		height: 80rpx;
		border-radius: 100%;
	}
</style>