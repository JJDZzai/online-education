<template>
	<view>
		<button class="font text-light bg-main" :class="disabled ? 'bg-main-disabled' : ''" hover-class="bg-main-hover"
			@click="onClick">
			<slot></slot>
		</button>
	</view>
</template>

<script>
	export default {
		name: "main-btn",
		props: {
			disabled: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {

			};
		},
		methods: {
			onClick() {
				if (this.disabled) return
				this.$emit('submit')
			}
		}
	}
</script>

<style>

</style>