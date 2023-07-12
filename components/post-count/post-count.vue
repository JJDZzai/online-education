<template>
	<view>
		<view class="p-3">
			<view class="flex align-center">
				<view class="flex align-center">
					<image class="mr-2 bg-light rounded-circle" style="width: 75rpx; height: 75rpx;"
						:src="item.user.avatar" mode="widthFix"></image>
					<view class="flex flex-column">
						<text class="text-primary font-weight-bold">{{ item.user.name }}</text>
						<text class="text-muted font">{{ item.user.sex }}</text>
					</view>
				</view>
				<view class="ml-auto text-white bg-warning font-sm px-1 py" v-if="!item.is_top">精华</view>
			</view>

			<!-- 只在社区列表显示 -->
			<view class="mt-3" @click="open" v-if="!iscontent">
				<text>{{ item.desc.text }}</text>
				<view class="flex flex-wrap mt-1">
					<view style="width: 33.33%;" v-for="(src, index) in item.desc.images" :key="index">
						<image class="rounded" style="width: 220rpx; height: 220rpx;" :src="src" mode="aspectFill">
						</image>
					</view>
				</view>
			</view>

			<!-- 只在社区详情显示 -->
			<view v-else v-for="(each, index) in item.content" :key="index">
				<view class="my-3">
					<text>{{ each.text }}</text>
				</view>
				<view v-for="(img, index) in each.images" :key="index">
					<image :src="img" mode="aspectFill"></image>
				</view>
			</view>

			<view class="flex justify-between mt-3" v-if="!iscontent">
				<view class="flex">
					<view class="flex align-center mr-3">
						<text class="iconfont icon-pinglun2" style="font-size: 20px;"></text>
						<text class="ml-1">{{ item.comment_count == 0 ? '评论' : item.comment_count }}</text>
					</view>
					<view class="flex align-center" :class="item.issupport ? 'text-danger' : ''"
						@click="$emit('support',item.id)">
						<text class="iconfont icon-dianzan2" style="font-size: 20px;"></text>
						<text class="ml-1">{{ item.support_count == 0 ? '点赞' : item.support_count }}</text>
					</view>
					<view class="ml-3" v-if="showDel">
						<text class="text-danger font" @click="deletePost">删除</text>
					</view>
				</view>
				<view class="text-light-muted font">{{ item.created_time }}</view>
			</view>
		</view>

		<view class="divider"></view>
	</view>
</template>

<script>
	export default {
		name: "post-count",
		props: {
			item: {
				type: Object,
				default: () => {}
			},
			iscontent: {
				type: Boolean,
				default: false
			},
			showDel: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {

			};
		},
		methods: {
			open() {
				this.navigateTo('/pages/post-detail/post-detail?id=' + this.item.id)
			},
			deletePost() {
				this.$emit('delete',this.item.id)
			}
		}
	}
</script>

<style>

</style>