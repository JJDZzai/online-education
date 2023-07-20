<template>
	<view>
		<post-count :item="detail" iscontent></post-count>

		<!-- 评论 -->
		<view class="">
			<view class="comment-list" v-for="(item, index) in comment" :key="index">
				<image :src="item.user.avatar" mode="widthFix"></image>
				<view class="flex-1">
					<view class="nickname">{{ item.user.name }}</view>
					<view class="content" @click="handlePopup({reply_id:item.id,reply_user:item.user})">
						{{ item.content }}
					</view>
					<view class="date">{{ item.created_time | formatDate }}</view>

					<!-- 回复 -->
					<view class="rounded bg-light mt-2" v-if="item.post_comments.length > 0">
						<view class="comment-list mb-2" v-for="(com, index) in item.post_comments" :key="index">
							<image :src="com.user.avatar" mode="widthFix"></image>
							<view class="flex-1">
								<view class="flex">
									<view class="nickname">{{ com.user.name }}</view>
									<!-- @ 主要人 -->
									<view class="nickname ml-1">@{{ com.reply_user.name }}</view>
								</view>

								<view class="content" @click="handlePopup({reply_id:item.id,reply_user:com.user})">
									{{ com.content }}
								</view>
								<view class="date">{{ com.created_time | formatDate }}</view>
							</view>
						</view>
					</view>
				</view>
			</view>

			<view class="p-2">
				<button class="flex flex-1 justify-center w-100 mb-3" type="default" size="mini"
					:disabled="loadStatus != 'more'"
					@click="loadMore">{{ loadStatus == 'more' ? '点击加载更多' : (loadStatus == 'noMore' ? '没有更多加载了' : '加载中...') }}</button>
			</view>

			<view style="height: 50px;"></view>
			<view class="flex fixed-bottom bg-white border-top p-2">
				<view class="flex-1 text-muted bg-light border rounded p-2" style="font-size: 28rpx;"
					@click="handlePopup(false)">说一句吧</view>
				<view class="flex align-center" :class="detail.issupport ? 'text-danger' : ''" @click="handleSupport">
					<text class="iconfont icon-dianzan2 ml-2" style="font-size: 40rpx;"></text>
					<text class="ml-1" style="font-size: 30rpx;">{{ detail.support_count || '点赞' }}</text>
				</view>
			</view>
		</view>

		<comment-popup ref="popupRef" @send="sendComment"></comment-popup>
	</view>
</template>

<script>
	import tool from '@/common/tool.js'

	export default {
		filters: {
			formatDate(value) {
				return tool.getHumanTime(value)
			}
		},
		data() {
			return {
				// 详情
				detail: {
					id: 0,
					content: [],
					user: {
						id: 0,
						avatar: "",
						sex: "",
						name: ""
					},
					issupport: false,
					support_count: 0
				},
				// 评论
				page: 1,
				comment: [],
				loadStatus: 'loading',
				commentForm: {
					reply_id: 0,
					reply_user: null
				}
			}
		},
		onLoad(e) {
			if (!e.id) {
				this.$toast('非法参数')
				setTimeout(() => {
					uni.navigateBack({
						delta: 1
					})
				}, 700)
			}
			this.detail.id = e.id

			this.getDetail()
			this.getList()
		},
		methods: {
			getDetail() {
				this.$api.readPost({
					id: this.detail.id
				}).then(res => {
					this.detail = res
				})
			},
			getList() {
				this.loadStatus = 'loading'
				this.$api.readPostComment({
					page: this.page,
					post_id: this.detail.id
				}).then(res => {
					this.comment = this.page == 1 ? res.rows : [...this.comment, ...res.rows],
						this.loadStatus = res.rows.length < 10 ? 'noMore' : 'more'
				}).catch(() => {
					if (this.page > 0) {
						this.loadStatus = 'more'
						this.page -= 1
					}
				})
			},
			loadMore() {
				if (this.loadStatus != 'more') {
					return
				}
				this.page++
				this.getList()
			},
			handleSupport() {
				let item = this.detail

				let k = item.issupport ? 'postUnsupport' : 'postSupport'
				let msg = item.issupport ? '取消成功' : '点赞成功'

				this.$api[k]({
					post_id: this.detail.id
				}).then(res => {
					this.$toast(msg)
					item.issupport = item.issupport ? item.support_count - 1 : item.support_count + 1
					item.issupport = !item.issupport
					this.getDetail()
					uni.$emit('refreshBbs')
				})
			},
			// 打开 popup 弹窗
			handlePopup(val) {
				if (val) {
					this.commentForm.reply_id = val.reply_id
					this.commentForm.reply_user = val.reply_user
					this.commentForm.reply_user.username = val.reply_user.name
				} else {
					this.commentForm = {
						reply_id: 0,
						reply_user: null
					}
				}
				this.$refs.popupRef.open()
			},
			// 接收 comment-popup 传递过来的事件
			sendComment(content) {
				let cont = content.replace(/(^\s*)|(\s*$)/g, "");
				if (cont == '') {
					return this.$toast('评论内容不能为空')
				}

				let data = {
					post_id: this.detail.id,
					content,
					reply_id: 0
				}
				if (this.commentForm.reply_user) {
					data.reply_id = this.commentForm.reply_id
					data.reply_user = this.commentForm.reply_user
				}
				this.$api.replyPost(data).then(res => {
					this.$toast('评论成功')
					this.page = 1
					this.getList()
					uni.$emit('refreshBbs')
				})
			}
		}
	}
</script>

<style>
	.comment-list {
		display: flex;
		width: 100%;
		padding: 30rpx;
		box-sizing: border-box;
	}

	.comment-list image {
		flex-shrink: 0;
		width: 75rpx;
		height: 75rpx;
		border-radius: 100%;
		margin-right: 20rpx;
		background-color: #EEEEEE;
	}

	.comment-list .nickname {
		color: #007bff;
		font-weight: bold;
	}

	.comment-list .content {
		color: #6c757d;
		font-size: 30rpx;
		padding: 8rpx 0;
	}

	.comment-list .date {
		color: #A9A5A0;
		font-size: 30rpx;
	}
</style>