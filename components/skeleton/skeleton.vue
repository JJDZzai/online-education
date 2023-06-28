<template>
	<view class="skeleton" :style="getStyle" :class="getClass">
		
	</view>
</template>

<script>
	export default {
		name: "skeleton",
		props: {
			width: {
				type: [String, Number],
				default: 0
			},
			height: {
				type: [String, Number],
				default: 0
			},
			circle: {
				type: Boolean,
				default: false
			},
			oClass: {
				type: String,
				default: ''
			}
		},
		data() {
			return {

			};
		},
		computed: {
			getStyle() {
				return `width:${this.width};height:${this.height};`
			},
			getClass() {
				let c = ''
				if (this.circle) {
					c += 'rounded-circle'
				}
				return `${c} ${this.oClass}`
			}
		}
	}
</script>

<style>
	.skeleton {
		background-color: #F5F5F1;
	}
</style>