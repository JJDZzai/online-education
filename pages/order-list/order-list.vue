<template>
	<view>
		<view v-for="(item, index) in list" :key="index">
			<uni-card isFull :border="false">
				<view class="flex justify-between py-2">
					<text>订单时间：{{ item.created_time }}</text>
					<text>订单号：{{ item.no }}</text>
				</view>
				<view class="font font-weight-bold">{{ item.goods }}</view>
				<view class="flex justify-end text-danger font-weight-bold">￥{{ item.price }}</view>
				<view :class="item.status == 'success' ? 'text-success' : ''">
					<slot name="actions">{{ item.status == 'success' ? '交易成功' : '等待支付' }}</slot>
				</view>
			</uni-card>
			<view class="divider"></view>
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
				return this.$api.getOrderList({
					page: this.page,
					limit: this.limit
				}).then(res => {
					this.list = this.page == '1' ? res.rows : [...this.list, ...res.rows],
					this.loadStatus = res.rows.length < this.limit ? 'noMore' : 'more'
				}).catch(() => {
					this.loadStatus = 'more'
					if (this.page > 1) {
						this.page = this.page - 1
					}
				})
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

</style>