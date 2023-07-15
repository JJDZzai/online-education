<template>
	<view>
		<view class="p-2">
			<course-list :item="orderInfo" colType="one"></course-list>
		</view>

		<view class="divider"></view>

		<uni-list>
			<uni-list-item title="优惠券" show-arrow :clickable="true" @click="chooseCoupon">
				<!-- <view class="font-sm" slot="footer" v-if="!price">
					{{ coupon_count ? '请选择优惠券(' + coupon_count + '张)' : '暂无可用' }} </view>
				<view class="font-sm" slot="footer" v-else>减 {{ price }} 元</view> -->
				<view class="flex align-center font-sm" slot="footer">{{ couponDesc }}</view>
			</uni-list-item>
			<uni-list-item title="支付方式">
				<view class="font text-success" slot="footer">微信支付</view>
			</uni-list-item>
		</uni-list>

		<view>
			<view style="height: 75px;"></view>
			<view class="fixed-bottom bg-white p-2 border-top">
				<main-btn @submit="handleSubmit">{{ couponPrice }}</main-btn>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				id: 0,
				type: null,
				// 产品信息
				orderInfo: {
					cover: "",
					id: 0,
					price: "",
					title: "",
					type: ""
				},
				// 优惠券数量
				coupon_count: 0,
				// 使用优惠券返回的数据
				user_coupon_id: 0,
				price: 0
			}
		},
		onLoad(e) {
			if (!e.id || !e.type) {
				this.$toast('非法参数')
				setTimeout(() => {
					uni.navigateBack({
						delta: 1
					})
				}, 700)
				return
			}
			this.id = e.id
			this.type = e.type

			this.getData()

			// 监听选择优惠券
			uni.$on('chooseCoupon', this.handleChooseCoupon)
		},
		beforeDestroy() {
			uni.$off('chooseCoupon', this.handleChooseCoupon)
		},
		computed: {
			couponDesc() {
				if (this.price) {
					return `减 ${this.price} 元`
				}

				return this.coupon_count ? '请选择优惠券(' + this.coupon_count + '张)' : '暂无可用'
			},
			couponPrice() {
				if (this.price) {
					return `立即订购 ￥${((this.orderInfo.price * 1000 - this.price * 1000) / 1000).toFixed(2)}`
				}

				return `立即订购 ￥${this.orderInfo.price}`
			}
		},
		methods: {
			// 监听选择优惠券
			handleChooseCoupon(value) {
				this.user_coupon_id = value.user_coupon_id
				this.price = value.price
			},
			getData() {
				this.$load('加载中...')
				this.$api.readGoods({
					id: this.id,
					type: this.type
				}).then(res => {
					this.orderInfo = res
					this.getCoupon()
				}).finally(() => {
					this.$hide()
				})
			},
			getCoupon() {
				this.$api.getUserCouponCount({
					goods_id: this.id,
					type: this.type == 'course' ? 'course' : 'column'
				}).then(res => {
					this.coupon_count = res
				})
			},
			chooseCoupon() {
				if (this.coupon_count == 0) {
					return this.$toast('没有可用的优惠券哦')
				}

				let goods_id = this.id
				let type = this.type
				this.authJump(`../my-coupon/my-coupon?goods_id=${goods_id}&type=${type}`)
			},
			// H5 支付
			handleSubmit() {
				this.$load('订单创建中...')
				this.$api.createOrder({
					goods_id: this.orderInfo.id,
					type: this.type,
					user_coupon_id: this.user_coupon_id
				}).then(res => {
					/* 进行支付，跳转到支付页面 */

					// H5支付
					// #ifdef H5
					let no = res.no
					this.navigateTo('../H5pay/H5pay?no=' + no)
					
					// #endif
				}).finally(() => {
					this.$hide()
				})
			}
		}
	}
</script>

<style>

</style>