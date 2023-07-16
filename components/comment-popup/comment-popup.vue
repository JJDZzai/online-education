<template>
	<view>
		<uni-popup ref="popup" type="bottom">
			<view class="bg-white" style="width: 750rpx; height: 500rpx;">
				<view class="flex justify-between align-center border-bottom px-3" style="height: 100rpx;">
					<text class="font text-muted">发表</text>
					<view>
						<button type="primary" size="mini" :disabled="!content" @click="send">发送</button>
					</view>
				</view>
				<view class="p-2">
					<textarea class="w-100 font" v-model="content" placeholder="发表评论..." />
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	export default {
		name: "comment-popup",
		data() {
			return {
				content: ''
			};
		},
		methods: {
			open() {
				this.$refs.popup.open()
			},
			send() {
				this.$emit('send', this.content)
				this.$refs.popup.close()
				this.content = ''
			}
		}
	}
</script>

<style>

</style>