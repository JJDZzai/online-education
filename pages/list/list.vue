<template>
	<view class="p-2">
		<view class="flex flex-wrap">
			<course-list v-for="(item, index) in list" :key="index" :item="item"
				:colType="module == 'flashsale' || module == 'group' ? 'two' : 'one'" :show="false"
				:tag="tag"></course-list>
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
				list: [],
				module: 'course'
			}
		},
		onPullDownRefresh() {
			this.refresh()
		},
		onReachBottom() {
			this.loadMore()
		},
		onLoad(e) {
			if (e.module) {
				this.module = e.module
			}

			let type = {
				course: '课程',
				column: '专栏',
				flashsale: '秒杀',
				group: '拼团'
			}

			uni.setNavigationBarTitle({
				title: type[this.module] + '列表'
			})

			this.getData()
		},
		computed: {
			tag() {
				if (this.module == 'course' || this.module == 'column') {
					return
				}
				return this.module == 'flashsale' ? '秒杀价' : '拼团价'
			}
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
				let fun = {
					course: 'getCourseList',
					column: 'getColumnList',
					flashsale: 'getFlashsaleList',
					group: 'getGroupList'
				}

				return this.$api[fun[this.module]]({
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