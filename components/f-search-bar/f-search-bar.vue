<template>
	<view class="p-2">
		<view class="f-search-bar flex justify-center align-center py-2 rounded">
			<uni-icons type="search" size="20" color="#928E8A"></uni-icons>
			<text class="ml-2 font">{{ placeholder }}</text>
		</view>
	</view>
</template>

<script>
	export default {
		name: "f-search-bar",
		props: {
			placeholder:{
				type:String,
				default:''
			}
		},
		data() {
			return {

			};
		}
	}
</script>

<style>
	.f-search-bar {
		color: #928E8A;
		background-color: #F5F5F1;
	}
</style>