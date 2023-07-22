<template>
	<view>
		<view v-for="(item, index) in list" :key="index">
			<uni-card is-full :is-shadow="false" :border="false">
				<view class="flex justify-between">
					<text class="h4 font-weight-bold">{{ item.title }}</text>
					<text class="font-sm text-danger">时长：{{ item.expire }}分钟</text>
				</view>
				<view class="flex my-2">
					<text class="flex-1">题目总数：{{ item.question_count }}</text>
					<text class="flex-1">总分数：{{ item.total_score }}</text>
					<text class="flex-1">及格分：{{ item.pass_score }}</text>
				</view>
				<view class="flex justify-end mb-3" slot="actions">
					<main-btn :disabled="item.is_test"
						@submit="startTest(item.id)">{{ item.is_test ? '你考过啦' : '参加考试' }}</main-btn>
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
			this.refresh()
		},
		onReachBottom() {
			this.loadMore()
		},
		created() {
			this.getData()
			// 监听页面改变
			uni.$on('refreshTestList', this.refresh)
		},
		beforeDestroy() {
			uni.$off('refreshTestList', this.refresh)
		},
		methods: {
			// 考试完后刷新此页面
			refresh() {
				this.page = 1
				this.getData().finally(() => {
					uni.stopPullDownRefresh()
				})
			},
			getData() {
				return this.$api.getTestpaperList({
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
			},
			startTest(id) {
				uni.showModal({
					content: '确定要开始考试吗？',
					success: (res) => {
						if (res.cancel) {
							return
						}
						this.authJump('../test-detail/test-detail?id=' + id)
					}
				});
			}
		}
	}
</script>

<style>

</style>