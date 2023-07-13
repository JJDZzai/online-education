<template>
	<view>
		<uni-fav :checked="isfava ? true : false" :circle="true" @click="handleCollect" />
	</view>
</template>

<script>
	export default {
		name: "collect-btn",
		props: {
			goods_id: {
				type: Number,
				default: 0
			},
			type: {
				type: String,
				default: ''
			},
			isfava: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {};
		},
		methods: {
			handleCollect() {
				let fun = this.isfava ? 'uncollect' : 'collect'
				let msg = this.isfava ? '取消收藏' : '已收藏'

				this.$api[fun]({
					goods_id: this.goods_id,
					type: this.type
				}).then(res => {
					this.$toast(msg)
					this.$emit('refresh', fun == 'collect' ? true : false)
				})
			}
		}
	}
</script>

<style>

</style>