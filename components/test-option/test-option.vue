<template>
	<view>
		<view class="flex align-center border rounded px-3 py-2 mb-2" :class="checked ? 'text-main border-main' : ''"
			@click="selectOption">
			<text class="mr-2">{{ index | formatIndex }}</text>
			<mp-html :content="content"></mp-html>
		</view>
	</view>
</template>

<script>
	export default {
		name: "test-option",
		filters: {
			formatIndex(value) {
				let en = {
					0: 'A',
					1: 'B',
					2: 'C',
					3: 'D',
				}
				return en[value]
			}
		},
		props: {
			index: {
				type: Number,
				default: 0
			},
			content: {
				type: String,
				default: ''
			},
			checked: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {

			};
		},
		methods: {
			selectOption() {
				this.$emit('select', this.index)
			}
		}
	}
</script>

<style>

</style>