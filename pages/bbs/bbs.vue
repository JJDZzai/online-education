<template>
	<view>
		<!-- 帖子滚动列表 -->
		<scroll-view class="px-2 pt-2 scroll-row" scroll-x="true" @scrolltolower="handleLoad">
			<view class="font-sm border rounded px-3 py-1 mr-1 mb-2 scroll-row-item"
				:class="activeIndex == index ? 'text-white bg-main' : 'text-muted bg-light'"
				v-for="(item, index) in bbslist" :key="index" @click="changeBbs(index)">
				{{ item.title }}
			</view>
			<view class="scroll-row-item" v-if="bbsLoadStatus == 'loading'">
				<uni-load-more :status="bbsLoadStatus" :iconSize="13"></uni-load-more>
			</view>
		</scroll-view>

		<view class="divider"></view>

		<!-- 帖子分类 -->
		<view class="flex py-2">
			<view class="flex-1 flex justify-center text-muted">
				<text class="font-weight-bold mr-2">总帖子</text>
				<text>{{ postCount }}</text>
			</view>
			<view class="flex-1 flex justify-center text-muted">
				<text class="font-weight-bold mr-2">总用户</text>
				<text>{{ userCount }}</text>
			</view>
		</view>

		<view class="divider"></view>

		<!-- 帖子列表 -->
		<post-count v-for="(item, index) in postList" :key="index" :item="item" @support="handleSupport"></post-count>
		<uni-load-more :status="postLoadStatus" :iconSize="13"></uni-load-more>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 社区列表数据
				activeIndex: 0,
				bbsLoadStatus: 'loading',
				bbslist: [],
				bbsQuery: {
					page: 1
				},
				postCount: 0,
				userCount: 0,
				// 帖子列表数据
				postLoadStatus: 'loading',
				postList: [],
				postQuery: {
					page: 1,
					keyword: '',
					bbs_id: ''
				}
			}
		},
		beforeDestroy() {
			uni.$off('refreshBbs', this.refresh)
		},
		onLoad() {
			this.bbsData()
			this.postData()
			uni.$on('refreshBbs', this.refresh)
		},
		onReachBottom() {
			this.loadMore()
		},
		onPullDownRefresh() {
			this.refresh()
		},
		onNavigationBarSearchInputConfirmed(e) {
			this.postQuery.keyword = e.text
			this.refresh()
		},
		onNavigationBarButtonTap() {
			this.navigateTo('../add-post/add-post')
		},
		methods: {
			// 社区列表
			bbsData() {
				this.bbsLoadStatus = 'loading'
				return this.$api.getbbsList(this.bbsQuery).then(res => {
					let bbs = this.bbsQuery.page == 1 ? res.rows : [...this.bbslist, ...this.rows]
					this.postCount = res.postCount
					this.userCount = res.userCount
					if (this.bbsQuery.page == 1) {
						bbs.unshift({
							id: 0,
							title: '全部'
						})
					}
					this.bbslist = bbs
					this.bbsLoadStatus = res.rows.length < 10 ? 'noMore' : 'more'
				}).catch(() => {
					this.bbsLoadStatus = 'more'
					if (this.bbsQuery.page > 1) {
						this.bbsQuery.page -= 1
					}
				})
			},
			handleLoad() {
				if (this.bbsLoadStatus != 'more') {
					return
				}
				this.bbsQuery.page++
				this.bbsData()
			},
			// 帖子列表，传给子组件 post-count
			postData() {
				this.postLoadStatus = 'loading'
				return this.$api.getPostList(this.postQuery).then(res => {
					this.postList = this.postQuery.page == 1 ? res.rows : [...this.postList, ...res.rows]
					this.postLoadStatus = res.rows.length < 10 ? 'noMore' : 'more'
				}).catch(() => {
					this.postLoadStatus = 'more'
					if (this.postQuery.page > 1) {
						this.postQuery.pag -= 1
					}
				})
			},
			loadMore() {
				if (this.postLoadStatus != 'more') {
					return
				}
				this.postQuery.page++
				this.postData()
			},
			// 切换列表
			changeBbs(index) {
				if (this.activeIndex == index) return
				this.activeIndex = index
				this.postQuery.bbs_id = this.bbslist[index].id
				this.postQuery.page = 1
				this.postList = []
				this.postData()
			},
			refresh() {
				this.postQuery.page = 1
				this.postData().finally(() => {
					uni.stopPullDownRefresh()
				})
			},
			// 点赞
			handleSupport(id) {
				// 判断 id 是否相等
				let item = this.postList.find(item => item.id == id)
				if (!item) return

				// 如果没有点赞就点赞
				let k = !item.issupport ? 'postSupport' : 'postUnsupport'
				let msg = !item.issupport ? '点赞成功' : '取消点赞'

				this.$api[k]({
					post_id: item.id
				}).then(() => {
					this.$toast(msg)
					this.postData()
				})
			}
		}
	}
</script>

<style>

</style>