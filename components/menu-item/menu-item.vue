<template>
	<view class="flex align-center border-bottom p-3" hover-class="bg-light" @click="$emit('open')">
		<text class="flex-shrink text-muted" style="width: 90rpx;"
			:class="activeColor ? 'text-main' : ''">{{ index + 1 | formatIndex }}</text>
		<view class="flex flex-column align-start" :class="activeColor ? 'text-main' : ''">
			<text>{{ title }}</text>
			<slot></slot>
		</view>
	</view>
</template>

<script>
	export default {
		name: "menu-item",
		filters: {
			formatIndex(value) {
				if (value < 10) {
					return '00' + value
				}
				if (value >= 10 && value < 100) {
					return '0' + value
				}
				return value
			}
		},
		props: {
			title: {
				type: String,
				default: ''
			},
			index: {
				type: Number,
				default: 0
			},
			activeColor: {
				type: Boolean,
				default: false
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