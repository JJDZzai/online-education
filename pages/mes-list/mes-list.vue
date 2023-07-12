<template>
	<view class="p-2">
		<view class="bg-white rounded p-2" v-for="(item, index) in list" :key="index">
			<view class="font">
				{{ item.content }}
			</view>
			<view class="font-sm text-muted mt-1">
				{{ item.created_time }}
			</view>
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
				limit: 10,
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
				return this.$api.getNoticeList({
					page: this.page,
					limit: this.limit
				}).then(res => {
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
			}
		}
	}
</script>

<style>
	page {
		background-color: #EEEEEE;
	}
</style>