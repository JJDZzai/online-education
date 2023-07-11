<template>
	<view class="flex flex-column" style="height: 100%;">
		<tab :current="current" :tabs="tabs" @change="handleChange"></tab>

		<swiper :current="current" :duration="200" class="flex-1 px-2" @change="swiperChange">
			<swiper-item class="flex" v-for="(t, index) in tabs" :key="index">
				<scroll-view scroll-y="true" class="flex-1" @scrolltolower="handleLoadMore(t)">
					<course-list colType="one" v-for="(item, index) in t.list" :key="index" :item="item"></course-list>
					<uni-load-more :status="t.loadStatus"></uni-load-more>
				</scroll-view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	export default {
		data() {
			return {
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
				keyword: ''
			}
		},
		onLoad(e) {
			this.keyword = e.keyword
			this.getData()
		},
		onNavigationBarSearchInputClicked() {
			uni.navigateBack({
				delta: 1
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

				this.$api.getSearchResult({
					keyword: this.keyword,
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