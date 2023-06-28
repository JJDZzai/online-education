<script>
	export default {
		onLaunch: function() {
			console.warn('当前组件仅支持 uni_modules 目录结构 ，请升级 HBuilderX 到 3.1.0 版本以上！')
			console.log('App Launch')
			// 调用初始化数据，防止刷新数据丢失
			this.$store.dispatch('init')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	// /*每个页面公共css */
	// @import '@/uni_modules/uni-scss/index.scss';
	// /* #ifndef APP-NVUE */
	// @import '@/static/customicons.css';
	// // 设置整个项目的背景色
	// page {
	// 	background-color: #f5f5f5;
	// }

	// /* #endif */
	// .example-info {
	// 	font-size: 14px;
	// 	color: #333;
	// 	padding: 10px;
	// }
	
	// 公共 css
	@import '@/common/free.css';
	
	@import '@/common/common.css';
	
	// 动画库
	@import '@/common/animate.min.css';
	
	// 图标库
	@import '@/common/iconfont.css';
</style>
