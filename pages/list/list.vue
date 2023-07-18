<template>
	<view class="p-2">
		<view class="flex flex-wrap">
			<course-list v-for="(item, index) in list" :key="index" :item="item"
				:colType="module == 'flashsale' || module == 'group' || module == 'live' ? 'two' : 'one'" show
				:tag="tag">
				<text class="font-sm my-1" :class="item.status == '进行中' ? 'text-danger' : 'text-light-muted'"
					slot="desc">{{ item.status }}</text>
			</course-list>
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
			this.page = 1
			this.getData().finally(() => {
				uni.stopPullDownRefresh()
			})
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
				group: '拼团',
				live: '直播'
			}

			uni.setNavigationBarTitle({
				title: type[this.module] + '列表'
			})

			this.getData()
		},
		computed: {
			tag() {
				if (this.module == 'course' || this.module == 'column' || this.module == 'live') {
					return ''
				}
				return this.module == 'flashsale' ? '秒杀价' : '拼团价'
			}
		},
		methods: {
			getData() {
				let fun = {
					course: 'getCourseList',
					column: 'getColumnList',
					flashsale: 'getFlashsaleList',
					group: 'getGroupList',
					live: 'getLiveList',
				}

				return this.$api[fun[this.module]]({
					page: this.page,
					limit: this.limit
				}).then(res => {
					this.list = this.page == '1' ? res.rows : [...this.list, ...res.rows]
					this.loadStatus = res.rows.length < this.limit ? 'noMore' : 'more'

					if (this.module == 'live') {
						res.rows = res.rows.map(r => {
							let start_time = new Date(r.start_time).getTime()
							let end_time = new Date(r.end_time).getTime()
							let now = new Date().getTime()
							if (start_time > now) {
								r.status = '未开始'
							} else if (end_time < now) {
								r.status = '已结束'
							} else {
								r.status = '进行中'
							}
							r.type = 'live'
							return r
						})
					}
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