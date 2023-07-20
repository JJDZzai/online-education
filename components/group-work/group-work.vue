<template>
	<view>
		<uni-card :title="count + '人在拼单, 可直接参与'" is-full v-if="count > 0">
			<swiper :style="{ height: count > 1 ? '250rpx' : '125rpx' }" vertical disable-touch :autoplay="true"
				circular :interval="3000" :duration="1000" :display-multiple-items="count > 1 ? 2 : 1">
				<swiper-item class="flex align-center" v-for="(item, index) in list" :key="index">
					<view class="flex align-center" v-for="(user, index) in item.users">
						<image class="bg-light rounded-circle mr-2" style="width: 78rpx; height: 78rpx;"
							:src="user.avatar" mode="widthFix"></image>
						<text>{{ user.username || user.nickname }}</text>
					</view>
					<view class="ml-auto mr-1">
						<view class="flex mb-1">
							还差<text class="text-danger">{{ item.total - item.num }}人</text>拼成
						</view>
						<view class="flex align-center text-light-muted">
							<text>剩余</text>
							<uni-countdown color="#AAAAAA" background-color="#FFFFFF" :hour="time.t.hour"
								:minute="time.t.minute" :second="time.t.second" :show-day="false"></uni-countdown>
						</view>
					</view>
					<view>
						<button type="primary" size="mini" @click="handleCollage(item)">去拼单</button>
					</view>
				</swiper-item>
			</swiper>
		</uni-card>
	</view>
</template>

<script>
	import tool from '@/common/tool.js'

	export default {
		name: "group-collage",
		data() {
			return {
				count: 1,
				list: [],
				group_id: 0
			};
		},
		methods: {
			init(group_id) {
				this.group_id = group_id
				this.$api.getGroupWorkList({
					group_id: this.group_id,
					page: 1
				}).then(res => {
					console.log(res);

					this.count = res.count
					this.list = res.rows.map(r => {
						let time = new Date(r.created_time).getTime()
						r.t = tool.dateCount(time)
						return t
					})
				})
			},
			handleCollage(itme) {
				uni.showModal({
					content: '是否要参加此次拼单',
					confirmText: '立即参与',
					success: (res) => {
						if (res.cancel) {
							return
						}
						this.$load('发起拼团中...')
						this.$api.createOrder({
							group_id: this.group_id,
							group_work_id: item.id
						}, 'group').then((res) => {
							// H5支付，只在H5端生效
							// #ifdef H5
							let no = res.no
							this.navigateTo('../H5pay/H5pay?no=' + no)
							// #endif

							// APP支付，只在APP端生效
							// #ifdef APP-PLUS
							tool.appPay(res.no, () => {
								this.$emit('updateData')
							})
							// #endif
						}).catch(err => {

						}).finally(() => {
							this.$hide()
						})
					}
				});
			}
		}
	}
</script>

<style>

</style>