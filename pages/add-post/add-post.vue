<template>
	<view>
		<picker mode="selector" :range="menus" @change="handleChange">
			<view class="p-2">
				<button style="width: 100%;" type="default"
					size="mini">{{ activeIndex == -1 ? '选择社区' : menus[activeIndex] }}</button>
			</view>
		</picker>

		<uni-card style="padding: 0;" is-full :border="false" :extra="index == 0 ? '' : '移除'"
			v-for="(item, index) in form" :key="index" @click-extra="handleExtraDelete(index)">
			<textarea class="w-100 bg-light font p-2" style="box-sizing: border-box;" placeholder="请填写帖子内容"
				v-model="item.text" />
			<view style="margin: 0 -20rpx; margin-top: 20rpx;">
				<upload-image :list="item.images" @change="handleUploadImage($event, item)"></upload-image>
			</view>
		</uni-card>

		<view style="height: 55px;"></view>
		<main-btn class="fixed-bottom" @submit="handleCreatePost">新增帖子</main-btn>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				menus: [],
				menusId: [],
				activeIndex: -1,
				form: [{
					text: '第一个帖子',
					images: []
				}]
			}
		},
		onLoad() {
			this.$api.getbbsList({
				page: 1,
				limit: 100
			}).then(res => {
				res.rows.forEach(item => {
					this.menusId.push(item.id)
					this.menus.push(item.title)
				})
			})
		},
		onNavigationBarButtonTap(e) {
			if (this.activeIndex == -1) {
				this.$toast('请先选择社区')
			}
			this.$load('发布中...')
			this.$api.postSave({
				bbs_id: this.menusId[this.activeIndex],
				content: this.form
			}).then(res => {
				this.$toast('发布成功')
				setTimeout(() => {
					uni.navigateBack({
						delta: 1
					})
				}, 500)
				uni.$emit('refreshBbs')
			}).finally(() => {
				this.$hide()
			})
		},
		methods: {
			handleChange(e) {
				this.activeIndex = e.detail.value
			},
			handleCreatePost() {
				this.form.push({
					text: '第二个帖子',
					images: []
				})
			},
			// uni-card 传递过来的事件 
			handleExtraDelete(index) {
				uni.showModal({
					content: '确定要删除该帖子吗？',
					success: (res) => {
						if (res.cancel) {
							return
						}
						this.form.splice(index, 1)
					}
				});

			},
			// upload-image 传递过来的事件
			handleUploadImage(e, item) {
				item.images = e.map(p => p.path)
			}
		}
	}
</script>

<style>

</style>