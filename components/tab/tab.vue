<template>
	<view class="tab">
		<view class="tab-item" :class="index == current ? 'tab-item-active' : ''" v-for="(cur,index) in tabs"
			:key="index" @click="$emit('change', index)">
			<text class="font-md">{{ cur.name }}</text>
			<view class="tab-line animate__animated animate__fadeIn" v-if="index == current"></view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "tab",
		props: {
			current: {
				type: Number,
				default: 0
			},
			tabs: {
				type: Array,
				default: []
			}
		},
		data() {
			return {

			};
		},
	}
</script>

<style>
	.tab {
		display: flex;
		border-bottom: 1rpx solid #f4f4f4;

		& .tab-item {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			flex: 1;
			position: relative;
			color: #888888;
			padding: 20rpx;

			& .tab-line {
				position: absolute;
				bottom: 0;
				width: 50rpx;
				height: 10rpx;
				background-color: #00CF8A;
				border-radius: 10rpx;
			}
		}
	}

	.tab-item-active {
		color: #00CF8A;
		font-weight: 600;
	}
</style>