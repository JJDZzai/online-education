<template>
	<view class="bg-light">
		<view class="px-5 pt-5">
			<image class="f-audio-image bg-hover-light" :src="poster" mode='aspectFill'></image>
		</view>

		<!-- 滑动选择器 -->
		<view class="f-audio-slider">
			<slider :value="position" :max="duration" activeColor="#1B85FF" block-color="#1B85FF" block-size="15"
				@change="sliderChange" @changing="sliderChanging" step="1" />
			<view class="f-audio-time flex justify-between font-sm px-2">
				<text>{{ currentTime | formatTime }}</text>
				<text>{{ duration | formatTime }}</text>
			</view>
		</view>

		<!-- 音频播放器 -->
		<view class="f-audio-Player flex justify-center align-center pb-5">
			<text class="iconfont icon-ziyuan11" :style="{color: loopStatus ? '#1B85FF' : ''}" @click="loop"></text>
			<text class="iconfont mx-4" :class="isPlaying ? 'icon-tianchongxing-' : 'icon-bofang'"
				@click="handlePlay"></text>
			<text class="iconfont icon-shoucang1" style="font-size: 28px;"
				:style="{color: detail.isfava ? '#1B85FF' : ''}" @click="handleCollect"></text>
		</view>
	</view>
</template>

<script>
	import tool from '@/common/tool.js'

	export default {
		name: "f-audio",
		props: {
			detail: {
				type: Object,
				default: () => {}
			},
			type: {
				type: String,
				default: ''
			},
			src: {
				type: String,
				default: ''
			},
			poster: {
				type: String,
				default: ''
			}
		},
		filters: {
			formatTime(value) {
				if (value == 0) {
					return '00:00:00'
				}
				return tool.formatSeconds(value)
			}
		},
		data() {
			return {
				audioContext: null,
				currentTime: 0,
				duration: 1,
				isPlaying: false,
				isPlayEnd: false,
				isChanging: false,
				loopStatus: false
			};
		},
		beforeDestroy() {
			if (this.audioContext !== null && this.isPlaying) {
				this.stop()
			}
		},
		created() {
			this.createAudio()
		},
		computed: {
			position() {
				return this.isPlayEnd ? 0 : this.currentTime
			}
		},
		methods: {
			createAudio() {
				this.audioContext = uni.createInnerAudioContext()
				this.audioContext.src = this.src
				this.audioContext.autoplay = false
				// 进度更新
				this.audioContext.onTimeUpdate(() => {
					// 防止拖动进度条出现闪动
					if (this.isChanging) {
						return
					}
					this.currentTime = this.audioContext.currentTime
					this.duration = this.audioContext.duration

					if (this.duration > 0) {
						let progress = ((this.currentTime / this.duration) * 100).toFixed(2)
						this.$emit('timeupdate', progress)
					}
				})
				// 播放结束
				this.audioContext.onEnded(() => {
					this.currentTime = 0
					this.isPlaying = false
				})
				// 播放错误
				this.audioContext.onError(() => {
					this.isPlaying = false
				})
				// 音频进入会在播放状态并获取总时长，做初始化
				this.audioContext.onCanplay(() => {
					this.duration = this.audioContext.duration
				})
			},
			// 操作播放
			handlePlay() {
				if (this.isPlaying) {
					return this.handlePause()
				}
				this.isPlaying = true
				this.audioContext.play()
			},
			// 操作暂停
			handlePause() {
				this.isPlaying = false
				this.audioContext.pause()
			},
			// 监听进度条的改变，如果拖动进度条到指定位置，播放时不会出现反弹，而是继续向前播放
			sliderChange(e) {
				this.audioContext.seek(e.detail.value)
				this.isChanging = false
			},
			// 拖动中
			sliderChanging() {
				this.isChanging = true
			},
			// 停止播放，用于销毁
			stop() {
				this.audioContext.stop()
				this.isPlaying = false
			},
			// 循环播放
			loop() {
				this.loopStatus = !this.loopStatus
				this.audioContext.loop = this.loopStatus
				this.$toast((this.loopStatus ? '开启' : '关闭') + '循环')
			},
			// 收藏
			handleCollect() {
				let fun = this.detail.isfava ? 'uncollect' : 'collect'
				let msg = this.detail.isfava ? '取消收藏' : '已收藏'

				this.$api[fun]({
					goods_id: this.detail.id,
					type: this.type
				}).then(res => {
					this.$toast(msg)
					this.$emit('refresh', fun == 'collect' ? true : false)
				})
			}
		}
	}
</script>

<style>
	.f-audio-image {
		width: 100%;
		height: 400rpx;
		border-radius: 20rpx;
	}

	.f-audio-slider .f-audio-time {
		margin-top: -10rpx;
		margin-bottom: 30rpx;
	}

	.f-audio-Player>text:nth-child(1),
	.f-audio-Player>text:nth-child(3) {
		font-size: 50rpx;
		color: #bbb;
	}

	.f-audio-Player>text:nth-child(2) {
		font-size: 80rpx;
		color: #1B85FF;
	}
</style>