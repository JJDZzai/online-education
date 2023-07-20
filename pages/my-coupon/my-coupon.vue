<template>
	<view>
		<view class="flex text-white mb-3" :class="item.btn != '立即使用' ? 'coupon-used' : ''"
			v-for="(item, index) in list" :key="index">
			<view class="w-100 coupon-left flex flex-column flex-1 justify-center bg-hover-warning p-2">
				<text class="font-md">￥{{ item.price }}</text>
				<text class="coupon-text font text-ellipsis">适用{{ item.typeName }} : {{ item.title }}</text>
			</view>
			<view class="coupon-right flex justify-center align-center font bg-warning p-2"
				hover-class="bg-hover-warning" @click="handleUse(item)">{{ item.btn }}</view>
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
				list: [],
				goods_id: 0,
				type: ''
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
		onLoad(e) {
			if (e.goods_id && !e.type) {
				this.$toast('非法参数')
				setTimeout(() => {
					uni.navigateBack({
						delta: 1
					})
				}, 700)
				return
			}

			this.goods_id = e.goods_id
			this.type = e.type

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
					if ((this.goods_id && this.type && r.btn == '立即使用') && (r.goods_id != this.goods_id || r
							.type != this.type)) {
						r.btn = '不可用'
					}
				})
				return row
			},
			loadMore() {
				if (this.loadStatus != 'more') {
					return
				}
				this.page = this.page + 1
				this.getData()
			},
			handleUse(item) {
				if (item.btn != '立即使用') {
					return
				}
				if (this.goods_id && this.type) {
					uni.$emit('chooseCoupon', {
						user_coupon_id: item.id,
						price: parseFloat(item.price)
					})
					uni.navigateBack({
						delta: 1
					});
				}
			}
		}
	}
</script>

<style>
	page {
		padding: 20rpx;
		box-sizing: border-box;
	}

	.coupon-left {
		border-right: 2rpx dashed;
	}

	.coupon-right {
		width: 60px;
	}

	.coupon-text {
		width: 250px;
	}

	.coupon-used>view {
		background-color: #cccccc;
	}
</style>