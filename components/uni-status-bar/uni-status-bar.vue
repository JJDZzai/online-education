<template>
	<view>
		<view :style="{ height: statusBarHeight }"></view>
		<view :style="{ height: statusBarHeight,backgroundColor: bgColor }" class="uni-status-bar">
			<slot />
		</view>
	</view>
</template>

<script>
	export default {
		name: 'UniStatusBar',
		props: {
			bgColor: {
				type: String,
				default: ''
			}
		},
		data() {
			return {
				statusBarHeight: uni.getSystemInfoSync().statusBarHeight + 'px'
			}
		}
	}
</script>

<style lang="scss">
	.uni-status-bar {
		position: fixed;
		top: 0;
		right: 0;
		left: 0;
		z-index: 1000;
		// width: 750rpx;
		height: 20px;
		// height: var(--status-bar-height);
	}
</style>