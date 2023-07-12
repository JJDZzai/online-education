<template>
	<view>
		<post-count v-for="(item, index) in list" :key="index" :item="item" showDel @support="handleSupport"
			@delete="handleDelete"></post-count>
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
				return this.$api.readMyPost({
					page: this.page,
				}).then(res => {
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
			handleSupport(id) {
				let item = this.list.find(item => item.id == id)
				if (!item) {
					return
				}

				let k = item.issupport ? 'postUnsupport' : 'postSupport'
				let msg = item.issupport ? '取消点赞' : '点赞成功'

				this.$api[k]({
					post_id: item.id
				}).then(res => {
					this.$toast(msg)

					item.issupport = item.issupport ? item.support_count - 1 : item.support_count + 1
					item.issupport = !item.issupport

					this.getData()
				})
			},
			handleDelete(id) {
				uni.showModal({
					content: '确定要删除该帖子吗？',
					success: (res) => {
						if (res.cancel) {
							return
						}
						this.$api.deletePost({
							id
						}).then(res => {
							this.$toast('删除成功')
							this.page = 1
							this.getData()
						})
					}
				});
			}
		}
	}
</script>

<style>

</style>