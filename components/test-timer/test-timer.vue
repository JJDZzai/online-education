<template>
	<view>
	
		<view class="test-timer">
			考试时间：{{ time_out | formatTime }}
		</view>
		<view style="height: 45px;"></view>
	</view>
</template>

<script>
	let timer = null;
	export default {
		name: "test-timer",
		props: {
			expire: {
				type: Number,
				default: 120
			}
		},
		filters: {
			formatTime(time) {
				let hours = parseInt(time % (60 * 60 * 24) / (60 * 60))
				let minutes = parseInt(time % (60 * 60) / 60)
				let seconds = time % 60
				return (hours < 10 ? ('0' + hours) : hours) + ':' + (minutes < 10 ? ('0' + minutes) : minutes) + ':' + (
					seconds < 10 ? '0' + seconds : seconds)
			}
		},
		data() {
			return {
				time_out: 0
			};
		},
		mounted() {
			this.time_out = this.expire * 60
			if (this.time_out > 0) {
				timer = setInterval(this.handleTimeOut, 1000)
			}
		},
		beforeDestroy() {
			if (timer) {
				clearInterval(timer)
			}
		},
		methods: {
			handleTimeOut() {
				if (this.time_out == 0) {
					clearInterval(timer)
					this.$emit('end')
					return
				}
				this.time_out--
			}
		}
	}
</script>

<style>
	.test-timer {
		display: flex;
		justify-content: center;
		align-items: center;
		position: fixed;
		left: 0;
		right: 0;
		height: 50px;
		font-size: 30rpx;
		color: red;
		background-color: #FFFFFF;
		border-top: 2rpx solid red;
		border-bottom: 2rpx solid red;
		z-index: 100;
	}
</style>