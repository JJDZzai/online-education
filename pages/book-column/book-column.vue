<template>
	<view>
		<uni-drawer ref="showLeft" mode="left" :mask-click="true">
			<scroll-view style="height: 100%;" scroll-y="true">
				<menu-item v-for="(item,index) in chapter.menus" :key="index" :title="item.title" :index="index"
					:activeColor="id == item.id" @open="changeChapter(index)">
					<text class="border border-danger rounded text-danger font-sm px-1 mt-1"
						v-if="item.isfree == 1">免费试读</text>
				</menu-item>
			</scroll-view>
		</uni-drawer>

		<uni-card is-full :border="false">
			<mp-html class="flex justify-center align-center text-light-muted" :content="chapter.content">
				加载中...
			</mp-html>
		</uni-card>

		<test-actions :current="current" :total="total" show @on-page="onPage" @open="handleOpen"></test-actions>
	</view>
</template>

<script>
	import {
		setTimeout
	} from 'timers'
	export default {
		onLoad(e) {
			if (!e.id || !e.book_id) {
				this.$toast('非法参数')
				this.back()
			}
			let {
				id,
				book_id
			} = e
			this.id = id
			this.book_id = book_id

			this.getData()
		},
		data() {
			return {
				id: 0,
				book_id: 0,
				chapter: {},
				current: 0,
				total: 0,
			}
		},
		methods: {
			getData() {
				this.$load()
				this.$api.getBookChapter({
					id: this.id,
					book_id: this.book_id
				}).then(res => {
					this.chapter = res
					uni.setNavigationBarTitle({
						title: res.title
					})

					this.total = this.chapter.menus.length

					if (this.chapter.content == '') {
						this.chapter.content = '暂无内容'
					}

					if (this.chapter.menus.length == 0) {
						this.$toast('该章节没有内容')
						this.back()
					}

					let index = this.chapter.menus.findIndex(m => m.id == this.id)
					this.current = index + 1
				}).catch(err => {
					this.chapter.content = err
					if (err == '请先购买该电子书') {
						setTimeout(() => {
							uni.navigateBack({
								delta: 1
							});
						}, 700)
					}
				}).finally(() => {
					this.$hide()
				})
			},
			back() {
				setTimeout(() => {
					uni.navigateBack({
						delta: 1
					})
				}, 700)

			},
			onPage(value) {
				this.current = value
				this.getContent()
			},
			handleOpen() {
				this.open()
			},
			// menu-item 传递过来的事件
			changeChapter(index) {
				this.current = index + 1
				this.getContent()
			},
			getContent() {
				let item = this.chapter.menus[this.current - 1]
				if (item) {
					this.id = item.id
					this.chapter.content = ''
					this.getData()
					this.close()
				}
			},
			open() {
				this.$refs.showLeft.open()
			},
			close() {
				this.$refs.showLeft.close()
			}
		}
	}
</script>

<style>

</style>