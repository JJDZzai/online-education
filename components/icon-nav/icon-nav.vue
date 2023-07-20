<template>
	<view class="flex flex-wrap py-3">
		<view class="icon-nav flex flex-column justify-center align-center py-1" hover-class="bg-light"
			v-for="(icon, index) in iconList" :key="index" @click="open(icon)">
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
		},
		methods: {
			open(icon) {
				console.log(icon);
				if (icon.type == 'webview') {
					// encodeURIComponent 防止链接中有其他参数传递丢失，对 URI 进行编码
					this.navigateTo('/pages/webview/webview?url=' + encodeURIComponent(icon.url))
					return
				}
				switch (icon.module) {
					case 'test':
						this.navigateTo('/pages/test-list/test-list')
						break;
					case 'bbs':
						this.navigateTo('/pages/bbs/bbs')
						break;
					case 'book':
						this.navigateTo('/pages/book/book')
						break
					default:
						this.navigateTo('/pages/list/list?module=' + icon.module)
						break;
				}
			}
		}
	}
</script>

<style>
	.icon-nav {
		width: 25%;
	}

	.icon-nav-image {
		width: 70rpx;
		height: 70rpx;
	}
</style>