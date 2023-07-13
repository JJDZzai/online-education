<template>
	<view class="scroll-row-item mr-2 mt-3" :class="'cource-' + this.colType" @click="handleDetail">
		<view class="view-first position-relative">
			<image class="cource-image" :src="item.cover" mode="widthFix"></image>
			<text class="cource-text text-white font-sm mb-1" v-if="item.type">{{ item.type | formatType }}</text>
		</view>
		<view class="view-second flex flex-column flex-shrink">
			<text class="font-md text-ellipsis mt-1" v-if="show">{{ item.title }}</text>
			<text class="font-md mt-1" v-else>{{ item.title }}</text>
			<slot name="desc">
				<text class="font-sm text-light-muted my-1" v-if="show" v-html="item.try"></text>
			</slot>
			<view class="flex flex-1 align-end" v-if="item.price &&  item.t_price">
				<slot name="footer">
					<text class="font-md text-danger">￥{{item.price}}</text>
					<text class="font-sm text-light-muted">￥{{ item.t_price }}</text>
				</slot>
			</view>
		</view>
	</view>
</template>

<script>
	let type = {
		media: "图文",
		audio: "音频",
		video: "视频",
		column: "专栏"
	}
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
			},
			show: {
				type: Boolean,
				default: true
			}
		},
		filters: {
			formatType(k) {
				return type[k]
			}
		},
		data() {
			return {

			};
		},
		methods: {
			handleDetail() {
				let url = '/pages/course-detail/course-detail?id=' + this.item.id
				if (!this.item.type) {
					url = '/pages/column/column?id=' + this.item.id
				}
				this.navigateTo(url)
			}
		}
	}
</script>

<style>
	.cource-one {
		display: flex !important;

		& .view-first {
			flex-shrink: 1;
			margin-right: 20rpx;
		}
	}

	/* 公共样式 */
	.view-second {
		width: 340rpx;
	}

	.cource-image {
		width: 340rpx;
		height: 190px;
	}

	.cource-text {
		position: absolute;
		right: 10rpx;
		bottom: 10rpx;
		background-color: rgba(0, 0, 0, 0.4);
		padding: 5rpx 10rpx;
	}
</style>