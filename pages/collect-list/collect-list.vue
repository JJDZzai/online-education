<template>
	<view class="p-2">
		<uni-swipe-action>
			<view v-for="(item, index) in list" :key="index">
				<uni-swipe-action-item :right-options="options" @click="onClick(item)">
					<course-list :item="item.goods" colType="one" :show="false"></course-list>
				</uni-swipe-action-item>
			</view>
		</uni-swipe-action>
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
				list: [],
				// 滑动操作
				options: [{
					text: '取消收藏',
					style: {
						backgroundColor: '#dd524d'
					}
				}]
			}
		},
		onPullDownRefresh() {
			this.refresh()
		},
		onReachBottom() {
			this.loadMore()
		},
		created() {
			this.getData()
		},
		methods: {
			// 滑动操作
			onClick(item) {
				this.$api.uncollect({
					goods_id: item.goods.id,
					type: item.type
				}).then(res => {
					this.refresh()
				})
			},
			getData() {
				return this.$api.readMyCollect({
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
			},
			refresh() {
				this.page = 1
				this.getData().finally(() => {
					uni.stopPullDownRefresh()
				})
			}
		}
	}
</script>

<style>

</style>