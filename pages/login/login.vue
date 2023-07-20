<template>
	<view>
		<view>
			<uni-icons class="login-icon" type="left" size="20" color="#FFFFFF" @click="handleBack"></uni-icons>

			<view class="login-bg"></view>
		</view>

		<view class="login-section">
			<view class="mb-5">
				<text class="login-section-title">{{ type == 'login' ? '登 录' : '注 册' }}</text>
			</view>

			<view class="login-section-form">
				<uni-icons type="person" size="20"></uni-icons>
				<input class="font" type="text" v-model="form.username" placeholder="请输入用户名">
			</view>

			<view class="login-section-form">
				<uni-icons type="locked-filled" size="20"></uni-icons>
				<input class="font" type="text" v-if="showPwd" v-model="form.password" placeholder="请输入密码">
				<input class="font" type="password" v-else v-model="form.password" placeholder="请输入密码">

				<view class="locked-filled">
					<uni-icons v-show="showPwd" type="eye-filled" size="20" @click="changeShowpwd"></uni-icons>
					<uni-icons v-show="!showPwd" type="eye-slash" size="20" @click="changeShowpwd"></uni-icons>
				</view>
			</view>

			<view class="login-section-form" v-if="type == 'reg'">
				<uni-icons type="locked-filled" size="20"></uni-icons>
				<input class="font" type="text" v-if="showRePwd" v-model="form.repassword" placeholder="请输入确认密码">
				<input class="font" type="password" v-else v-model="form.repassword" placeholder="请输入确认密码">

				<view class="locked-filled">
					<uni-icons v-show="showRePwd" type="eye-filled" size="20" @click="changeReShowpwd"></uni-icons>
					<uni-icons v-show="!showRePwd" type="eye-slash" size="20" @click="changeReShowpwd"></uni-icons>
				</view>
			</view>

			<button class="font text-light bg-main" hover-class="bg-main-hover"
				@click="submit">{{ type == 'login' ? '登 录' : '注 册' }}
			</button>

			<view class="flex justify-between align-center font my-3">
				<text class="text-main" @click="changeType">{{ type == 'login' ? '注册账号' : '去登录' }}</text>
				<text class="text-light-muted" @click="forgetPwd">忘记密码？</text>
			</view>

			<view class="login-section-wechat">
				<!-- #ifndef MP -->
				<uni-icons type="weixin" size="30" color="#00bfff" @click="wechatLogin"></uni-icons>
				<!-- #endif -->

				<!-- #ifdef MP -->
				<button style="background-color: #FFFFFF; border: 0 !important;" type="default" open-type="getUserInfo"
					@getuserinfo="wechatMpLogin">
					<uni-icons type="weixin" size="30" color="#00bfff"></uni-icons>
				</button>
				<!-- #endif -->
			</view>

			<checkbox-group class="flex justify-center align-center" v-if="type == 'login'" @change="handleCheck">
				<label>
					<checkbox style="transform: scale(0.7);" color="#00bfff" />
				</label>
				<text class="text-light-muted font" @click="goRead">已阅读并同意用户协议&隐私声明</text>
			</checkbox-group>
		</view>
	</view>
</template>

<script>
	import tool from '@/common/tool.js'

	export default {
		data() {
			return {
				// 勾选协议默认值
				confirm: false,
				type: 'login',
				showPwd: false,
				showRePwd: false,
				form: {
					username: "",
					password: "",
					repassword: "",
				}
			}
		},
		onLoad() {
			// #ifdef H5
			// this.handleH5WechatLogin()
			// #endif
		},
		methods: {
			// H5登录
			handleH5WechatLogin() {
				// url中提取code
				let code = tool.getUrlCode('code')

				// 判断如果没有code才能进行登录，解决反复重定向
				if (!code) {
					tool.getH5Code()
					return
				}

				this.$load('登录中...')
				this.$api.weixinLogin({
					type: 'h5',
					code
				}).then(user => {
					this.handleLogin(user)
				}).finally(() => {
					this.$hide()
				})
			},
			// APP登录
			handleAppWechatLogin() {
				uni.login({
					provider: 'weixin',
					success: (res) => {
						let {
							access_token,
							openid
						} = res.authResult
						this.$load('登录中...')
						this.$api.weixinLogin({
							type: 'app',
							access_token,
							openid
						}).then(user => {
							this.handleLogin(user)
						}).finally(() => {
							this.$hide()
						})
					}
				})
			},
			// 小程序登录
			wechatMpLogin(e) {
				if (!this.beforeLogin()) {
					return
				}

				let rawData = e.detail.rawData
				uni.login({
					provider: 'weixin',
					success: (res) => {
						this.$load('登录中...')
						this.$api.weixinLogin({
							type: 'mp',
							code: res.code,
							rawData
						}).then(user => {
							this.handleLogin(user)
						}).finally(() => {
							this.$hide()
						})
					},
				});
			},
			// 登录公共方法
			handleLogin(user) {
				this.$store.commit('LOGIN', user)
				if (!user.phone) {
					// 重定向到绑定手机号页面
					uni.redirectTo({
						url: '../bind-phone/bind-phone'
					})
					return
				}
				this.$toast('登录成功')
				setTimeout(() => {
					// #ifdef H5
					uni.switchTab({
						url: '/pages/tabbar/home/home'
					})
					// #endif

					// #ifndef H5
					this.handleBack()
					// #endif
				}, 350)
			},
			changeShowpwd() {
				if (this.showPwd) {
					this.showPwd = false
				} else {
					this.showPwd = true
				}
			},
			changeReShowpwd() {
				if (this.showRePwd) {
					this.showRePwd = false
				} else {
					this.showRePwd = true
				}
			},
			handleBack() {
				uni.navigateBack({
					delta: 1
				});
			},
			changeType() {
				this.type = this.type == 'login' ? 'reg' : 'login'
			},
			resetForm() {
				this.form = {
					username: "",
					password: "",
					repassword: "",
				}
			},
			// 判断协议是否勾选
			beforeLogin() {
				if (!this.confirm && this.type == 'login') {
					this.$toast('请先阅读并同意用户协议&隐私声明')
					return false
				}
				return true
			},
			submit() {
				if (!this.beforeLogin()) {
					return
				}

				uni.showLoading({
					title: '提交中...',
					mask: false
				})
				let data = Object.assign(this.form, {})
				if (this.type == 'reg') {
					this.$api.regAccount(data).then(() => {
						this.$toast('注册成功')
						this.resetForm()
						this.changeType()
					}).finally(() => {
						uni.hideLoading()
					})
				} else {
					this.$store.dispatch('login', data).then(user => {
						// 	// 返回我的页面之前，要判断一下有没有绑定手机号
						if (!user.phone) {
							// 重定向到绑定手机号页面
							uni.redirectTo({
								url: '../bind-phone/bind-phone'
							})
							return
						}
						this.$toast('登录成功')
						setTimeout(() => {
							this.handleBack()
						}, 350)
					}).finally(() => {
						uni.hideLoading()
					})
				}
			},
			forgetPwd() {
				uni.navigateTo({
					url: '../forget-pwd/forget-pwd',
				});
			},
			handleCheck(e) {
				this.confirm = !!e.detail.value.length
			},
			// 微信登录
			wechatLogin() {
				if (!this.beforeLogin()) {
					return
				}
				// #ifdef H5
				tool.getH5Code()
				// #endif

				// #ifdef APP-PLUS
				this.handleAppWechatLogin()
				// #endif
			},
			goRead() {
				uni.navigateTo({
					url: './agreement/agreement',
				});
			}
		}
	}
</script>

<style>
	.locked-filled {
		position: absolute;
		top: 0;
		right: 0;
		width: 100rpx;
		height: 100rpx;
	}

	button::after {
		border: none;
	}
</style>