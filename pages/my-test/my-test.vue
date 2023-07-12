<template>
	<view>
		<view v-for="(item, index) in list" :key="index">
			<uni-card is-full :title="item.testpaper.title" :extra="item.answer_status ? '考试完成' : '考试中'"
				:is-shadow="false" :border="false">
				<view class="flex my-2">
					<text class="flex-1">题目总数：{{ item.testpaper.question_count }}</text>
					<text class="flex-1">
						最终得分：<text
							:class="item.read_status ? '' : 'text-danger'">{{ item.read_status ? item.score : '正在阅卷' }}</text>
					</text>
				</view>
				<view class="flex justify-start mb-3 ml-2" slot="actions">
					<text class="font text-light-muted">{{ item.created_time }}</text>
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
				return this.$api.getUserTestList({
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