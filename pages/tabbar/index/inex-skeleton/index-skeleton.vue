<template>
	<view>
		<!-- 搜索 -->
		<view class="p-2">
			<skeleton width="710rpx" height="75rpx" oClass="rounded"></skeleton>
		</view>

		<!-- 轮播图 -->
		<view class="flex justify-center">
			<skeleton width="710rpx" height="300rpx" oClass="rounded"></skeleton>
		</view>

		<!-- 图标导航 -->
		<view class="flex flex-wrap py-3">

			<view class="flex flex-column justify-center align-center py-1" style="width: 25%;" v-for="i in 8" :key="i">
				<skeleton width="70rpx" height="70rpx" circle oClass="mb-1"></skeleton>
				<skeleton width="70rpx" height="30rpx"></skeleton>
			</view>
		</view>

		<!-- 优惠券 -->
		<view class="flex justify-between p-2">
			<skeleton width="348rpx" height="130rpx" v-for="i in 2" :key="i"></skeleton>
		</view>

		<!-- 列表1 -->
		<view class="my-3 mx-2">
			<skeleton width="70rpx" height="35rpx"></skeleton>

			<view class="flex justify-between mt-3">
				<view v-for="i in 2">
					<skeleton width="340rpx" height="188rpx"></skeleton>
					<view class="mt-3">
						<skeleton width="330rpx" height="30rpx"></skeleton>
						<skeleton width="100rpx" height="25rpx" class="mt-3"></skeleton>
						<view class="flex align-end mt-3">
							<skeleton width="82px" height="25rpx" class="mr-2"></skeleton>
							<skeleton width="70rpx" height="18rpx"></skeleton>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 列表2 -->
		<view class="my-3 mx-2">
			<view class="flex justify-between">
				<skeleton width="70rpx" height="35rpx"></skeleton>
				<skeleton width="70rpx" height="35rpx"></skeleton>
			</view>

			<view class="flex mt-3" v-for="i in 2">
				<skeleton class="mr-2" width="300rpx" height="165rpx"></skeleton>
				<view class="mt-3">
					<skeleton width="360rpx" height="30rpx"></skeleton>
					<skeleton width="100rpx" height="25rpx" class="mt-3"></skeleton>
					<view class="flex align-end mt-3">
						<skeleton width="82px" height="25rpx" class="mr-2"></skeleton>
						<skeleton width="70rpx" height="18rpx"></skeleton>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'index-skeleton',
		data() {
			return {

			}
		}
	}
</script>

<style>
</style>