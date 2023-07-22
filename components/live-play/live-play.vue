<template>
	<view>
		<!-- 直播播放器，只在H5端生效 -->
		<!-- #ifdef H5 -->
		<view id="video"></view>
		<!-- #endif -->

		<!-- #ifdef APP-PLUS -->
		<video id="video" style="width: 750rpx; height: 420rpx;" :src="detail.playUrl" controls autoplay danmu-btn
			enable-danmu :danmu-list="appBarrageList" v-if="showAppVideo"></video>

		<view class="flex justify-center align-center bg-dark" style="width: 750rpx; height: 420rpx;" v-else>
			<text class="font text-white">加载中...</text>
		</view>
		<!-- #endif -->

		<!-- #ifdef MP -->
		<live-player :src="detail.playUrl" autoplay @statechange="statechange" @error="error"
			style="width: 750rpx; height: 420rpx;" />
		<!-- #endif -->

		<!-- 滚动视图 -->
		<scroll-view class="bg-light" :style="'height: '+ scrollH +'px;'" scroll-y="true"
			:scroll-into-view="scrollInto">
			<view class="font text-danger p-2">系统提示：直播内容及互动评论须严格遵守直播规范，严禁传播违法违规，低俗血暴，吸烟酗酒，造谣诈骗等不良有害信息。</view>
			<view :id="'live_'+ barrage.id" class="p-2 font" v-for="(barrage, index) in barrageList" :key="index">
				<text class="text-muted">{{ barrage.name }}：</text>
				<text>{{ barrage.content }}</text>
			</view>
		</scroll-view>

		<!-- 评论 -->
		<view style="height: 50px;"></view>
		<view class="flex fixed-bottom bg-white border-top p-2">
			<view class="flex-1 text-muted bg-light border rounded p-2" style="font-size: 28rpx;" @click="handlePopup">
				说一句吧</view>
		</view>

		<comment-popup ref="popupRef" @send="sendBarrage"></comment-popup>
	</view>
</template>

<script>
	// 只在H5端生效
	// #ifdef H5
	import 'xgplayer';
	import FlvPlayer from 'xgplayer-flv';
	// #endif

	export default {
		name: "live-play",
		props: {
			item: {
				type: Object,
				default: () => ({})
			}
		},
		data() {
			return {
				// scrollH: 500,
				height: 500,
				// 播放器
				videoPlayer: null,
				// 弹幕(评论)
				barrageList: [],
				// 评论滚动
				scrollInto: '',
				// 弹幕出现时间，毫秒
				currentTime: 0,
				// APP 弹幕
				appBarrageList: [],
				showAppVideo: false

			};
		},
		created() {
			// 获取弹幕列表
			this.getData()

			// let res = uni.getSystemInfoSync()
			// this.scrollH = res.windowHeight - uni.upx2px(420) - 50 // upx2px 将rpx单位值转换成px
		},
		beforeDestroy() {
			// #ifdef H5
			this.videoPlayer.off('timeupdate', this.handleTimeUpdate)
			// #endif
		},
		computed: {
			scrollH() {
				let res = uni.getSystemInfoSync()
				return this.height = res.windowHeight - uni.upx2px(420) - 50 // upx2px 将rpx单位值转换成px
			}
		},
		methods: {
			getData() {
				this.$api.readLiveComment({
					page: 1,
					limit: '500',
					live_id: this.item.id
				}).then(res => {
					// #ifdef H5
					this.initH5Video(res.rows)
					// #endif	

					// #ifdef APP-PLUS
					this.initAppVideo(res.rows)
					// #endif
				})
			},
			// APP 弹幕
			initAppVideo(comments = []) {
				this.appBarrageList = comments.map(r => {
					return {
						text: `${r.name}: ${r.content}`, //弹幕文字内容
						color: r.color, //该条弹幕为彩色弹幕，默认false
						time: parseInt(r.time / 1000)
					}
				})
				this.showAppVideo = true
				this.$nextTick(() => {
					this.videoPlayer = uni.createVideoContext('video', this)
				})
			},

			// H5 弹幕
			initH5Video(comments = []) {
				// 处理弹幕格式
				comments = comments.map(r => {
					return {
						duration: 5000, //弹幕持续显示时间,毫秒(最低为5000毫秒)
						id: r.id, //弹幕id，需唯一
						start: r.time, //弹幕出现时间，毫秒
						prior: true, //该条弹幕优先显示，默认false
						color: true, //该条弹幕为彩色弹幕，默认false
						txt: `${r.name}: ${r.content}`, //弹幕文字内容
						style: { //弹幕自定义样式
							color: r.color,
							borderRadius: '50px',
							padding: '5px 5px',
							backgroundColor: 'rgba(255, 255, 255, 0.1)'
						},
					}
				})

				this.videoPlayer = new FlvPlayer({
					id: 'video',
					url: this.item.playUrl, // 拉流，服务器已有直播，把链接拉过来，赋值
					isLive: true,
					playsinline: true,
					height: uni.upx2px(420),
					width: window.innerWidth,
					danmu: {
						panel: true, //弹幕面板
						comments, //弹幕数组
						area: { //弹幕显示区域
							start: 0, //区域顶部到播放器顶部所占播放器高度的比例
							end: 1 //区域底部到播放器顶部所占播放器高度的比例
						},
						closeDefaultBtn: false, //开启此项后不使用默认提供的弹幕开关，默认使用西瓜播放器提供的开关
						defaultOff: false //开启此项后弹幕不会初始化，默认初始化弹幕
					},
					keyShortcut: 'on',
					keyShortcutStep: { //设置调整步长
						currentTime: 15, //播放进度调整步长，默认10秒
						volume: 0.2 //音量调整步长，默认0.1
					},
					// 倍速播放
					playbackRate: [0.5, 0.75, 1, 1.5, 2],
					defaultPlaybackRate: 1
				});
				// 播放时间改变
				this.videoPlayer.on('timeupdate', this.handleTimeUpdate)
			},
			handleTimeUpdate(e) {
				this.currentTime = parseInt(e.currentTime * 1000)
			},
			// 打开 popup 弹窗
			handlePopup() {
				this.$refs.popupRef.open()
			},
			// 随机颜色
			getRandomColor() {
				const rgb = []
				for (let i = 0; i < 3; ++i) {
					let color = Math.floor(Math.random() * 256).toString(16)
					color = color.length == 1 ? '0' + color : color
					rgb.push(color)
				}
				return '#' + rgb.join('')
			},
			// 接收 comment-popup 传递过来的事件
			sendBarrage(content) {
				let cont = content.replace(/(^\s*)|(\s*$)/g, "");
				if (cont == '') {
					return this.$toast('弹幕内容不能为空')
				}

				this.$load('加载中...')
				this.$api.sendLiveComment({
					live_id: this.item.id,
					content,
					time: this.currentTime,
					color: this.getRandomColor()
				}).then(res => {
					this.barrageList.push(res)
					setTimeout(() => {
						this.scrollInto = 'live_' + res.id
					}, 300)

					// 同步弹幕到H5视频中
					// #ifdef H5
					this.videoPlayer.danmu.sendComment({
						duration: 5000, //弹幕持续显示时间,毫秒(最低为5000毫秒)
						id: res.id, //弹幕id，需唯一
						start: res.time, //弹幕出现时间，毫秒
						prior: true, //该条弹幕优先显示，默认false
						color: true, //该条弹幕为彩色弹幕，默认false
						txt: `${res.name}: ${res.content}`, //弹幕文字内容
						style: { //弹幕自定义样式
							color: res.color,
							borderRadius: '50px',
							padding: '5px 5px',
							backgroundColor: 'rgba(255, 255, 255, 0.1)'
						},
					})
					// #endif

					// 同步弹幕到APP视频中
					// #ifdef APP-PLUS
					this.videoPlayer.sendDanmu({
						text: `${res.name}: ${res.content}`,
						color: color: res.color,
					})
					// #endif
				}).finally(() => {
					this.$hide()
				})
			},
			// 小程序播放器方法
			// #ifdef MP
			statechange(e) {
				console.log('live-player code:', e.detail.code)
			},
			error(e) {
				console.error('live-player error:', e.detail.errMsg)
			}
			// #endif
		}
	}
</script>

<style>

</style>