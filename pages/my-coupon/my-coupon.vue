<template>
	<view>
		<view class="flex text-white mb-3" :class="item.btn != '立即使用' ? 'coupon-used' : ''"
			v-for="(item, index) in list" :key="index">
			<view class="coupon-left flex flex-column justify-center flex-1 bg-hover-warning p-2">
				<text class="font-md">￥{{ item.price }}</text>
				<text class="font">适用{{ item.typeName }} : {{ item.title }}</text>
			</view>
			<view class="coupon-right flex justify-center align-center font bg-warning p-2"
				hover-class="bg-hover-warning">{{ item.btn }}</view>
		</view>
		<uni-load-more :status="loadStatus"></uni-load-more>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				loadStatus: 'loading',
				page: 1,
				limit: 5,
				list: []
			}
		},
		onPullDownRefresh() {
			this.page = 1
			this.getData().finally(() => {
				uni.stopPullDownRefresh()
			})
		},
		onReachBottom() {
			this.loadMore()
		},
		created() {
			this.getData()
		},
		methods: {
			getData() {
				return this.$api.getCouponList({
					page: this.page,
					limit: this.limit
				}).then(res => {
					// 处理优惠券过期时间
					res.rows = this.formatList(res.rows)
					console.log(res.rows);
					this.list = this.page == '1' ? res.rows : [...this.list, ...res.rows],
						this.loadStatus = res.rows.length < this.limit ? 'noMore' : 'more'
				}).catch(() => {
					this.loadStatus = 'more'
					if (this.page > 1) {
						this.page = this.page - 1
					}
				})
			},
			formatList(row) {
				row.forEach(r => {
					let now = (new Date()).getTime()
					let endTime = (new Date(r.end_time)).getTime()
					r.expired = endTime < now
					r.btn = r.used == 1 ? '已使用' : (r.expired ? '已过期' : '立即使用')
					r.typeName = r.type == 'course' ? '课程' : '专栏'
				})
				return row
			},
			loadMore() {
				if (this.loadStatus != 'more') {
					return
				}
				this.page = this.page + 1
				this.getData()
			}
		}
	}
</script>

<style>
	page {
		padding: 20rpx;
		box-sizing: border-box;

		& .coupon-left {
			border-right: 2rpx dashed;
		}

		& .coupon-text {
			width: 100rpx;
		}
	}

	.coupon-used>view {
		background-color: #cccccc;
	}
</style>