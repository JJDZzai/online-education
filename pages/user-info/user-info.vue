<template>
	<view>
		<uni-list :border="false">
			<uni-list-item title="头像" :border="false" clickable @click="uploadAvatar">
				<image class="user-info-image bg-light" :src="form.avatar" mode="widthFix" slot="footer"></image>
			</uni-list-item>
			<uni-list-item title="昵称" :border="false">
				<input type="text" v-model="form.nickname" placeholder="未填写" placeholder-style="color: #ccc;"
					class="font" style="text-align: right;" slot="footer" />
			</uni-list-item>
			<uni-list-item title="性别" :border="false" clickable @click="selectSex">
				<text slot="footer">{{ form.sex }}</text>
			</uni-list-item>
			<uni-list-item title="手机" :border="false" clickable @click="navigateTo('../bind-phone/bind-phone')">
				<text slot="footer">{{ user.phone || '未绑定' }}</text>
			</uni-list-item>
		</uni-list>

		<view class="p-3">
			<main-btn @submit="handleEdit">保 存</main-btn>
		</view>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'

	export default {
		data() {
			return {
				form: {
					avatar: '',
					nickname: '',
					sex: '男'
				}
			}
		},
		created() {
			// 初始化编辑资料
			this.form = {
				avatar: this.user.avatar,
				nickname: this.user.nickname,
				sex: this.user.sex
			}
		},
		computed: {
			...mapState({
				user: state => state.user
			})
		},
		methods: {
			uploadAvatar() {
				uni.chooseImage({
					count: 1,
					success: (res) => {
						let file = res.tempFilePaths[0]
						this.$api.upload(file, (progress) => {}).then(url => {
							this.form.avatar = url
						})
					}
				})
			},
			selectSex() {
				let sexOptions = ['未知', '男', '女']
				uni.showActionSheet({
					itemList: sexOptions,
					success: (res) => {
						this.form.sex = sexOptions[res.tapIndex]
					},
				});

			},
			handleEdit() {
				uni.showLoading({
					title: '提交中...',
					mask: false
				})
				let data = Object.assign(this.form, {})
				this.$api.updateInfo(data).then(res => {
					this.$store.commit('UPDATEINFO', data)
					this.$toast('修改成功')
				}).finally(() => {
					uni.hideLoading()
				})
			},
		},
	}
</script>

<style>
	.user-info-image {
		width: 80rpx;
		height: 80rpx;
		border-radius: 100%;
	}

	.uni-list-item__content {
		display: flex !important;
		justify-content: center !important;
	}
</style>