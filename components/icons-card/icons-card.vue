<template>
	<view class="p-3">
		<view class="flex bg-white rounded shadow">
			<view class="flex-1 flex flex-column justify-center align-center py-3" v-for="(item, index) in icons"
				:key="index" hover-class="bg-light">
				<text class="iconfont" :class="item.icon"></text>
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
		}
	}
</script>

<style>

</style>