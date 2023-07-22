<template>
	<view>
		<view>
			<!-- #ifndef MP -->
			<uni-icons class="login-icon" type="left" size="20" color="#FFFFFF" @click="handleBack"></uni-icons>
			<!-- #endif -->

			<view class="login-bg"></view>
		</view>

		<view class="login-section">
			<view class="mb-5">
				<text class="login-section-title">找回密码</text>
			</view>

			<view class="login-section-form">
				<uni-icons type="person" size="20"></uni-icons>
				<input class="font" type="text" v-model="form.phone" placeholder="请输入手机号">
			</view>

			<view class="login-section-form">
				<uni-icons type="email" size="20"></uni-icons>
				<input class="font" type="text" v-model="form.code" placeholder="验证码">
				<code-btn :phone="form.phone"></code-btn>
			</view>

			<view class="login-section-form">
				<uni-icons type="locked-filled" size="20"></uni-icons>
				<input class="font" type="text" v-model="form.password" placeholder="请输入密码">
			</view>

			<view class="login-section-form">
				<uni-icons type="locked-filled" size="20"></uni-icons>
				<input class="font" type="text" v-model="form.repassword" placeholder="请输入确认密码">
			</view>

			<button class="text-light font bg-main" hover-class="bg-main-hover" @click="submit">
				立即找回
			</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				form: {
					phone: "",
					code: "",
					password: "",
					repassword: ""
				}
			}
		},
		methods: {
			handleBack() {
				uni.navigateBack({
					delta: 1
				});
			},
			submit() {
				uni.showLoading({
					title: '找回中...',
					mask: false
				})
				let data = Object.assign(this.form, {})
				this.$api.forgetPwd(data).then((res) => {
					this.$toast('找回成功')
					setTimeout(() => {
						this.handleBack()
					}, 350)
				}).finally(() => {
					uni.hideLoading()
				})
			}
		}
	}
</script>

<style>

</style>