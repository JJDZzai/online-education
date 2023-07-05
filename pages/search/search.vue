<template>
	<view>
		<view v-if="list.length">
			<view class="flex justify-between align-center py-3 px-2">
				<text class="font font-weight-bold">历史记录</text>
				<text class="iconfont icon-iconfontshanchu text-light-muted" @click="clearAll"></text>
			</view>

			<view class="flex flex-wrap px-2">
				<uni-badge class="mr-2 mb-2" :text="item" size="normal" :custom-style="customStyle"
					v-for="(item,index) in list" :key="index" @click="handleSearchEvent(item)"></uni-badge>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: [],
				keyword: '',
				customStyle: {
					color: '#747674',
					backgroundColor: '#F8F8F8',
					padding: '12px 10px',
					lineHeight: '0px'
				}
			}
		},
		// 监听输入
		onNavigationBarSearchInputChanged(e) {
			this.keyword = e.text
		},
		// 监听按钮点击搜索
		onNavigationBarButtonTap() {
			this.handleSearchEvent()
		},
		// 监听手机端键盘提交事件
		onNavigationBarSearchInputConfirmed() {
			this.handleSearchEvent()
		},
		// 页面加载时搜索的数据初始化，
		onLoad() {
			let list = uni.getStorageSync('keyword')
			if (list) {
				this.list = JSON.parse(list)
			}
		},
		methods: {
			handleSearchEvent(value = "") {
				if (value) {
					this.keyword = value
				}
				
				if (this.keyword == '') {
					return this.$toast('搜索关键字不能为空')
				}
				// 跳转到搜索结果页
				this.navigateTo('../search-result/search-result?keyword=' + this.keyword)
				// 加入到历史记录
				this.addHistory()
			},
			addHistory() {
				let index = this.list.findIndex(v => v == this.keyword)
				if (index != -1) {
					this.TopFirst(this.list, index)
				} else {
					this.list.unshift(this.keyword)
				}
				uni.setStorageSync('keyword', JSON.stringify(this.list))
			},
			// 置顶数组某一项
			TopFirst(arr, index) {
				if (index != 0) {
					arr.unshift(arr.splice(index, 1)[0])
				}
				return arr
			},
			clearAll() {
				uni.showModal({
					content: '确认删除全部历史记录？',
					success: (res) => {
						if (res.cancel) {
							return
						}
						this.list = []
						uni.removeStorageSync('keyword')
					}
				});
			}
		}
	}
</script>

<style>
	.uni_badge {
		display: flex;
		align-items: center;
		padding: 12px 10px !important;
	}
</style>