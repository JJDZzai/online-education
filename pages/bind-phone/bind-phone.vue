<template>
	<view>
		<view>
			<uni-icons class="login-icon" type="left" size="20" color="#FFFFFF" @click="handleBack"></uni-icons>

			<view class="login-bg"></view>
		</view>

		<view class="login-section">
			<view class="mb-5">
				<text class="login-section-title">绑定手机号</text>
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

			<button class="text-light font bg-main" hover-class="bg-main-hover" @click="submit">
				绑 定
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
					title: '绑定中...',
					mask: false
				})
				let data = Object.assign(this.form, {})
				this.$api.bindPhoneNumber(data).then((res) => {
					this.$toast('绑定成功')
					// 防止绑定手机号丢失
					this.$store.commit('UPDATEINFO', {
						phone: data.phone
					})
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