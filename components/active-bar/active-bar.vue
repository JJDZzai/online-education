<template>
	<view class="flex justify-between align-center text-white bg-danger px-3 py-2" style="margin-top: -5px;">
		<view>
			<view>
				<text class="font text-white mr-1">￥{{ price }}</text>
				<text class="font-sm text-white text-through">￥{{ t_price }}</text>
			</view>
			<view class="flex justify-center align-center font text-danger bg-white rounded mt-1"
				style="padding: 5rpx;">
				<slot></slot>
			</view>
		</view>
		<view class="flex align-center">
			<text class="mr-2" style="font-size: 14px;">距结束</text>
			<uni-countdown color="#FFFFFF" splitorColor="#FFFFFF" border-color="#FFFFFF" background-color="#c3152e"
				:day="time.day" :hour="time.hour" :minute="time.minute" :second="time.second"></uni-countdown>
		</view>
	</view>
</template>

<script>
	import tool from '@/common/tool.js'

	export default {
		name: "active-bar",
		props: {
			price: {
				type: String,
				default: ''
			},
			t_price: {
				type: String,
				default: ''
			},
			end_time: {
				type: String,
				default: ''
			}
		},
		data() {
			return {
				time: {
					day: 0,
					hour: 0,
					minute: 0,
					second: 0
				}
			};
		},
		created() {
			this.formatTime()
		},
		watch: {
			end_time() {
				this.formatTime()
			}
		},
		methods: {
			formatTime() {
				this.time = tool.dateCount(this.end_time)
			}
		},
	}
</script>

<style>

</style>