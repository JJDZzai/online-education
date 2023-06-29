<template>
	<view class="p-3">
		<view class="flex bg-white rounded shadow">
			<view class="flex-1 flex flex-column justify-center align-center py-3" v-for="(item, index) in icons"
				:key="index" @click="open(item)" hover-class="bg-light">
				<text class="iconfont icons-card-iconfont" :class="item.icon"></text>
				<text class="font-sm text-secondary">{{item.name}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "icons-card",
		props: {
			icons: {
				type: Array,
				default: []
			}
		},
		data() {
			return {

			};
		},
		methods: {
			open(item) {
				if (!item.path) {
					return
				}
				this.authJump(item.path)
			}
		}
	}
</script>

<style>
.icons-card-iconfont {
	font-size: 40rpx;
	color: #00bfff;
	margin-bottom: 10rpx;
}
</style>