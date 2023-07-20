<template>
	<view class="cource-one scroll-row-item mr-2 mt-3" @click="handleDetail">
		<view class="view-first">
			<image class="cource-image rounded" :src="item.cover" mode="widthFix"></image>
		</view>
		<view class="view-second flex flex-column flex-shrink">
			<text class="font-md text-ellipsis mt-1">{{ item.title }}</text>
			<text class="font-sm text-light-muted my-1" v-if="item.try" v-html="item.try"></text>
			<view class="flex flex-1 align-end">
				<text class="font-md text-danger" v-if="item.price == 0">免费</text>
				<text class="font-md text-danger" v-else>￥{{item.price}}</text>
				<text class="font-sm text-light-muted text-through ml-1">￥{{ item.t_price }}</text>
				<view class="flex justify-center align-center ml-auto mr-2 border rounded-circle p-1" @click.stop>
					<text class="font">{{ item.sub_count }}人订阅</text>
					<text class="iconfont icon-xiayibu ml-1"></text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "course-list",
		props: {
			item: {
				type: Object,
				default: () => {}
			},
			colType: {
				type: String,
				default: 'two'
			}
		},
		data() {
			return {

			};
		},
		methods: {
			handleDetail() {
				let url = '/pages/book-detail/book-detail?id=' + this.item.id
				this.navigateTo(url)
			}
		}
	}
</script>

<style>
	.cource-one {
		display: flex !important;
		padding: 10px;
	}

	.cource-one .view-first {
		flex-shrink: 1;
		margin-right: 20rpx;
	}

	.cource-one .view-second {
		width: 525rpx;
	}

	.cource-one .cource-image {
		width: 185rpx;
		height: 235px;
	}
</style>