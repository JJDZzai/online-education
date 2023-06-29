<template>
	<view>
		<uni-list :border="false">
			<uni-list-item title="账户安全" :border="false" show-arrow clickable
				@click="authJump('../user-safe/user-safe')"></uni-list-item>
			<uni-list-item title="清除缓存" :border="false" clickable @click="clearCache">
				<text slot="footer">{{ currentSize | formatCurrentSize }}</text>
			</uni-list-item>
			<uni-list-item title="检查更新" :border="false" show-arrow></uni-list-item>
			<uni-list-item title="当前版本" :border="false">
				<text slot="footer">1.0.0</text>
			</uni-list-item>
		</uni-list>

		<view class="p-3">
			<main-btn @submit="handleLogout" v-if="user">退出登录</main-btn>
		</view>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'

	import tool from '@/common/tool.js'

	export default {
		data() {
			return {
				keys: [],
				currentSize: 0
			}
		},
		created() {
			this.getSize()
		},
		computed: {
			...mapState({
				user: state => state.user
			})
		},
		methods: {
			handleLogout() {
				uni.showModal({
					content: '确定要退出登录？',
					success: (res) => {
						if (res.cancel) {
							return
						}
						// this.$api
						this.$store.dispatch('logout').then(() => {
							uni.navigateBack({
								delta: 1
							})
						})
					}
				});
			},
			getSize() {
				uni.getStorageInfo({
					success: (res) => {
						this.keys = res.keys.filter((k => k != 'user'))
						this.currentSize = res.currentSize
					}
				});
			},
			clearCache() {
				uni.showModal({
					content: '确定清除缓存吗',
					success: (res) => {
						if (res.cancel) {
							return
						}
						this.keys.forEach(k => {
							uni.removeStorageSync(k)
						})
						this.$toast('清除成功')
						this.getSize()
					}
				});
			},
		},
		filters: {
			formatCurrentSize(value) {
				return tool.bytesToSize(value)
			}
		}
	}
</script>

<style>

</style>