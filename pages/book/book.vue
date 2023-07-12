<template>
	<view>
		<book-list v-for="(item, index) in list" :key="index" :item="item"></book-list>
		<uni-load-more :status="loadStatus"></uni-load-more>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				loadStatus: 'loading',
				page: 1,
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
				return this.$api.getBookList({
					page: this.page,
				}).then(res => {
					console.log(res);
					this.list = this.page == '1' ? res.rows : [...this.list, ...res.rows],
						this.loadStatus = res.rows.length < 10 ? 'noMore' : 'more'
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
		}
	}
</script>

<style>

</style>