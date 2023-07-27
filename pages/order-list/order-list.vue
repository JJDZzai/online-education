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
				<view class="flex justify-between align-center mt-3">
					<view :class="item.status == 'success' ? 'text-success' : ''">
						<slot name="actions">{{ item.status == 'success' ? '交易成功' : '等待支付' }}</slot>
					</view>
					<view class="payment">
						<main-btn  @submit="pay(item.no)">立即支付</main-btn>
					</view>
				</view>
			</uni-card>
			<view class="divider"></view>
		</view>
		<uni-load-more :status="loadStatus"></uni-load-more>
	</view>
</template>

<script>
	import tool from '@/common/tool.js'

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
					console.log(res);
					this.list = this.page == '1' ? res.rows : [...this.list, ...res.rows]
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
			},
			pay(no) {
				// H5支付，只在H5端生效
				// #ifdef H5
				this.navigateTo('../H5pay/H5pay?no=' + no)
				// #endif

				// APP和小程序支付
				// #ifdef APP-PLUS || MP
				tool.appPay(no, () => {
					this.page = 1
					this.getData()
				})
				// #endif
			}
		}
	}
</script>

<style>
	.payment button {
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 14px;
		color: #FFFFFF;
		background-color: #00bfff;
	}
</style>