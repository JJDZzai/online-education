<template>
	<view class="no-login">
		<image src="/static/noLogin.png" mode="widthFix"></image>
		<text class="text-muted font-sm mb-3">登录后才可以查看学习哦</text>
		<button type="default" size="mini" plain @click="navigateTo('/pages/login/login')">立即登录</button>
	</view>
</template>

<script>
	export default {
		name: "no-login",
		data() {
			return {

			};
		}
	}
</script>

<style>
	.no-login {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		position: fixed;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
	}
	
	.no-login image {
		width: 350rpx;
		height: 350rpx;
	}
</style>