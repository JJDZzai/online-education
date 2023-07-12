<template>
	<view>
		<view style="height: 50px;"></view>
		<view class="test-actions">
			<view class="iconfont icon-shangyibu" :class="current <= 1 ? 'text-light-muted' : ''" @click="handlePre">
			</view>
			<view @click="$emit('open')">
				<view class="iconfont icon-leimupinleifenleileibie"></view>
				<view class="flex justify-center align-center font-sm">
					<text class="text-main">{{ current }}</text>
					<text>/{{ total }}</text>
				</view>
			</view>
			<view @click="submit" v-if="!show">
				<view class="iconfont icon-tijiao"></view>
				<text class="font-sm">交卷</text>
			</view>
			<view class="iconfont icon-xiayibu" :class="current >= total ? 'text-light-muted' : ''" @click="handleNext">
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "test-actions",
		props: {
			current: {
				type: Number,
				default: 1
			},
			total: {
				type: Number,
				default: 1
			},
			show: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {

			};
		},
		methods: {
			submit() {
				this.$emit('submit')
			},
			handlePre() {
				if (this.current <= 1) {
					return
				}
				this.$emit('on-page', this.current - 1)
			},
			handleNext() {
				if (this.current >= this.total) {
					return
				}
				this.$emit('on-page', this.current + 1)
			}
		}
	}
</script>

<style>
	.test-actions {
		display: flex;
		align-items: center;
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		height: 50px;
		background-color: #FFFFFF;
		border-top: 1rpx solid #ccc;

		& view {
			flex: 1;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
		}

		& .iconfont {
			font-size: 40rpx;
		}
	}
</style>