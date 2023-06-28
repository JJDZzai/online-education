<template>
	<view>
		<uni-list :border="false">
			<uni-list-item :border="false" title="原密码" show-arrow>
				<input type="text" v-model="form.opassword" placeholder="请输入原密码"
					placeholder-style="color: #ccc;" class="font text-muted" style="text-align: right;" slot="footer" />
			</uni-list-item>
			<uni-list-item :border="false" title="新密码" show-arrow>
				<input type="text" v-model="form.password" placeholder="请输入新密码"
					placeholder-style="color: #ccc;" class="font" style="text-align: right;" slot="footer" />
			</uni-list-item>
			<uni-list-item :border="false" title="确认密码" show-arrow>
				<input type="text" v-model="form.repassword" placeholder="请输入确认密码"
					placeholder-style="color: #ccc;" class="font" style="text-align: right;" slot="footer" />
			</uni-list-item>
		</uni-list>

		<view class="p-3">
			<main-btn @submit="handleSave">保 存</main-btn>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				form: {
					opassword: "",
					password: "",
					repassword: ""
				}
			}
		},
		methods: {
			handleSave() {
				uni.showLoading({
					title: '保存中...',
					mask: true
				})
				let data = Object.assign(this.form, {})
				this.$api.updatePassword(data).then(res => {
					this.$toast('修改成功')
					setTimeout(() => {
						uni.navigateBack({
							delta: 1
						})
						this.$store.commit('LOGOUT')
					}, 350)
				}).finally(() => {
					uni.hideLoading()
				})
			}
		}
	}
</script>

<style>

</style>