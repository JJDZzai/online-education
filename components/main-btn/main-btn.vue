<template>
	<view>
		<button class="font text-light bg-main" hover-class="bg-main-hover" @click="onClick">
			<slot></slot>
		</button>
	</view>
</template>

<script>
	export default {
		name: "main-btn",
		data() {
			return {

			};
		},
		methods: {
			onClick() {
				this.$emit('submit')
			}
		}
	}
</script>

<style>

</style>