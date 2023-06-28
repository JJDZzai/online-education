<template>
	<view class="flex flex-wrap py-3">
		<view class="icon-nav flex flex-column justify-center align-center py-1" hover-class="bg-light"
			v-for="(icon, index) in iconList" :key="index">
			<image :src="icon.src" mode="widthFix" class="icon-nav-image rounded-circle mb-1"></image>
			<text class="font-sm text-muted">{{ icon.name }}</text>
		</view>
	</view>
</template>

<script>
	export default {
		name: "icon-nav",
		props: {
			iconList: {
				type: Array,
				default: () => []
			}
		},
		data() {
			return {

			};
		}
	}
</script>

<style>
	.icon-nav {
		width: 25%;

		& .icon-nav-image {
			width: 70rpx;
			height: 70rpx;
		}
	}
</style>