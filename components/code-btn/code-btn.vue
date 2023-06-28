<template>
	<view class="code-btn bg-main" hover-class="bg-main-hover" @click="sendCode">
		{{time > 0 ? (time + 's') : '发送'}}
	</view>
</template>

<script>
	let timer = null
	export default {
		name: "code-btn",
		data() {
			return {
				time: 0
			};
		},
		props: {
			phone: {
				type: [Number, String],
				default: ''
			}
		},
		methods: {
			sendCode() {
				if (this.time > 0) {
					return
				}

				// 获取手机验证码
				this.$api.getCaptcha({
					phone: this.phone
				}).then(res => {
					console.log(res);
					if (typeof res == 'number') {
						this.$toast('验证码：' + res)
					} else {
						this.$toast('发送成功')
					}
					this.time = 60
					timer = setInterval(() => {
						this.time--
						if (this.time <= 0) {
							clearInterval(timer)
						}
					}, 1000)
				})
			}
		}
	}
</script>

<style>
	.code-btn {
		display: flex;
		justify-content: center;
		align-items: center;
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		width: 200rpx;
		font-size: 28rpx;
		color: #FFFFFF;
		border-top-right-radius: 8rpx;
		border-bottom-right-radius: 8rpx;
	}
</style>