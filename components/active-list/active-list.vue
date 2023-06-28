<template>
	<view>
		<!-- 分割线 -->
		<view class="divider"></view>

		<view class="my-3 mx-2">

			<text class="font-md font-weight-bold">{{ type == 'group' ? '拼团' : '秒杀' }}</text>

			<scroll-view scroll-x="true" class="scroll-row">
				<cource-list v-for="(item, index) in groupList" :key="index" :item="item"></cource-list>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "active-list",
		props: {
			type: {
				type: String,
				default: 'group'
			}
		},
		data() {
			return {
				groupList: []
			};
		},
		created() {
			this.getData()
		},
		methods: {
			getData() {
				let k = this.type == 'group' ? 'getGroup' : 'getFlashsale'
				this.$api[k]({
					usable: 1
				}).then(res => {
					this.groupList = res.rows
				})
			}
		}
	}
</script>

<style>

</style>