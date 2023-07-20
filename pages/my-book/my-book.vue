<template>
	<view>
		<view v-for="(item, index) in list" :key="index">
			<book-list :item="item">
				<view class="flex justify-center align-center ml-auto mr-2 p-1">
					<text class="font">立即学习</text>
					<text class="iconfont icon-xiayibu ml-1"></text>
				</view>
			</book-list>
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
				return this.$api.myBookList({
					page: this.page,
					limit: this.limit
				}).then(res => {
					console.log(res);

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