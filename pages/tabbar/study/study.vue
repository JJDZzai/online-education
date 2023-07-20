<template>
	<view class="flex flex-column" style="height: 100%;">
		<icons-card :icons="icons" v-if="token"></icons-card>

		<tab :current="current" :tabs="tabs" v-if="token" @change="handleChange"></tab>

		<swiper :current="current" :duration="200" class="flex-1 px-2" v-if="token" @change="swiperChange">
			<swiper-item class="flex" v-for="(t, index) in tabs" :key="index">
				<scroll-view scroll-y="true" class="flex-1" @scrolltolower="handleLoadMore(t)">
					<course-list colType="one" v-for="(item, tI) in t.list" :key="tI" :item="item">
						<text class="font-sm text-light-muted my-1" slot="desc">学习进度</text>
						<view class="flex flex-1 align-end" slot="footer">
							<text class="font-sm text-danger mr-1" v-if="index == 0">最近学习</text>
							<text class="font-sm text-light-muted">已学习 {{ item.progress }}%</text>
						</view>
					</course-list>
					<uni-load-more :status="t.loadStatus"></uni-load-more>
				</scroll-view>
			</swiper-item>
		</swiper>

		<no-login v-if="!token"></no-login>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'

	export default {
		data() {
			return {
				icons: [{
					icon: "icon-OrderHistory",
					name: "帖子",
					path: '/pages/my-post/my-post'
				}, {
					icon: "icon-pinglun2",
					name: "考试",
					path: '/pages/my-test/my-test'
				}, {
					icon: "icon-shoucang1",
					name: "电子书"
				}],
				current: 0,
				tabs: [{
					name: "课程",
					loadStatus: 'loading',
					list: [],
					page: 1,
					type: 'course'
				}, {
					name: "专栏",
					loadStatus: 'noMore',
					list: [],
					page: 1,
					type: 'column'
				}],
			}
		},
		onShow() {
			if (this.token) {
				this.tabs.forEach(t => {
					t.page = 1
					t.loadStatus = 'more'
				})
				this.getData()
			}
		},
		computed: {
			...mapState({
				token: state => state.token
			})
		},
		methods: {
			handleChange(index) {
				this.current = index
				this.swiperChange({
					detail: {
						current: index
					}
				})
			},
			swiperChange(e) {
				this.current = e.detail.current
				let tab = this.tabs[this.current]
				// 防止切换反复加载数据
				if (tab.loadStatus == 'more' && tab.page == 1) {
					this.getData()
				}
			},
			getData() {
				uni.showLoading({
					title: '加载中...',
					mask: false
				})

				let tab = this.tabs[this.current]

				this.$api.getUserhistory({
					page: tab.page,
					type: tab.type
				}).then(res => {
					tab.list = tab.page == 1 ? res.rows : [...tab.list, ...res.rows]
					tab.loadStatus = res.rows.length < 10 ? 'noMore' : 'more'
				}).catch(err => {
					tab.loadStatus = 'more'
					if (tab.page > 1) {
						tab.page = tab.page - 1
					}
				}).finally(() => {
					uni.hideLoading()
				})
			},
			handleLoadMore(t) {
				if (t.loadStatus != 'more') {
					return
				}
				t.page = t.page + 1
				this.getData()
			}
		}
	}
</script>

<style>
	page {
		display: flex;
		flex-direction: column;
		height: 100%;
	}
</style>